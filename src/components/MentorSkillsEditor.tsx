import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface MentorSkillsEditorProps {
  mentorId: string;
  onSkillsUpdated?: () => void;
}

const POPULAR_SKILLS = [
  'Leadership',
  'Career Coaching',
  'Python',
  'JavaScript',
  'React',
  'Data Science',
  'Machine Learning',
  'Product Management',
  'Design',
  'Marketing',
  'Sales',
  'Entrepreneurship',
  'Public Speaking',
  'Project Management',
  'Communication',
  'Interviewing',
  'Resume Writing',
  'Networking'
];

export default function MentorSkillsEditor({ mentorId, onSkillsUpdated }: MentorSkillsEditorProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, [mentorId]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mentor_skills')
        .select('skill')
        .eq('mentor_id', mentorId);

      if (error) throw error;
      setSkills(data?.map(s => s.skill) || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const saveSkills = async () => {
    setSaving(true);
    try {
      // Delete all existing skills
      await supabase
        .from('mentor_skills')
        .delete()
        .eq('mentor_id', mentorId);

      // Insert new skills
      if (skills.length > 0) {
        const { error } = await supabase
          .from('mentor_skills')
          .insert(skills.map(skill => ({ mentor_id: mentorId, skill })));

        if (error) throw error;
      }

      toast.success('Skills updated successfully');
      onSkillsUpdated?.();
    } catch (error) {
      console.error('Error saving skills:', error);
      toast.error('Failed to save skills');
    } finally {
      setSaving(false);
    }
  };

  const suggestedSkills = POPULAR_SKILLS.filter(s => !skills.includes(s));

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading skills...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Current Skills */}
      <div>
        <h3 className="font-semibold mb-2">Your Skills</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-muted-foreground">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Add Custom Skill */}
      <div>
        <h3 className="font-semibold mb-2">Add Custom Skill</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Type a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(newSkill);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => addSkill(newSkill)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Suggested Skills */}
      {suggestedSkills.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Popular Skills</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.slice(0, 12).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => addSkill(skill)}
              >
                + {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <Button
        onClick={saveSkills}
        disabled={saving}
        className="w-full"
      >
        {saving ? 'Saving...' : 'Save Skills'}
      </Button>
    </div>
  );
}
