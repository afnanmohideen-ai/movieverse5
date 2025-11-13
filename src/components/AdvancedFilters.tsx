import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGenres } from "@/hooks/useMovies";

export interface FilterOptions {
  providers: string[];
  genres: number[];
  yearRange: [number, number];
  ratingRange: [number, number];
  priceTypes: string[];
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  contentType: "movie" | "tv";
}

const STREAMING_PROVIDERS = [
  { id: "netflix", name: "Netflix", logo: "🎬" },
  { id: "disney", name: "Disney+", logo: "✨" },
  { id: "prime", name: "Prime Video", logo: "📦" },
  { id: "hulu", name: "Hulu", logo: "🟢" },
  { id: "hbo", name: "HBO Max", logo: "🎭" },
  { id: "apple", name: "Apple TV+", logo: "🍎" },
  { id: "paramount", name: "Paramount+", logo: "⭐" },
  { id: "peacock", name: "Peacock", logo: "🦚" },
];

const PRICE_TYPES = [
  { id: "free", name: "Free" },
  { id: "subscription", name: "Subscription" },
  { id: "rent", name: "Rent" },
  { id: "buy", name: "Buy" },
];

export const AdvancedFilters = ({ filters, onFiltersChange, contentType }: AdvancedFiltersProps) => {
  const { data: genresData } = useGenres();
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const toggleProvider = (providerId: string) => {
    const newProviders = filters.providers.includes(providerId)
      ? filters.providers.filter((p) => p !== providerId)
      : [...filters.providers, providerId];
    onFiltersChange({ ...filters, providers: newProviders });
  };

  const toggleGenre = (genreId: number) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter((g) => g !== genreId)
      : [...filters.genres, genreId];
    onFiltersChange({ ...filters, genres: newGenres });
  };

  const togglePriceType = (priceType: string) => {
    const newPriceTypes = filters.priceTypes.includes(priceType)
      ? filters.priceTypes.filter((p) => p !== priceType)
      : [...filters.priceTypes, priceType];
    onFiltersChange({ ...filters, priceTypes: newPriceTypes });
  };

  const clearFilters = () => {
    onFiltersChange({
      providers: [],
      genres: [],
      yearRange: [1900, currentYear],
      ratingRange: [0, 10],
      priceTypes: [],
    });
  };

  const hasActiveFilters =
    filters.providers.length > 0 ||
    filters.genres.length > 0 ||
    filters.yearRange[0] !== 1900 ||
    filters.yearRange[1] !== currentYear ||
    filters.ratingRange[0] !== 0 ||
    filters.ratingRange[1] !== 10 ||
    filters.priceTypes.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {filters.providers.length +
                filters.genres.length +
                filters.priceTypes.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>
            Filter {contentType === "movie" ? "movies" : "TV shows"} by streaming service, genre, year, and more.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Streaming Providers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Streaming Services</Label>
              {filters.providers.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, providers: [] })}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STREAMING_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    filters.providers.includes(provider.id)
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => toggleProvider(provider.id)}
                >
                  <Checkbox
                    id={provider.id}
                    checked={filters.providers.includes(provider.id)}
                    onCheckedChange={() => toggleProvider(provider.id)}
                  />
                  <Label
                    htmlFor={provider.id}
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <span>{provider.logo}</span>
                    <span className="text-sm">{provider.name}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Genres</Label>
              {filters.genres.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, genres: [] })}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {genresData?.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant={filters.genres.includes(genre.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                  {filters.genres.includes(genre.id) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Release Year</Label>
            <div className="px-2">
              <Slider
                value={filters.yearRange}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, yearRange: value as [number, number] })
                }
                min={1900}
                max={currentYear}
                step={1}
                minStepsBetweenThumbs={1}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{filters.yearRange[0]}</span>
                <span>{filters.yearRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Rating Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Rating</Label>
            <div className="px-2">
              <Slider
                value={filters.ratingRange}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, ratingRange: value as [number, number] })
                }
                min={0}
                max={10}
                step={0.5}
                minStepsBetweenThumbs={0.5}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{filters.ratingRange[0]}</span>
                <span>{filters.ratingRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Price Types */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Availability</Label>
              {filters.priceTypes.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, priceTypes: [] })}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PRICE_TYPES.map((priceType) => (
                <div
                  key={priceType.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    filters.priceTypes.includes(priceType.id)
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => togglePriceType(priceType.id)}
                >
                  <Checkbox
                    id={priceType.id}
                    checked={filters.priceTypes.includes(priceType.id)}
                    onCheckedChange={() => togglePriceType(priceType.id)}
                  />
                  <Label
                    htmlFor={priceType.id}
                    className="cursor-pointer flex-1 text-sm"
                  >
                    {priceType.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Clear All */}
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline" className="w-full">
              Clear All Filters
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
