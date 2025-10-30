import { useState } from 'react';
import { 
  ArrowLeft, Upload, X, DollarSign, MapPin, 
  ShoppingBag, Home, Briefcase, Wrench, CheckCircle,
  Image as ImageIcon, Info, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

    // Validation
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
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('You must be logged in to create a listing');
        navigate('/auth/login');
        return;
      }

      // Upload images if any
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        toast.loading('Uploading images...', { id: 'upload' });
        imageUrls = await uploadListingImages(imageFiles, user.id);
        toast.success('Images uploaded', { id: 'upload' });
      }

      // Parse location
      const locationParts = formData.location.split(',').map(s => s.trim());
      const city = formData.city || locationParts[0] || 'Unknown';
      const country = formData.country || locationParts[locationParts.length - 1] || 'Unknown';

      // Map UI category to DB category
      const categoryMap: Record<string, string> = {
        'product': 'forsale',
        'housing': 'housing',
        'job': 'jobs',
        'service': 'services'
      };

      // Prepare listing data
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

      // Insert listing - cast to any to bypass type checking for new fields
      const { data: listing, error: insertError } = await supabase
        .from('listings')
        .insert(listingData as any)
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success('Listing created successfully! 🎉', {
        description: 'Your listing is now live on the marketplace'
      });

      setTimeout(() => {
        navigate('/marketplace');
      }, 1500);
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
    // Clothing & Fashion
    'Womenswear & Underwear',
    'Menswear & Underwear',
    "Kids' Fashion",
    'Shoes',
    'Fashion Accessories',
    'Luggage & Bags',
    'Jewelry & Accessories',

    // Electronics & Tech
    'Phones & Electronics',
    'Computers & Office Equipment',

    // Home & Living
    'Furniture',
    'Home Supplies',
    'Kitchenware',
    'Household Appliances',
    'Home Improvement',
    'Textiles & Soft Furnishings',
    'Tools & Hardware',

    // Health & Beauty
    'Beauty & Personal Care',
    'Health',

    // Baby & Kids
    'Baby & Maternity',
    'Toys & Hobbies',

    // Sports & Outdoors
    'Sports & Outdoor',

    // Pets
    'Pet Supplies',

    // Food & Beverages
    'Food & Beverages',

    // Media & Entertainment
    'Books, Magazines & Audio',
    'Collectibles',

    // Automotive
    'Automotive & Motorcycle',

    // Other
    'Virtual Products',
    'Pre-Owned',
    'Traditional Items',
    'Other'
  ];

  const housingCategories = [
    'Apartments', 'Houses', 'Rooms', 'Commercial', 'Land', 'Other'
  ];

  const jobCategories = [
    'Technology', 'Healthcare', 'Education', 'Food Service',
    'Retail', 'Construction', 'Translation', 'Driving', 'Other'
  ];

  const serviceCategories = [
    'Tutoring', 'Cleaning', 'Repairs', 'Translation',
    'Photography', 'Catering', 'Event Planning', 'Legal', 'Other'
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
      <div className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)} disabled={isSubmitting}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg md:text-xl font-bold">Create Listing</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Step 1: Choose Type */}
        <Card className="p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">What are you listing?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <Card className="p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">
                Title * 
                <span className="text-xs text-muted-foreground ml-2">
                  {listingType === 'product' && '(e.g., Traditional Ethiopian Coffee Set)'}
                  {listingType === 'housing' && '(e.g., 2BR Apartment near Community Center)'}
                  {listingType === 'job' && '(e.g., Tigrinya Translator Needed)'}
                  {listingType === 'service' && '(e.g., Tigrinya Language Tutor)'}
                </span>
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
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your listing..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className="mt-1 min-h-[150px]"
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formData.description.length} characters
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => updateFormData('category', value)}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getCurrentCategories().map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
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
        <Card className="p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">
            {listingType === 'product' && 'Product Details'}
            {listingType === 'housing' && 'Property Details'}
            {listingType === 'job' && 'Job Details'}
            {listingType === 'service' && 'Service Details'}
          </h2>

          <div className="space-y-6">
            {/* Product Fields */}
            {listingType === 'product' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (USD) *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => updateFormData('price', e.target.value)}
                        className="pl-10"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select 
                      value={formData.condition} 
                      onValueChange={(value) => updateFormData('condition', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select condition" />
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
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Monthly Rent (USD) *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="1500"
                        value={formData.price}
                        onChange={(e) => updateFormData('price', e.target.value)}
                        className="pl-10"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select 
                      value={formData.bedrooms} 
                      onValueChange={(value) => updateFormData('bedrooms', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
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
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select 
                      value={formData.bathrooms} 
                      onValueChange={(value) => updateFormData('bathrooms', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salary">Salary/Pay *</Label>
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

                  <div>
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select 
                      value={formData.jobType} 
                      onValueChange={(value) => updateFormData('jobType', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
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
                </div>

                <div>
                  <Label htmlFor="experience">Required Experience</Label>
                  <Select 
                    value={formData.experience} 
                    onValueChange={(value) => updateFormData('experience', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5+ years)</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Service Fields */}
            {listingType === 'service' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Hourly Rate (USD) *</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="30"
                      value={formData.price}
                      onChange={(e) => updateFormData('price', e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select 
                    value={formData.experience} 
                    onValueChange={(value) => updateFormData('experience', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select years" />
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
        <Card className="p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">Images</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="images">Upload Images (Up to 5)</Label>
              <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors">
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Click to upload or drag and drop
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
                  onClick={() => document.getElementById('images')?.click()}
                  disabled={isSubmitting || imageFiles.length >= 5}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Step 5: Contact Information */}
        <Card className="p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
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
              <Label htmlFor="email">Email</Label>
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
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Publish Listing
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
