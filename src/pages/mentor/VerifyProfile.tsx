import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Upload, Loader2 } from 'lucide-react';
import { VerifiedBadge } from '@/components/VerifiedBadge';

export default function VerifyProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [existingVerification, setExistingVerification] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    bioStatement: '',
    socialLinks: ['', '', ''],
    documentsUrl: ['']
  });

  useEffect(() => {
    checkMentorStatus();
  }, []);

  const checkMentorStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }

      // Get mentor profile
      const { data: mentor } = await supabase
        .from('mentors')
        .select('id, is_verified')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!mentor) {
        toast({
          title: "No mentor profile",
          description: "Please create a mentor profile first.",
          variant: "destructive",
        });
        navigate('/mentor/onboarding');
        return;
      }

      setMentorId(mentor.id);

      // Check for existing verification
      const { data: verification } = await supabase
        .from('mentor_verifications')
        .select('*')
        .eq('mentor_id', mentor.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      setExistingVerification(verification);

      if (verification) {
        setFormData({
          bioStatement: verification.bio_statement || '',
          socialLinks: verification.social_links || ['', '', ''],
          documentsUrl: verification.documents_url || ['']
        });
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorId) return;

    setLoading(true);
    try {
      const socialLinks = formData.socialLinks.filter(link => link.trim());
      const documentsUrl = formData.documentsUrl.filter(url => url.trim());

      if (!formData.bioStatement.trim()) {
        toast({
          title: "Bio statement required",
          description: "Please explain why you want to be a verified mentor.",
          variant: "destructive",
        });
        return;
      }

      if (socialLinks.length === 0) {
        toast({
          title: "Social proof required",
          description: "Please provide at least one social media or professional link.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('mentor_verifications')
        .insert({
          mentor_id: mentorId,
          bio_statement: formData.bioStatement,
          social_links: socialLinks,
          documents_url: documentsUrl,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Verification submitted!",
        description: "Your profile will be reviewed by our team within 2-3 business days.",
      });

      navigate('/mentor/dashboard');
    } catch (error) {
      console.error('Error submitting:', error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">Mentor Verification</h1>
          <p className="text-muted-foreground">
            Get verified to build trust and increase bookings
          </p>
        </div>

        {existingVerification && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Current Status
                <VerifiedBadge 
                  isVerified={existingVerification.status === 'approved'} 
                  showLabel={true}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {existingVerification.status === 'pending' && (
                <p className="text-sm text-muted-foreground">
                  Your verification is under review. We'll notify you once it's complete.
                </p>
              )}
              {existingVerification.status === 'rejected' && existingVerification.admin_notes && (
                <div className="space-y-2">
                  <p className="text-sm text-destructive">
                    Your verification was not approved.
                  </p>
                  <div className="p-3 bg-destructive/10 rounded-md">
                    <p className="text-sm font-medium">Admin feedback:</p>
                    <p className="text-sm">{existingVerification.admin_notes}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can resubmit with updated information below.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Verification Requirements</CardTitle>
            <CardDescription>
              Provide information to verify your identity and expertise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bioStatement">Why do you want to be a verified mentor? *</Label>
                <Textarea
                  id="bioStatement"
                  placeholder="Explain your experience, qualifications, and what you hope to accomplish as a mentor..."
                  value={formData.bioStatement}
                  onChange={(e) => setFormData({ ...formData, bioStatement: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Social Proof Links (at least one required) *</Label>
                <p className="text-sm text-muted-foreground">
                  LinkedIn, GitHub, personal website, portfolio, etc.
                </p>
                {formData.socialLinks.map((link, index) => (
                  <Input
                    key={index}
                    type="url"
                    placeholder={`Link ${index + 1} (e.g., https://linkedin.com/in/yourprofile)`}
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...formData.socialLinks];
                      newLinks[index] = e.target.value;
                      setFormData({ ...formData, socialLinks: newLinks });
                    }}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <Label>Supporting Documents (optional)</Label>
                <p className="text-sm text-muted-foreground">
                  Upload links to certifications, ID verification, or other credentials
                </p>
                {formData.documentsUrl.map((url, index) => (
                  <Input
                    key={index}
                    type="url"
                    placeholder={`Document URL ${index + 1}`}
                    value={url}
                    onChange={(e) => {
                      const newDocs = [...formData.documentsUrl];
                      newDocs[index] = e.target.value;
                      setFormData({ ...formData, documentsUrl: newDocs });
                    }}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ 
                    ...formData, 
                    documentsUrl: [...formData.documentsUrl, ''] 
                  })}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Another Document
                </Button>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={loading || existingVerification?.status === 'pending'}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    existingVerification?.status === 'pending' ? 'Already Submitted' : 'Submit for Verification'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/mentor/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
