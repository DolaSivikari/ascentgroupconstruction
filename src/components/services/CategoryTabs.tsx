interface CategoryTabsProps {
  categories: Array<{ label: string; value: string }>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) => {
  return (
    <div className="flex flex-wrap gap-3" role="tablist">
      {categories.map((category) => {
        const isActive = activeCategory === category.value;
        return (
          <button
            key={category.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoryChange(category.value)}
            className={`
              px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200
              ${isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
              }
            `}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
};
