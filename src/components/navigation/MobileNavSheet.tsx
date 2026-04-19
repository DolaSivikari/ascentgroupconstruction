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
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import {
  Search,
  X,
  Phone,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { megaMenuDataEnhanced } from "@/data/navigation-structure-enhanced";
import { NAVIGATION_ICONS } from "@/data/navigation-icons";
import { useNavigationSearch } from "@/hooks/useNavigationSearch";
import { MobileSearchResults } from "./MobileSearchResults";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { haptics } from "@/utils/haptics";
import { ScreenReaderAnnouncement } from "@/components/ui/ScreenReaderAnnouncement";
import { getIcon } from "@/utils/getIcon";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import ascentLogoHorizontalDark from "@/assets/ascent-logo-horizontal-dark.png";

interface MobileNavSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Top-level nav model — flat, single accordion list.
// Direct links have no `key`; expandable sections reference megaMenuDataEnhanced.
type DirectLink = { type: "link"; label: string; to: string };
type ExpandableSection = {
  type: "section";
  label: string;
  key: keyof typeof megaMenuDataEnhanced;
  viewAll?: string;
};
type NavRow = DirectLink | ExpandableSection;

const NAV_ROWS: NavRow[] = [
  { type: "link", label: "Home", to: "/" },
  { type: "section", label: "Services", key: "services", viewAll: "/services" },
  { type: "section", label: "Markets", key: "markets", viewAll: "/markets" },
  { type: "section", label: "Company", key: "company" },
  { type: "section", label: "Trade Partners", key: "tradePartners" },
  { type: "link", label: "Projects", to: "/projects" },
  { type: "link", label: "Blog", to: "/blog" },
  { type: "link", label: "Contact", to: "/contact" },
];

export function MobileNavSheet({ open, onOpenChange }: MobileNavSheetProps) {
  const location = useLocation();
  const { settings } = useCompanySettings();
  const {
    searchQuery,
    setSearchQuery,
    filteredResults,
    isSearching,
  } = useNavigationSearch();

  const [searchOpen, setSearchOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | undefined>(undefined);
  const [announcement, setAnnouncement] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { onTouchStart, onTouchMove, onTouchEnd, translateX } = useSwipeGesture(() => {
    haptics.medium();
    setAnnouncement("Navigation closed");
    onOpenChange(false);
  });

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleLinkClick = () => {
    haptics.light();
    onOpenChange(false);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleToggleSearch = () => {
    haptics.light();
    setSearchOpen((prev) => {
      const next = !prev;
      if (!next) setSearchQuery("");
      return next;
    });
  };

  // Auto-focus search input when expanded
  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  // Reset state when sheet closes
  useEffect(() => {
    if (!open) {
      setSearchOpen(false);
      setSearchQuery("");
      setOpenSection(undefined);
    }
  }, [open, setSearchQuery]);

  const phoneNumber = settings?.phone || "";
  const phoneHref = phoneNumber ? `tel:${phoneNumber.replace(/[^\d+]/g, "")}` : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-md p-0 flex flex-col bg-background border-r border-border"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: translateX === 0 ? "transform 0.3s ease-out" : "none",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <ScreenReaderAnnouncement message={announcement} />

        {/* ── STICKY HEADER ── */}
        <SheetHeader className="px-4 py-3 border-b border-border bg-background flex-shrink-0 space-y-0">
          <div className="flex items-center justify-between gap-2">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex-shrink-0 flex items-center"
              aria-label="Ascent Group Construction — Home"
            >
              <img
                src={ascentLogoHorizontalDark}
                alt="Ascent Group Construction"
                className="h-9 w-auto block"
                width={140}
                height={36}
              />
            </Link>

            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleSearch}
                className="h-11 w-11 flex items-center justify-center rounded-md text-foreground hover:bg-muted active:scale-95 transition-all touch-manipulation"
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
              >
                {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="h-11 w-11 flex items-center justify-center rounded-md text-foreground hover:bg-muted active:scale-95 transition-all touch-manipulation"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Browse services, markets, company, and contact information.
          </SheetDescription>

          {/* Inline search field */}
          {searchOpen && (
            <div className="pt-3 animate-fade-in">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search services, markets, projects…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-11 text-sm bg-muted/40 border-border focus:border-accent rounded-md"
                  aria-label="Search navigation"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full hover:bg-muted touch-manipulation"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          )}
        </SheetHeader>

        {/* ── SCROLLABLE BODY ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {isSearching ? (
            <div className="px-4 py-3" role="region" aria-label="Search results">
              <MobileSearchResults
                results={filteredResults}
                searchQuery={searchQuery}
                onLinkClick={handleLinkClick}
              />
            </div>
          ) : (
            <nav className="py-2" aria-label="Primary navigation">
              <Accordion
                type="single"
                collapsible
                value={openSection}
                onValueChange={(v) => {
                  haptics.light();
                  setOpenSection(v || undefined);
                }}
                className="flex flex-col"
              >
                {NAV_ROWS.map((row) => {
                  // Direct link row
                  if (row.type === "link") {
                    const active = isActive(row.to);
                    return (
                      <Link
                        key={row.to}
                        to={row.to}
                        onClick={handleLinkClick}
                        className={cn(
                          "relative flex items-center justify-between px-5 h-14 text-[15px] font-medium border-b border-border/60 transition-colors touch-manipulation",
                          active
                            ? "text-primary bg-accent/5"
                            : "text-foreground hover:bg-muted/40 active:bg-muted/60"
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        {active && (
                          <span
                            className="absolute left-0 top-2 bottom-2 w-[2px] bg-accent rounded-r"
                            aria-hidden="true"
                          />
                        )}
                        <span>{row.label}</span>
                      </Link>
                    );
                  }

                  // Expandable section
                  const config = megaMenuDataEnhanced[row.key];
                  if (!config) return null;
                  const sectionActive =
                    row.viewAll && location.pathname.startsWith(row.viewAll);

                  return (
                    <AccordionItem
                      key={String(row.key)}
                      value={String(row.key)}
                      className="border-b border-border/60"
                    >
                      <AccordionTrigger
                        className={cn(
                          "relative px-5 h-14 hover:no-underline hover:bg-muted/40 active:bg-muted/60 [&[data-state=open]]:bg-muted/30 [&[data-state=open]>svg]:rotate-180 transition-colors touch-manipulation",
                          sectionActive && "text-primary"
                        )}
                      >
                        {sectionActive && (
                          <span
                            className="absolute left-0 top-2 bottom-2 w-[2px] bg-accent rounded-r"
                            aria-hidden="true"
                          />
                        )}
                        <span className="text-[15px] font-medium">{row.label}</span>
                      </AccordionTrigger>
                      <AccordionContent className="bg-muted/20 pb-2 pt-1">
                        {row.viewAll && (
                          <Link
                            to={row.viewAll}
                            onClick={handleLinkClick}
                            className="flex items-center justify-between mx-3 mb-1 px-3 py-2.5 rounded-md text-[13px] font-semibold text-accent hover:bg-accent/10 transition-colors touch-manipulation"
                          >
                            <span>View all {row.label.toLowerCase()}</span>
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        )}

                        {config.sections.map((section, sIdx) => {
                          // Flatten: collect every subItem from every category in this section
                          const items = section.categories.flatMap(
                            (cat) => cat.subItems || []
                          );
                          if (items.length === 0) return null;

                          return (
                            <div key={section.sectionTitle} className={sIdx > 0 ? "mt-3" : ""}>
                              <div className="px-6 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                {section.sectionTitle}
                              </div>
                              <div>
                                {items.map((item) => {
                                  const Icon = getIcon(
                                    item.icon || NAVIGATION_ICONS[item.link] || "ChevronRight"
                                  );
                                  const itemActive = isActive(item.link);
                                  return (
                                    <Link
                                      key={item.link}
                                      to={item.link}
                                      onClick={handleLinkClick}
                                      className={cn(
                                        "relative flex items-center gap-3 pl-6 pr-4 py-3 text-[14px] transition-colors touch-manipulation",
                                        itemActive
                                          ? "text-primary bg-accent/5"
                                          : "text-foreground/85 hover:bg-muted/50 active:bg-muted/70"
                                      )}
                                      aria-current={itemActive ? "page" : undefined}
                                    >
                                      {itemActive && (
                                        <span
                                          className="absolute left-0 top-2 bottom-2 w-[2px] bg-accent rounded-r"
                                          aria-hidden="true"
                                        />
                                      )}
                                      <Icon
                                        className="h-4 w-4 flex-shrink-0 text-muted-foreground"
                                        aria-hidden="true"
                                      />
                                      <span className="flex-1 min-w-0 truncate">
                                        {item.name}
                                      </span>
                                      <ChevronRight
                                        className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0"
                                        aria-hidden="true"
                                      />
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </nav>
          )}
        </div>

        {/* ── STICKY FOOTER CTA ── */}
        <div className="flex-shrink-0 border-t border-border bg-background px-4 py-3 space-y-2">
          <Button
            asChild
            size="lg"
            className="w-full h-12 gap-2 text-sm font-semibold bg-accent hover:bg-accent/90 text-accent-foreground active:scale-[0.98] transition-all touch-manipulation"
          >
            <Link to="/estimate" onClick={handleLinkClick}>
              Request a Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          {phoneHref && (
            <a
              href={phoneHref}
              className="flex items-center justify-center gap-2 h-10 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
              onClick={() => haptics.light()}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{phoneNumber || "Call us"}</span>
            </a>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
