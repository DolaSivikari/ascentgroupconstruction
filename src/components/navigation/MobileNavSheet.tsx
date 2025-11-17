import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Search, Users, Building, Wrench, Star, X, Home, Mail, FileText, Briefcase, Sparkles, ChevronRight, Clock, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { megaMenuDataEnhanced } from "@/data/navigation-structure-enhanced";
import { NAVIGATION_ICONS } from "@/data/navigation-icons";
import { NAVIGATION_DESCRIPTIONS } from "@/data/navigation-descriptions";
import { useNavigationSearch } from "@/hooks/useNavigationSearch";
import { MobileSearchResults } from "./MobileSearchResults";
import { SearchSuggestions } from "./SearchSuggestions";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { SmartPopularServices } from "./SmartPopularServices";

import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { useScrollIndicator } from "@/hooks/useScrollIndicator";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import { haptics } from "@/utils/haptics";
import { NavCategoryCard } from "./NavCategoryCard";
import { ScreenReaderAnnouncement } from "@/components/ui/ScreenReaderAnnouncement";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface MobileNavSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNavSheet({ open, onOpenChange }: MobileNavSheetProps) {
  const location = useLocation();
  const { searchQuery, setSearchQuery, filteredResults, isSearching, activeCategory, setActiveCategory } = useNavigationSearch();
  const { addRecentSearch } = useRecentSearches();
  
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showMoreServices, setShowMoreServices] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const servicesContentRef = useRef<HTMLDivElement>(null);
  
  const { isScrollable: isServicesScrollable, isAtBottom: isServicesAtBottom, isAtTop: isServicesAtTop } = useScrollIndicator(servicesContentRef);
  
  const swipeGesture = useSwipeGesture(() => {
    haptics.medium();
    setAnnouncement("Navigation closed");
    onOpenChange(false);
  });

  const allCategories = ["All", "Services", "Projects", "Company", "Partners", "Resources"];

  // Get all service items for Show More/Less functionality
  const allServiceItems = megaMenuDataEnhanced.services.flatMap(section => 
    section.categories.flatMap(cat => cat.subItems || [])
  );
  const visibleServiceItems = showMoreServices ? allServiceItems : allServiceItems.slice(0, 8);

  // Get icon component from name
  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || ChevronRight;
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = () => {
    haptics.light();
    onOpenChange(false);
    setSearchQuery("");
    setShowSearchSuggestions(false);
  };

  const handleClearSearch = () => {
    haptics.light();
    setSearchQuery("");
    setAnnouncement("Search cleared");
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    if (!searchQuery) {
      setShowSearchSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => setSearchFocused(false), 200);
  };

  const handleCategoryClick = (category: string) => {
    haptics.light();
    setActiveCategory(category === "All" ? "" : category);
    setAnnouncement(`Filtered by ${category}`);
  };

  const handleSelectSearch = (query: string) => {
    haptics.light();
    setSearchQuery(query);
    addRecentSearch(query);
    setShowSearchSuggestions(false);
  };

  // Add ripple effect on touch
  const addRipple = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple");

    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  // Stagger delays for animations
  const delays = useStaggerAnimation({ itemCount: 10, staggerDelay: 50 });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="w-full sm:max-w-md overflow-y-auto p-0 animate-slide-in-right bg-gradient-to-br from-background via-background to-muted/20"
        style={{
          transform: `translateX(${swipeGesture.translateX}px)`,
          transition: swipeGesture.translateX === 0 ? 'transform 0.3s ease-out' : 'none',
        }}
        {...swipeGesture}
      >
        <ScreenReaderAnnouncement message={announcement} />
        
        {/* Swipe Indicator */}
        <div className="swipe-indicator" aria-hidden="true" />

        <SheetHeader className="p-4 pb-3 text-left border-b border-border backdrop-blur-xl bg-card sticky top-0 z-10 animate-fade-in">
          <SheetTitle className="text-xl font-bold text-foreground">
            Navigation
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Explore our complete range of services
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-3">
          {/* Enhanced Search Bar */}
          <div className="mb-3 search-input-focus">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search services, markets, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="pl-10 pr-10 h-12 min-h-[44px] text-sm touch-manipulation bg-card border border-border focus:border-accent rounded-lg shadow-sm"
                aria-label="Search navigation"
                aria-controls="search-results"
                aria-expanded={showSearchSuggestions || isSearching}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-all duration-200 touch-manipulation"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            {!isSearching && searchQuery && (
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pt-2 pb-1" role="tablist" aria-label="Category filters">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    role="tab"
                    aria-selected={activeCategory === (category === "All" ? "" : category)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 touch-manipulation",
                      activeCategory === (category === "All" ? "" : category)
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {isSearching && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground animate-fade-in">
                <div className="h-1 w-1 rounded-full bg-accent animate-pulse" aria-hidden="true" />
                <span>Searching across all sections...</span>
              </div>
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {showSearchSuggestions && !isSearching && (
            <div className="mb-4 animate-fade-in">
              <SearchSuggestions
                mobile={true}
                onSelectSearch={handleSelectSearch}
                onNavigate={() => handleLinkClick()}
              />
            </div>
          )}

          {/* Conditional Rendering: Search Results OR Normal Navigation */}
          {isSearching ? (
            <div id="search-results" role="region" aria-label="Search results">
              <MobileSearchResults
                results={filteredResults}
                searchQuery={searchQuery}
                onLinkClick={() => handleLinkClick()}
              />
            </div>
          ) : (
            <>
              {/* Smart Popular Services Section */}
              <div>
                <SmartPopularServices 
                  onLinkClick={handleLinkClick}
                  variant="personalized"
                />
              </div>

              {/* Quick Access Section */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
                  Quick Access
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/"
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center gap-2 p-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-[0.98] touch-manipulation",
                      isActive("/")
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "bg-card border border-border hover:border-accent/50"
                    )}
                    aria-current={isActive("/") ? "page" : undefined}
                  >
                    <Home className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/contact"
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center gap-2 p-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-[0.98] touch-manipulation",
                      isActive("/contact")
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "bg-card border border-border hover:border-accent/50"
                    )}
                    aria-current={isActive("/contact") ? "page" : undefined}
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span>Contact</span>
                  </Link>
                  <Link
                    to="/contact"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 p-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-[0.98] touch-manipulation bg-card border border-border hover:border-accent/50"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span>Request Quote</span>
                  </Link>
                  <Link
                    to="/projects"
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center gap-2 p-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-[0.98] touch-manipulation",
                      isActive("/projects")
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "bg-card border border-border hover:border-accent/50"
                    )}
                    aria-current={isActive("/projects") ? "page" : undefined}
                  >
                    <Briefcase className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span>Projects</span>
                  </Link>
                </div>
              </div>

              {/* Enhanced Accordion Sections */}
              <Accordion 
                type="multiple" 
                className="space-y-4" 
                onValueChange={(value) => {
                  haptics.medium();
                  const actionText = value.length > 0 ? "expanded" : "collapsed";
                  setAnnouncement(`Section ${actionText}`);
                }}
              >
                {/* Services Section with Show More/Less */}
                <AccordionItem value="services" className="border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
                  <AccordionTrigger 
                    className="px-4 py-3.5 hover:no-underline bg-transparent hover:bg-muted/30 transition-colors [&[data-state=open]]:bg-muted/50 [&[data-state=open]]:text-primary touch-manipulation"
                    onMouseDown={addRipple}
                    aria-label="Services menu"
                  >
                    <NavCategoryCard
                      icon={Wrench}
                      title="Services"
                      itemCount={megaMenuDataEnhanced.services.reduce((acc, section) => acc + section.categories.length, 0)}
                      gradient="bg-gradient-to-br from-[hsl(24,95%,53%)] to-[hsl(20,91%,48%)]"
                      iconColor="text-white"
                    >
                      <span className="text-base font-bold">Services</span>
                    </NavCategoryCard>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 relative" ref={servicesContentRef}>
                    {/* Scroll Indicators */}
                    {isServicesScrollable && !isServicesAtTop && (
                      <div className="scroll-fade-top" aria-hidden="true" />
                    )}
                    
                    {megaMenuDataEnhanced.services.map((section, sectionIndex) => (
                      <div key={section.sectionTitle} className="mb-3">
                        {sectionIndex > 0 && <Separator className="my-3" />}
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 px-2">
                          {section.sectionTitle}
                        </h4>
                        <div className="space-y-1">
                          {section.categories.map((category) => (
                            <div key={category.title} className="ml-1">
                              <div className="font-semibold text-sm py-1.5 px-2 text-foreground/90">{category.title}</div>
                              {category.subItems && (
                                <div className="ml-2 space-y-0.5">
                                  {category.subItems.map((item, itemIndex) => {
                                    const IconComponent = getIcon(NAVIGATION_ICONS[item.link] || "ChevronRight");
                                    const description = NAVIGATION_DESCRIPTIONS[item.link];
                                    
                                    return (
                                      <Link
                                        key={item.link}
                                        to={item.link}
                                        onClick={handleLinkClick}
                                        onMouseDown={addRipple}
                                        className="group flex items-center gap-2 py-2 px-3 min-h-[44px] text-sm text-foreground border-l-2 border-transparent hover:text-accent hover:bg-muted/30 hover:border-l-accent hover:pl-4 active:scale-[0.98] transition-all duration-200 touch-manipulation"
                                        aria-label={`${item.name}${description ? `: ${description}` : ""}`}
                                      >
                                        <IconComponent className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                                        <div className="flex-1 min-w-0">
                                          <span className="group-hover:translate-x-0.5 transition-transform block">{item.name}</span>
                                          {description && (
                                            <span className="text-xs text-muted-foreground/70 block">{description}</span>
                                          )}
                                        </div>
                                        {item.badge && (
                                          <Badge variant={item.badge === "new" ? "secondary" : "default"} size="xs" className="ml-2">
                                            {item.badge === "new" ? <Sparkles className="h-3 w-3" aria-hidden="true" /> : <Star className="h-3 w-3" aria-hidden="true" />}
                                          </Badge>
                                        )}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {isServicesScrollable && !isServicesAtBottom && (
                      <div className="scroll-fade-bottom" aria-hidden="true" />
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Company Section */}
                <AccordionItem value="company" className="border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-accent/30 hover:shadow-sm">
                  <AccordionTrigger 
                    className="px-3 py-2.5 hover:no-underline bg-transparent hover:bg-muted/30 transition-colors [&[data-state=open]]:bg-muted/50 [&[data-state=open]]:text-foreground touch-manipulation"
                    aria-label="Company menu"
                  >
                    <NavCategoryCard
                      icon={Users}
                      title="Company"
                      itemCount={megaMenuDataEnhanced.company.reduce((acc, section) => acc + section.categories.length, 0)}
                      gradient="bg-gradient-to-br from-steel-blue to-steel-blue"
                      iconColor="text-steel-blue-foreground"
                    >
                      <span className="text-sm font-semibold">Company</span>
                    </NavCategoryCard>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    {megaMenuDataEnhanced.company.map((section, sectionIndex) => (
                      <div key={section.sectionTitle} className="mb-3">
                        {sectionIndex > 0 && <Separator className="my-3" />}
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 px-2">
                          {section.sectionTitle}
                        </h4>
                        <div className="space-y-1">
                          {section.categories.map((category) => (
                            <div key={category.title} className="ml-1">
                              {category.subItems && (
                                <div className="space-y-0.5">
                                  {category.subItems.map((item, itemIndex) => {
                                    const IconComponent = getIcon(NAVIGATION_ICONS[item.link] || "ChevronRight");
                                    const description = NAVIGATION_DESCRIPTIONS[item.link];
                                    
                                    return (
                                      <Link
                                        key={item.link}
                                        to={item.link}
                                        onClick={handleLinkClick}
                                        onMouseDown={addRipple}
                                        className="group flex items-center gap-2 py-2 px-3 min-h-[44px] text-sm text-foreground border-l-2 border-transparent hover:text-accent hover:bg-muted/30 hover:border-l-accent hover:pl-4 active:scale-[0.98] transition-all duration-200 touch-manipulation"
                                        aria-label={`${item.name}${description ? `: ${description}` : ""}`}
                                      >
                                        <IconComponent className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                                        <div className="flex-1 min-w-0">
                                          <span className="group-hover:translate-x-0.5 transition-transform block">{item.name}</span>
                                          {description && (
                                            <span className="text-xs text-muted-foreground/70 block">{description}</span>
                                          )}
                                        </div>
                                        {item.badge === "new" && (
                                          <Badge variant="secondary" size="xs" className="ml-2">
                                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                                          </Badge>
                                        )}
                                        {item.badge === "important" && (
                                          <Badge variant="default" size="xs" className="ml-2">
                                            <Star className="h-3 w-3" aria-hidden="true" />
                                          </Badge>
                                        )}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                {/* Partners Section */}
                <AccordionItem value="partners" className="border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-accent/30 hover:shadow-sm">
                  <AccordionTrigger 
                    className="px-3 py-2.5 hover:no-underline bg-transparent hover:bg-muted/30 transition-colors [&[data-state=open]]:bg-muted/50 [&[data-state=open]]:text-foreground touch-manipulation"
                    aria-label="Partners menu"
                  >
                    <NavCategoryCard
                      icon={Users}
                      title="Partners"
                      itemCount={megaMenuDataEnhanced.partners.reduce((acc, section) => acc + section.categories.length, 0)}
                      gradient="bg-gradient-to-br from-primary to-primary-light"
                      iconColor="text-primary-foreground"
                    >
                      <span className="text-sm font-semibold">Partners</span>
                    </NavCategoryCard>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    {megaMenuDataEnhanced.partners.map((section, sectionIndex) => (
                      <div key={section.sectionTitle} className="mb-3">
                        {sectionIndex > 0 && <Separator className="my-3" />}
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 px-2">
                          {section.sectionTitle}
                        </h4>
                        <div className="space-y-1">
                          {section.categories.map((category) => (
                            <div key={category.title} className="ml-1">
                              {category.subItems && (
                                <div className="space-y-0.5">
                                  {category.subItems.map((item, itemIndex) => {
                                    const IconComponent = getIcon(NAVIGATION_ICONS[item.link] || "ChevronRight");
                                    const description = NAVIGATION_DESCRIPTIONS[item.link];
                                    
                                    return (
                                      <Link
                                        key={item.link}
                                        to={item.link}
                                        onClick={handleLinkClick}
                                        onMouseDown={addRipple}
                        className="group flex items-center gap-2 py-2 px-3 min-h-[44px] text-sm text-foreground border-l-2 border-transparent hover:text-accent hover:bg-muted/30 hover:border-l-accent hover:pl-4 active:scale-[0.98] transition-all duration-200 touch-manipulation"
                                        aria-label={`${item.name}${description ? `: ${description}` : ""}`}
                                      >
                                        <IconComponent className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                                        <div className="flex-1 min-w-0">
                                          <span className="group-hover:translate-x-0.5 transition-transform block">{item.name}</span>
                                          {description && (
                                            <span className="text-xs text-muted-foreground/70 block">{description}</span>
                                          )}
                                        </div>
                                        {item.badge === "new" && (
                                          <Badge variant="secondary" size="xs" className="ml-2">
                                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                                          </Badge>
                                        )}
                                        {item.badge === "important" && (
                                          <Badge variant="default" size="xs" className="ml-2">
                                            <Star className="h-3 w-3" aria-hidden="true" />
                                          </Badge>
                                        )}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                {/* Resources Section */}
                <AccordionItem value="resources" className="border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-accent/30 hover:shadow-sm">
                  <AccordionTrigger 
                    className="px-3 py-2.5 hover:no-underline bg-transparent hover:bg-muted/30 transition-colors [&[data-state=open]]:bg-muted/50 [&[data-state=open]]:text-foreground touch-manipulation"
                    aria-label="Resources menu"
                  >
                    <NavCategoryCard
                      icon={Building}
                      title="Resources"
                      itemCount={megaMenuDataEnhanced.resources.reduce((acc, section) => acc + section.categories.length, 0)}
                      gradient="bg-gradient-to-br from-secondary to-secondary"
                      iconColor="text-secondary-foreground"
                    >
                      <span className="text-sm font-semibold">Resources</span>
                    </NavCategoryCard>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    {megaMenuDataEnhanced.resources.map((section, sectionIndex) => (
                      <div key={section.sectionTitle} className="mb-3">
                        {sectionIndex > 0 && <Separator className="my-3" />}
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 px-2">
                          {section.sectionTitle}
                        </h4>
                        <div className="space-y-1">
                          {section.categories.map((category) => (
                            <div key={category.title} className="ml-1">
                              {category.subItems && (
                                <div className="space-y-0.5">
                                  {category.subItems.map((item, itemIndex) => {
                                    const IconComponent = getIcon(NAVIGATION_ICONS[item.link] || "ChevronRight");
                                    const description = NAVIGATION_DESCRIPTIONS[item.link];
                                    
                                    return (
                                      <Link
                                        key={item.link}
                                        to={item.link}
                                        onClick={handleLinkClick}
                                        onMouseDown={addRipple}
                        className="group flex items-center gap-2 py-2 px-3 min-h-[44px] text-sm text-foreground border-l-2 border-transparent hover:text-accent hover:bg-muted/30 hover:border-l-accent hover:pl-4 active:scale-[0.98] transition-all duration-200 touch-manipulation"
                                        aria-label={`${item.name}${description ? `: ${description}` : ""}`}
                                      >
                                        <IconComponent className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                                        <div className="flex-1 min-w-0">
                                          <span className="group-hover:translate-x-0.5 transition-transform block">{item.name}</span>
                                          {description && (
                                            <span className="text-xs text-muted-foreground/70 block">{description}</span>
                                          )}
                                        </div>
                                        {item.badge === "new" && (
                                          <Badge variant="secondary" size="xs" className="ml-2">
                                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                                          </Badge>
                                        )}
                                        {item.badge === "important" && (
                                          <Badge variant="default" size="xs" className="ml-2">
                                            <Star className="h-3 w-3" aria-hidden="true" />
                                          </Badge>
                                        )}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
        </div>

        {/* Enhanced Pinned CTA at bottom */}
        <div className="sticky bottom-0 left-0 right-0 p-3 border-t border-border bg-card backdrop-blur-xl animate-fade-in z-20">
          <Button
            asChild
            size="lg"
            className="w-full gap-2 min-h-[48px] text-sm font-semibold active:scale-[0.98] transition-all duration-200 bg-accent hover:bg-accent/90 hover:shadow-lg text-accent-foreground touch-manipulation"
          >
            <Link to="/contact" onClick={handleLinkClick} aria-label="Request a site assessment for your project">
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span>Request Site Assessment</span>
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
