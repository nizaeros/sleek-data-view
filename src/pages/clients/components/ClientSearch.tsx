import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export const ClientSearch = ({ searchQuery, onSearchChange, onClearSearch }: ClientSearchProps) => {
  return (
    <div className="relative w-64">
      <Input
        type="text"
        placeholder="Search clients..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pr-8"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
          onClick={onClearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};