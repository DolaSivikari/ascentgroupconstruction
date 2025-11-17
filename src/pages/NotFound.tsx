import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { Home, Search, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const [suggestions, setSuggestions] = useState<Array<{ slug: string; title: string; type: string }>>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }

    // Detect if this looks like a project/case study URL
    if (location.pathname.startsWith('/projects/')) {
      loadSuggestions();
    }
  }, [location.pathname]);

  const loadSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      // Try to find similar published projects
      const { data: projects } = await supabase
        .from('projects')
        .select('slug, title')
        .eq('publish_state', 'published')
        .limit(5);

      if (projects && projects.length > 0) {
        setSuggestions(projects.map(p => ({ ...p, type: 'case-study' })));
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const getErrorMessage = () => {
    if (location.pathname.startsWith('/projects/')) {
      return "This project or case study doesn't exist";
    }
    return "Oops! Page not found";
  };

  const getHelpText = () => {
    if (location.pathname.startsWith('/projects/')) {
      return "The project you're looking for may have been moved or deleted.";
    }
    return "The page you're looking for doesn't exist or may have been moved.";
  };

  return (
    <>
      <Navigation />
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
        </div>

        {/* Error Message */}
        <h2 className="mb-4 text-4xl font-bold text-foreground">
          {getErrorMessage()}
        </h2>
        
        <p className="mb-8 text-xl text-muted-foreground">
          {getHelpText()}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild variant="default" size="lg">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Return to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link to={location.state?.from || -1 as any}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link to="/projects">
              <Search className="mr-2 h-5 w-5" />
              Browse Projects
            </Link>
          </Button>
        </div>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              You might be interested in:
            </h3>
            <div className="space-y-2">
              {suggestions.map((item) => (
                <Link
                  key={item.slug}
                  to={`/${item.type}/${item.slug}`}
                  className="block p-3 hover:bg-background rounded-md transition-colors text-left"
                >
                  <span className="text-primary font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {isLoadingSuggestions && (
          <div className="mt-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        )}

        {/* Invalid URL Pattern Detection */}
        {location.pathname.includes('=') && (
          <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              <strong>Note:</strong> The URL contains invalid characters. Project URLs should only contain letters, numbers, and hyphens.
            </p>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default NotFound;
