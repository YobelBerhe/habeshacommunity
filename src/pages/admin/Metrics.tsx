import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminMetrics from "@/components/AdminMetrics";
import { Loader2 } from "lucide-react";

export default function AdminMetricsPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth/login");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setRole(roles?.role || null);
      setLoading(false);
    };

    fetchRole();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="p-6 bg-destructive/10 rounded-lg">
            <p className="text-lg font-semibold text-destructive">
              🚫 Access Denied
            </p>
            <p className="mt-2 text-muted-foreground">
              This page is only accessible to administrators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <AdminMetrics />;
}
