import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/ui/Input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  category: string;
}

interface ServiceMultiSelectProps {
  selectedServiceIds: string[];
  onChange: (serviceIds: string[]) => void;
}

export const ServiceMultiSelect: React.FC<ServiceMultiSelectProps> = ({
  selectedServiceIds,
  onChange,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('id, name, category')
      .eq('publish_state', 'published')
      .order('category')
      .order('name');

    if (data && !error) {
      setServices(data);
      // Auto-expand all categories by default
      const categories = new Set(data.map(s => s.category).filter(Boolean));
      setExpandedCategories(categories);
    }
    setIsLoading(false);
  };

  const handleToggleService = (serviceId: string) => {
    if (selectedServiceIds.includes(serviceId)) {
      onChange(selectedServiceIds.filter(id => id !== serviceId));
    } else {
      onChange([...selectedServiceIds, serviceId]);
    }
  };

  const handleToggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter services by search query
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (service.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group services by category
  const groupedServices = filteredServices.reduce((acc, service) => {
    const category = service.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const selectedCount = selectedServiceIds.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Services Provided</Label>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedCount} selected
            </Badge>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Services List */}
      <div className="border border-border rounded-lg max-h-[400px] overflow-y-auto bg-card">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">Loading services...</div>
        ) : Object.keys(groupedServices).length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No services found</div>
        ) : (
          <div className="divide-y divide-border">
            {Object.entries(groupedServices).map(([category, categoryServices]) => {
              const isExpanded = expandedCategories.has(category);
              const categorySelectedCount = categoryServices.filter(s => 
                selectedServiceIds.includes(s.id)
              ).length;

              return (
                <div key={category} className="bg-card">
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => handleToggleCategory(category)}
                    className="w-full flex items-center justify-between p-3 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="font-semibold text-sm">{category}</span>
                      {categorySelectedCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {categorySelectedCount}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {categoryServices.length} service{categoryServices.length !== 1 ? 's' : ''}
                    </span>
                  </button>

                  {/* Category Services */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-2">
                      {categoryServices.map(service => (
                        <label
                          key={service.id}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-accent",
                            selectedServiceIds.includes(service.id) && "bg-accent/50"
                          )}
                        >
                          <Checkbox
                            checked={selectedServiceIds.includes(service.id)}
                            onCheckedChange={() => handleToggleService(service.id)}
                          />
                          <span className="text-sm flex-1">{service.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Services Display */}
      {selectedCount > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Selected Services:</Label>
          <div className="flex flex-wrap gap-2">
            {services
              .filter(s => selectedServiceIds.includes(s.id))
              .map(service => (
                <Badge
                  key={service.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => handleToggleService(service.id)}
                >
                  {service.name}
                  <span className="ml-1 text-xs">×</span>
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
