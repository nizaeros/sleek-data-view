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
      <div className="flex h-14 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-[#1034A6]">DOPZ</span>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" className="font-medium" onClick={() => navigate("/clients")}>
              Client Accounts
            </Button>
          </nav>
        </div>
        <Button variant="ghost" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
};