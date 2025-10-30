import { useState } from 'react';
import { 
  ArrowLeft, Upload, X, DollarSign, MapPin, 
  ShoppingBag, Home, Briefcase, Wrench, CheckCircle,
  Image as ImageIcon, Loader2, Youtube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { uploadListingImages } from '@/utils/upload';

const CreateListing = () => {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState<'product' | 'housing' | 'job' | 'service'>('product');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    city: '',
    country: '',
    condition: '',
    bedrooms: '',
    bathrooms: '',
    salary: '',
    jobType: '',
    experience: '',
    phone: '',
    email: '',
    videoUrl: '',
    featured: false
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - imageFiles.length);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setImageFiles(prev => [...prev, ...newFiles].slice(0, 5));
    setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 5));
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if ((listingType === 'product' || listingType === 'service' || listingType === 'housing') && !formData.price) {
      toast.error('Please set a price');
      return;
    }

    if (listingType === 'job' && !formData.salary) {
      toast.error('Please set salary information');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('You must be logged in to create a listing');
        navigate('/auth/login');
        return;
      }

      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        toast.loading('Uploading images...', { id: 'upload' });
        imageUrls = await uploadListingImages(imageFiles, user.id);
        toast.success('Images uploaded', { id: 'upload' });
      }

      const locationParts = formData.location.split(',').map(s => s.trim());
      const city = formData.city || locationParts[0] || 'Unknown';
      const country = formData.country || locationParts[locationParts.length - 1] || 'Unknown';

      const categoryMap: Record<string, string> = {
        'product': 'forsale',
        'housing': 'housing',
        'job': 'jobs',
        'service': 'services'
      };

      const listingData = {
        user_id: user.id,
        category: categoryMap[listingType],
        subcategory: formData.category,
        title: formData.title,
        description: formData.description,
        city,
        country,
        price_cents: formData.price ? Math.round(parseFloat(formData.price) * 100) : null,
        currency: 'USD',
        images: imageUrls,
        video_url: formData.videoUrl || null,
        condition: formData.condition || null,
        bedrooms: formData.bedrooms || null,
        bathrooms: formData.bathrooms || null,
        salary: formData.salary || null,
        job_type: formData.jobType || null,
        experience: formData.experience || null,
        phone: formData.phone || null,
        email: formData.email || null,
        featured: formData.featured,
        status: 'active'
      };

      const { data: listing, error: insertError } = await supabase
        .from('listings')
        .insert(listingData as any)
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success('Listing created successfully! 🎉');
      setTimeout(() => navigate('/marketplace'), 1500);
    } catch (error: any) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing', {
        description: error.message || 'Please try again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const listingTypes = [
    { 
      value: 'product', 
      label: 'Product', 
      label_ti: 'ኣቕሑ',
      icon: ShoppingBag, 
      color: 'from-green-500 to-emerald-500',
      description: 'Sell items and goods'
    },
    { 
      value: 'housing', 
      label: 'Housing', 
      label_ti: 'ገዛ',
      icon: Home, 
      color: 'from-purple-500 to-pink-500',
      description: 'Rent or sell property'
    },
    { 
      value: 'job', 
      label: 'Job/Gig', 
      label_ti: 'ስራሕ',
      icon: Briefcase, 
      color: 'from-amber-500 to-orange-500',
      description: 'Post job openings'
    },
    { 
      value: 'service', 
      label: 'Service', 
      label_ti: 'ኣገልግሎት',
      icon: Wrench, 
      color: 'from-rose-500 to-red-500',
      description: 'Offer your services'
    }
  ];

  const productCategories = [
    'Womenswear & Underwear',
    'Menswear & Underwear',
    'Kids\' Fashion',
    'Shoes',
    'Fashion Accessories',
    'Luggage & Bags',
    'Jewelry & Accessories',
    'Phones & Electronics',
    'Computers & Office Equipment',
    'Furniture',
    'Home Supplies',
    'Kitchenware',
    'Household Appliances',
    'Home Improvement',
    'Textiles & Soft Furnishings',
    'Tools & Hardware',
    'Beauty & Personal Care',
    'Health',
    'Baby & Maternity',
    'Toys & Hobbies',
    'Sports & Outdoor',
    'Pet Supplies',
    'Food & Beverages',
    'Books, Magazines & Audio',
    'Collectibles',
    'Automotive & Motorcycle',
    'Virtual Products',
    'Pre-Owned',
    'Traditional Items',
    'Other'
  ];

  const housingCategories = [
    'Apartments',
    'Houses',
    'Rooms',
    'Shared Housing',
    'Vacation Rentals',
    'Commercial Property',
    'Land',
    'Storage Space',
    'Parking',
    'Other'
  ];

  const jobCategories = [
    'Technology & IT',
    'Healthcare',
    'Education & Training',
    'Food Service & Hospitality',
    'Retail & Sales',
    'Construction & Trades',
    'Transportation & Driving',
    'Translation & Interpretation',
    'Customer Service',
    'Administrative & Office',
    'Creative & Design',
    'Marketing & Advertising',
    'Finance & Accounting',
    'Legal',
    'Childcare',
    'Cleaning & Maintenance',
    'Security',
    'Manufacturing & Warehouse',
    'Remote/Work from Home',
    'Other'
  ];

  const serviceCategories = [
    'Tutoring & Education',
    'Translation & Interpretation',
    'Cleaning Services',
    'Repair & Maintenance',
    'Photography & Videography',
    'Event Planning',
    'Catering & Food Services',
    'Beauty & Personal Care',
    'Health & Wellness',
    'Legal Services',
    'Financial Services',
    'Moving & Delivery',
    'Pet Services',
    'Childcare',
    'Home Improvement',
    'Technology Support',
    'Writing & Editing',
    'Music & Entertainment',
    'Consulting',
    'Other'
  ];

  const getCurrentCategories = () => {
    switch (listingType) {
      case 'product': return productCategories;
      case 'housing': return housingCategories;
      case 'job': return jobCategories;
      case 'service': return serviceCategories;
      default: return productCategories;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} disabled={isSubmitting}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg font-bold">Create Listing</h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {/* Step 1: Choose Type - COMPACT FOR MOBILE */}
        <Card className="p-4 md:p-6 mb-4">
          <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6">What are you listing?</h2>
          
          {/* MOBILE: Horizontal scroll with compact cards */}
          <div className="flex md:hidden gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {listingTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = listingType === type.value;
              
              return (
                <div
                  key={type.value}
                  onClick={() => !isSubmitting && setListingType(type.value as any)}
                  className={`flex-shrink-0 w-32 snap-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border'
                  } ${isSubmitting ? 'opacity-50' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm">{type.label}</h3>
                  <p className="text-xs text-muted-foreground">{type.label_ti}</p>
                </div>
              );
            })}
          </div>

          {/* DESKTOP: Grid layout */}
          <div className="hidden md:grid md:grid-cols-4 gap-4">
            {listingTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = listingType === type.value;
              
              return (
                <div
                  key={type.value}
                  onClick={() => !isSubmitting && setListingType(type.value as any)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-1">{type.label}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{type.label_ti}</p>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Step 2: Basic Information */}
        <Card className="p-4 md:p-6 mb-4">
          <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm">
                Title *
              </Label>
              <Input
                id="title"
                placeholder={`Enter ${listingType} title`}
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className="mt-1"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className="mt-1 min-h-[120px]"
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length} characters
              </p>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => updateFormData('category', value)}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {getCurrentCategories().map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location" className="text-sm">Location *</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="City, State/Country"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  className="pl-10"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Step 3: Type-Specific Fields */}
        <Card className="p-4 md:p-6 mb-4">
          <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">
            {listingType === 'product' && 'Product Details'}
            {listingType === 'housing' && 'Property Details'}
            {listingType === 'job' && 'Job Details'}
            {listingType === 'service' && 'Service Details'}
          </h2>

          <div className="space-y-4">
            {/* Product Fields */}
            {listingType === 'product' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="price" className="text-sm">Price (USD) *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => updateFormData('price', e.target.value)}
                        className="pl-8"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="condition" className="text-sm">Condition</Label>
                    <Select 
                      value={formData.condition} 
                      onValueChange={(value) => updateFormData('condition', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Housing Fields */}
            {listingType === 'housing' && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3 sm:col-span-1">
                    <Label htmlFor="price" className="text-sm">Rent (USD) *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="1500"
                        value={formData.price}
                        onChange={(e) => updateFormData('price', e.target.value)}
                        className="pl-8"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bedrooms" className="text-sm">Beds</Label>
                    <Select 
                      value={formData.bedrooms} 
                      onValueChange={(value) => updateFormData('bedrooms', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4+">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bathrooms" className="text-sm">Baths</Label>
                    <Select 
                      value={formData.bathrooms} 
                      onValueChange={(value) => updateFormData('bathrooms', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="1.5">1.5</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="2.5">2.5</SelectItem>
                        <SelectItem value="3+">3+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Job Fields */}
            {listingType === 'job' && (
              <>
                <div>
                  <Label htmlFor="salary" className="text-sm">Salary/Pay *</Label>
                  <Input
                    id="salary"
                    placeholder="e.g., $25-35/hr or $60k-80k/year"
                    value={formData.salary}
                    onChange={(e) => updateFormData('salary', e.target.value)}
                    className="mt-1"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="jobType" className="text-sm">Type</Label>
                    <Select 
                      value={formData.jobType} 
                      onValueChange={(value) => updateFormData('jobType', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experience" className="text-sm">Experience</Label>
                    <Select 
                      value={formData.experience} 
                      onValueChange={(value) => updateFormData('experience', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry</SelectItem>
                        <SelectItem value="mid">Mid (2-5y)</SelectItem>
                        <SelectItem value="senior">Senior (5y+)</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Service Fields */}
            {listingType === 'service' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="price" className="text-sm">Hourly Rate *</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="30"
                      value={formData.price}
                      onChange={(e) => updateFormData('price', e.target.value)}
                      className="pl-8"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience" className="text-sm">Experience</Label>
                  <Select 
                    value={formData.experience} 
                    onValueChange={(value) => updateFormData('experience', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Step 4: Images */}
        <Card className="p-4 md:p-6 mb-4">
          <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">Images</h2>
          
          <div className="space-y-3">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors">
              <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Upload up to 5 images
              </p>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isSubmitting || imageFiles.length >= 5}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('images')?.click()}
                disabled={isSubmitting || imageFiles.length >= 5}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Step 5: Video (Optional) */}
        <Card className="p-4 md:p-6 mb-4">
          <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">Video (Optional)</h2>
          
          <div>
            <Label htmlFor="videoUrl" className="text-sm">YouTube Video Link</Label>
            <div className="relative mt-1">
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="videoUrl"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={(e) => updateFormData('videoUrl', e.target.value)}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Add a video tour or demonstration
            </p>
          </div>
        </Card>

        {/* Step 6: Contact */}
        <Card className="p-4 md:p-6 mb-4">
          <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">Contact (Optional)</h2>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="phone" className="text-sm">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 sticky bottom-4 bg-background/95 backdrop-blur-lg p-4 -mx-4 border-t md:relative md:bottom-0 md:p-0 md:mx-0 md:border-0 md:bg-transparent">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Publish
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
