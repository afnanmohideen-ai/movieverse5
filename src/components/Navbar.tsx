import { Film, Home, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    navigate("/");
    scrollToTop();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleHomeClick}
            className="flex items-center gap-2 group transition-all duration-300"
          >
            <Film className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              Movieverse
            </span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleHomeClick}
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            
            <Button
              onClick={() => navigate("/watchlist")}
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Watchlist</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
