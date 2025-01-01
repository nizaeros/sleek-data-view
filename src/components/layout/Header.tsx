import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-12 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-[#1034A6]">DOPZ</span>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" className="h-8 font-medium" onClick={() => navigate("/clients")}>
              Client Accounts
            </Button>
          </nav>
        </div>
        <Button variant="ghost" className="h-8" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
};