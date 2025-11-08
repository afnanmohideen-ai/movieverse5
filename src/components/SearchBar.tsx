import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = "Search movies..." }: SearchBarProps) => {
  return (
    <div className="relative max-w-2xl mx-auto group">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-14 pr-6 h-14 bg-card/50 backdrop-blur-md border border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground rounded-2xl shadow-card focus:shadow-glow transition-all duration-300 text-lg"
      />
    </div>
  );
};
