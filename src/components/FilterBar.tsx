import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGenres } from "@/hooks/useMovies";

interface FilterBarProps {
  selectedGenre?: number;
  selectedYear?: number;
  onGenreChange: (genre?: number) => void;
  onYearChange: (year?: number) => void;
  onClearFilters: () => void;
}

export const FilterBar = ({
  selectedGenre,
  selectedYear,
  onGenreChange,
  onYearChange,
  onClearFilters,
}: FilterBarProps) => {
  const { data: genresData } = useGenres();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const hasActiveFilters = selectedGenre || selectedYear;

  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 mb-8 shadow-elegant">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-foreground">
          <Filter className="w-5 h-5" />
          <span className="font-semibold">Filters</span>
        </div>

        <Select
          value={selectedGenre?.toString()}
          onValueChange={(value) => onGenreChange(value ? parseInt(value) : undefined)}
        >
          <SelectTrigger className="w-[180px] bg-background/50">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genresData?.genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedYear?.toString()}
          onValueChange={(value) => onYearChange(value ? parseInt(value) : undefined)}
        >
          <SelectTrigger className="w-[180px] bg-background/50">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
