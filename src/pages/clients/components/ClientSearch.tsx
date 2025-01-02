import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface ClientSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export const ClientSearch = ({ searchQuery, onSearchChange, onClearSearch }: ClientSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Search input changed:", value);
    onSearchChange(value);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    onClearSearch();
  };

  return (
    <div className="relative w-64">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search clients..."
        value={searchQuery}
        onChange={handleChange}
        className="pr-8"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};