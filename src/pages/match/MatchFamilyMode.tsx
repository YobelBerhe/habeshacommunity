import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { 
  Shield, User, MapPin, Briefcase, GraduationCap, Church, 
  Award, Check, ChevronRight, Star
} from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { useToast } from '@/hooks/use-toast';

export default function MatchFamilyMode() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const candidate = {
    name: 'Sara Desta',
    age: 27,
    location: 'Washington DC',
    origin: 'Addis Ababa, Ethiopia',
    profession: 'Healthcare Administrator',
    education: 'Masters in Public Health',
    faith: 'Orthodox Christian',
    compatibility: 92
  };

  const handleShareWithFamily = (familyType: string) => {
    toast({
      title: 'Shared Successfully',
      description: `Profile shared with ${familyType}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Family Involvement Mode" backPath="/match/discover" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 mb-6 border border-border">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Family Involvement Mode</h2>
              <p className="text-primary-foreground/80">
                Share potential matches with family members for their blessing and guidance. 
                This feature respects our cultural values of family involvement in important life decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Candidate Profile */}
          <div className="md:col-span-2 bg-card rounded-2xl shadow-lg p-8 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Candidate Profile</h3>
              <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-bold">
                {candidate.compatibility}% Match
              </div>
            </div>

            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center space-x-6">
                <div className="w-32 h-32 bg-muted/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-16 h-16 text-muted-foreground/30" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-1">{candidate.name}, {candidate.age}</h4>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">From: {candidate.origin}</div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-xl p-4 border border-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Profession</span>
                  </div>
                  <p>{candidate.profession}</p>
                </div>

                <div className="bg-accent/5 rounded-xl p-4 border border-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-accent" />
                    <span className="font-semibold">Education</span>
                  </div>
                  <p>{candidate.education}</p>
                </div>

                <div className="bg-muted rounded-xl p-4 md:col-span-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Church className="w-5 h-5 text-foreground" />
                    <span className="font-semibold">Faith & Values</span>
                  </div>
                  <p>{candidate.faith}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Regular church attendance, strong family values, seeking serious relationship
                  </p>
                </div>
              </div>

              {/* Family Background */}
              <div className="bg-muted rounded-xl p-6">
                <h4 className="font-bold mb-3">Family Background</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Parents:</span> Both from Addis Ababa, now living in USA</p>
                  <p><span className="font-semibold text-foreground">Siblings:</span> 2 siblings (1 brother, 1 sister)</p>
                  <p><span className="font-semibold text-foreground">Family Values:</span> Close-knit, faith-centered, education-focused</p>
                </div>
              </div>

              {/* Character References */}
              <div className="bg-accent/5 rounded-xl p-6 border border-accent/20">
                <h4 className="font-bold mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-accent" />
                  Character & Reputation
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Active member of St. Mary&apos;s Orthodox Church for 5+ years</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Volunteers with community health initiatives</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Respected professional in healthcare field</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span>Maintains close relationship with family and community</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Family Review Panel */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
              <h3 className="font-bold mb-4">Share with Family</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => handleShareWithFamily('Parents')}
                  className="w-full justify-between"
                  variant="default"
                >
                  <span>Send to Parents</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => handleShareWithFamily('Siblings')}
                  className="w-full justify-between"
                  variant="default"
                >
                  <span>Share with Siblings</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => handleShareWithFamily('Extended Family')}
                  className="w-full justify-between"
                  variant="default"
                >
                  <span>Extended Family</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
              <h3 className="font-bold mb-4">Family Feedback</h3>
              <div className="space-y-3">
                <div className="bg-accent/10 border-2 border-accent/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Mother</span>
                    <div className="flex items-center space-x-1 text-accent">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">Approved</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">&quot;She seems like a wonderful match. Good family values and faith.&quot;</p>
                </div>

                <div className="bg-primary/10 border-2 border-primary/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Father</span>
                    <div className="flex items-center space-x-1 text-primary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">Approved</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">&quot;Impressed by her education and faith commitment.&quot;</p>
                </div>

                <div className="bg-muted border-2 border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Sister</span>
                    <span className="text-sm font-medium text-muted-foreground">Reviewing...</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-2xl p-6 border border-border">
              <h4 className="font-bold mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy Note
              </h4>
              <p className="text-sm text-muted-foreground">
                Family members will only see information you choose to share. 
                Personal messages and detailed contact info remain private until both parties agree.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
