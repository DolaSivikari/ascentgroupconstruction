import { Clock, TrendingUp, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { usePopularSearches } from '@/hooks/usePopularSearches';
import { haptics } from '@/utils/haptics';

interface SearchSuggestionsProps {
  onSelectSearch: (query: string) => void;
  onNavigate: () => void;
  mobile?: boolean;
}

export function SearchSuggestions({ onSelectSearch, onNavigate, mobile = false }: SearchSuggestionsProps) {
  const { recentSearches, removeSearch, clearRecentSearches } = useRecentSearches();
  const { popularSearches } = usePopularSearches();

  const quickLinks = [
    { name: 'Contact Us', link: '/contact' },
    { name: 'Request Quote', link: '/contact' },
    { name: 'Our Services', link: '/services' },
  ];

  const handleSelectSearch = (query: string) => {
    haptics.light();
    onSelectSearch(query);
  };

  const handleRemoveSearch = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    haptics.light();
    removeSearch(query);
  };

  const handleClearAll = () => {
    haptics.medium();
    clearRecentSearches();
  };

  return (
    <div className={mobile ? "relative bg-background/95 backdrop-blur-lg border border-border rounded-lg shadow-xl max-h-[60vh] overflow-y-auto" : "absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-lg border border-border rounded-lg shadow-xl z-50 max-h-[60vh] overflow-y-auto"}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Recent Searches</span>
            </div>
            <button
              onClick={handleClearAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-1">
            {recentSearches.slice(0, 5).map((query, index) => (
              <button
                key={index}
                onClick={() => handleSelectSearch(query)}
                className="w-full flex items-center justify-between group px-3 py-2 rounded-lg hover:bg-accent transition-colors ripple"
              >
                <span className="text-sm text-foreground">{query}</span>
                <button
                  onClick={(e) => handleRemoveSearch(e, query)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches */}
      {popularSearches.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Popular Searches</span>
          </div>
          <div className="space-y-1">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSelectSearch(search.query)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors ripple"
              >
                <span className="text-sm text-foreground capitalize">{search.query}</span>
                <span className="text-xs text-muted-foreground">{search.count} searches</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Quick Links</span>
        </div>
        <div className="space-y-1">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.link}
              onClick={() => {
                haptics.light();
                onNavigate();
              }}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors ripple"
            >
              <span className="text-sm text-foreground">{link.name}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
