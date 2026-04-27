/**
 * Smart related-links resolver.
 *
 * Generates contextually-relevant cross-link suggestions for ServiceDetail,
 * ProjectDetail, and BlogPost templates by querying Supabase for siblings
 * sharing tags / categories / sectors. Falls back to generic catalog links
 * when no overlap is found so the RelatedLinksGrid is never empty.
 */
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Building2, Wrench, type LucideIcon } from "lucide-react";

export interface SmartRelatedLink {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Helpers                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

const truncate = (s: string | null | undefined, n = 110): string => {
  if (!s) return "";
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length > n ? `${clean.slice(0, n - 1)}…` : clean;
};

const dedupeByHref = (links: SmartRelatedLink[]): SmartRelatedLink[] => {
  const seen = new Set<string>();
  return links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
};

/** Always-available fallback links, used when DB returns nothing. */
const FALLBACKS: SmartRelatedLink[] = [
  {
    title: "All Services",
    description: "Browse the full envelope, restoration & interior catalog.",
    href: "/services",
    icon: Wrench,
  },
  {
    title: "Recent Projects",
    description: "See similar work delivered across the GTA.",
    href: "/projects",
    icon: Briefcase,
  },
  {
    title: "Capabilities",
    description: "What we self-perform and how we deliver.",
    href: "/capabilities",
    icon: Building2,
  },
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  ServiceDetail                                                             */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Pick up to 3 sibling services that share the same `category`, plus one
 * project that has used this service. Falls back to top services if needed.
 */
export const getRelatedForService = async (params: {
  serviceId?: string;
  serviceSlug: string;
  category?: string | null;
}): Promise<SmartRelatedLink[]> => {
  const { serviceId, serviceSlug, category } = params;
  const out: SmartRelatedLink[] = [];

  // 1) Sibling services in the same category
  if (category) {
    const { data: siblings } = await supabase
      .from("services")
      .select("name, slug, short_description, category")
      .eq("publish_state", "published")
      .eq("category", category)
      .neq("slug", serviceSlug)
      .limit(2);

    siblings?.forEach((s) => {
      out.push({
        title: s.name,
        description: truncate(s.short_description) || `Related ${category} service.`,
        href: `/services/${s.slug}`,
        icon: Wrench,
      });
    });
  }

  // 2) One recent project that used this service
  if (serviceId) {
    const { data: projectLinks } = await supabase
      .from("project_services")
      .select("projects(title, slug, summary, publish_state)")
      .eq("service_id", serviceId)
      .limit(4);

    const project = projectLinks
      ?.map((p) => p.projects as { title: string; slug: string; summary: string | null; publish_state: string } | null)
      .filter((p): p is { title: string; slug: string; summary: string | null; publish_state: string } => Boolean(p))
      .find((p) => p.publish_state === "published");

    if (project) {
      out.push({
        title: project.title,
        description: truncate(project.summary) || "A recent project using this scope.",
        href: `/projects/${project.slug}`,
        icon: Briefcase,
      });
    }
  }

  // 3) Top up with fallbacks
  return dedupeByHref([...out, ...FALLBACKS]).slice(0, 3);
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  ProjectDetail                                                             */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Pick up to 3 cross-links for a project: another project in the same
 * category/sector, the primary service used, and a fallback.
 */
export const getRelatedForProject = async (params: {
  projectId: string;
  projectSlug: string;
  category?: string | null;
  tags?: string[] | null;
  serviceSlug?: string | null;
  serviceName?: string | null;
}): Promise<SmartRelatedLink[]> => {
  const { projectId, projectSlug, category, tags, serviceSlug, serviceName } = params;
  const out: SmartRelatedLink[] = [];

  // 1) Sibling project in same category (or sharing a tag)
  let siblingQuery = supabase
    .from("projects")
    .select("title, slug, summary, category, tags")
    .eq("publish_state", "published")
    .neq("slug", projectSlug)
    .limit(3);

  if (category) {
    siblingQuery = siblingQuery.eq("category", category);
  } else if (tags && tags.length > 0) {
    siblingQuery = siblingQuery.overlaps("tags", tags);
  }

  const { data: siblings } = await siblingQuery;

  // Score by tag overlap when tags exist
  const scored = (siblings || [])
    .map((s) => {
      const overlap =
        tags && Array.isArray(s.tags)
          ? s.tags.filter((t: string) => tags.includes(t)).length
          : 0;
      return { row: s, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap);

  scored.slice(0, 1).forEach(({ row }) => {
    out.push({
      title: row.title,
      description: truncate(row.summary) || `Another ${row.category ?? "GTA"} project.`,
      href: `/projects/${row.slug}`,
      icon: Briefcase,
    });
  });

  // 2) Primary service used on this project
  if (serviceSlug && serviceName) {
    out.push({
      title: serviceName,
      description: `Learn how we self-perform ${serviceName.toLowerCase()}.`,
      href: `/services/${serviceSlug}`,
      icon: Wrench,
    });
  }

  // Top up
  return dedupeByHref([...out, ...FALLBACKS]).slice(0, 3);
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  BlogPost                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Pick up to 3 cross-links for a blog post: sibling post sharing tags,
 * a related service if a tag matches a service slug/category, plus fallback.
 */
export const getRelatedForBlogPost = async (params: {
  postSlug: string;
  category?: string | null;
  tags?: string[] | null;
  sector?: string | null;
}): Promise<SmartRelatedLink[]> => {
  const { postSlug, category, tags, sector } = params;
  const out: SmartRelatedLink[] = [];

  // 1) Sibling post — overlap on tags or same category
  let postQuery = supabase
    .from("blog_posts")
    .select("title, slug, summary, category, tags")
    .eq("publish_state", "published")
    .neq("slug", postSlug)
    .order("published_at", { ascending: false })
    .limit(5);

  if (tags && tags.length > 0) {
    postQuery = postQuery.overlaps("tags", tags);
  } else if (category) {
    postQuery = postQuery.eq("category", category);
  }

  const { data: posts } = await postQuery;
  const scoredPosts = (posts || [])
    .map((p) => {
      const overlap =
        tags && Array.isArray(p.tags)
          ? p.tags.filter((t: string) => tags.includes(t)).length
          : 0;
      return { row: p, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap);

  scoredPosts.slice(0, 1).forEach(({ row }) => {
    out.push({
      title: row.title,
      description: truncate(row.summary) || "Continue reading on our blog.",
      href: `/blog/${row.slug}`,
      icon: Briefcase,
    });
  });

  // 2) Related service — match a tag against any service slug
  if (tags && tags.length > 0) {
    const normalized = tags.map((t) => t.toLowerCase().trim());
    const { data: matched } = await supabase
      .from("services")
      .select("name, slug, short_description")
      .eq("publish_state", "published")
      .or(
        normalized
          .map((t) => `slug.eq.${t},name.ilike.%${t}%`)
          .join(","),
      )
      .limit(1);

    matched?.forEach((s) => {
      out.push({
        title: s.name,
        description: truncate(s.short_description) || `Self-performed by Ascent Group.`,
        href: `/services/${s.slug}`,
        icon: Wrench,
      });
    });
  }

  // 3) Sector-driven cross-link
  if (sector) {
    const sectorMap: Record<string, SmartRelatedLink> = {
      commercial: {
        title: "For Commercial Clients",
        description: "Programs for office, retail, and institutional portfolios.",
        href: "/commercial-clients",
        icon: Building2,
      },
      residential: {
        title: "For Property Managers",
        description: "Multi-residential envelope & restoration programs.",
        href: "/property-managers",
        icon: Building2,
      },
      institutional: {
        title: "For Architects",
        description: "Spec support, sample reviews, and shop drawings.",
        href: "/for-architects",
        icon: Building2,
      },
    };
    const match = sectorMap[sector.toLowerCase()];
    if (match) out.push(match);
  }

  return dedupeByHref([...out, ...FALLBACKS]).slice(0, 3);
};
