import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NavigationHistoryItem } from '@/hooks/useNavigationHistory';
import { haptics } from '@/utils/haptics';

interface RecentlyViewedProps {
  items: NavigationHistoryItem[];
  onLinkClick: () => void;
}

export function RecentlyViewed({ items, onLinkClick }: RecentlyViewedProps) {
  if (items.length === 0) return null;

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      services: 'text-orange-600 dark:text-orange-400',
      markets: 'text-blue-600 dark:text-blue-400',
      projects: 'text-teal-600 dark:text-teal-400',
      company: 'text-indigo-600 dark:text-indigo-400',
      resources: 'text-purple-600 dark:text-purple-400',
    };
    return colors[category.toLowerCase()] || 'text-muted-foreground';
  };

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold text-foreground">Recently Viewed</h4>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={() => {
              haptics.light();
              onLinkClick();
            }}
            className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors ripple hover-lift"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">{item.name}</span>
              <span className={`text-xs ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(item.timestamp)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
