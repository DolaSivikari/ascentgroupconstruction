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
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`
            px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200
            ${activeCategory === category.value
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
            }
          `}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};
