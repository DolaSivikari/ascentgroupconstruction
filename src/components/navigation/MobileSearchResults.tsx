import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Building, Wrench, Users, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSearchAnalytics } from "@/hooks/useSearchAnalytics";

interface SearchResult {
  name: string;
  link: string;
  category: string;
  section: string;
  badge?: "new" | "popular" | "important";
}

interface MobileSearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  onLinkClick: () => void;
}

const getSectionIcon = (section: string) => {
  switch (section.toLowerCase()) {
    case "services":
      return <Wrench className="h-4 w-4 text-primary" />;
    case "markets":
      return <Building className="h-4 w-4 text-secondary" />;
    case "projects":
      return <Building className="h-4 w-4 text-accent" />;
    case "company":
      return <Users className="h-4 w-4 text-primary" />;
    case "resources":
      return <TrendingUp className="h-4 w-4 text-secondary" />;
    default:
      return <Wrench className="h-4 w-4" />;
  }
};

const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-primary/20 text-primary font-semibold px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export function MobileSearchResults({ results, searchQuery, onLinkClick }: MobileSearchResultsProps) {
  const { trackResultClick } = useSearchAnalytics();

  const handleResultClick = (result: SearchResult) => {
    trackResultClick(searchQuery, result.name, result.link);
    onLinkClick();
  };

  if (results.length === 0) {
    return (
      <div className="px-6 py-12 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Wrench className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-sm text-muted-foreground">
          Try searching for "commercial", "restoration", or "parking"
        </p>
      </div>
    );
  }

  // Group results by section
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.section]) {
      acc[result.section] = [];
    }
    acc[result.section].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Calculate section counts
  const sectionCounts = results.reduce((acc, result) => {
    acc[result.section] = (acc[result.section] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getSectionColor = (section: string) => {
    const colors: Record<string, string> = {
      Services: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      Markets: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Projects: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
      Company: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      Resources: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return colors[section] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="px-6 py-4 animate-fade-in">
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <p className="text-sm text-muted-foreground">
          Found <span className="font-semibold text-foreground">{results.length}</span> result{results.length !== 1 ? "s" : ""}
        </p>
        {Object.entries(sectionCounts).map(([section, count]) => (
          <span key={section} className={`text-xs px-2 py-1 rounded-full ${getSectionColor(section)}`}>
            {section}: {count}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {Object.entries(groupedResults).map(([section, sectionResults], index) => (
          <div key={section}>
            {index > 0 && <Separator className="my-4" />}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-3">
                {getSectionIcon(section)}
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {section}
                </h4>
                <Badge variant="outline" size="xs" className="ml-auto">
                  {sectionResults.length}
                </Badge>
              </div>
              
              <div className="space-y-1">
                {sectionResults.map((result, resultIndex) => (
                  <Link
                    key={`${result.link}-${resultIndex}`}
                    to={result.link}
                    onClick={() => handleResultClick(result)}
                    className="group flex items-center justify-between py-3 px-4 min-h-[44px] bg-muted/30 hover:bg-primary/10 hover:border-primary/20 active:scale-[0.98] rounded-lg border border-transparent transition-all duration-200 touch-manipulation"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium group-hover:text-primary transition-colors">
                        {highlightMatch(result.name, searchQuery)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {result.category}
                      </div>
                    </div>
                    
                    {result.badge && (
                      <Badge 
                        variant={result.badge === "new" ? "secondary" : result.badge === "popular" ? "warning" : "default"} 
                        size="xs" 
                        className="ml-2"
                      >
                        {result.badge === "new" ? (
                          <Sparkles className="h-3 w-3" />
                        ) : (
                          <Star className="h-3 w-3" />
                        )}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
