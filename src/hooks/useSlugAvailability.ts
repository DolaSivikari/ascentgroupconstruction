import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeSlug } from "@/lib/admin/editorValues";
export function useSlugAvailability(
  table: "projects" | "services" | "blog_posts",
  slug: string,
  currentId?: string,
) {
  const [state, setState] = useState({
    checking: false,
    available: true,
    message: "",
  });
  useEffect(() => {
    if (!slug.trim()) {
      setState({
        checking: false,
        available: true,
        message: "A slug will be generated from the title.",
      });
      return;
    }
    let active = true;
    setState({ checking: true, available: false, message: "Checking slug…" });
    const timer = setTimeout(async () => {
      let query = supabase
        .from(table)
        .select("id")
        .eq("slug", normalizeSlug(slug))
        .limit(1);
      if (currentId && currentId !== "new") query = query.neq("id", currentId);
      const { data, error } = await query;
      if (active)
        setState({
          checking: false,
          available: !error && !data?.length,
          message: error
            ? "Could not verify this slug. Retry before saving."
            : data?.length
              ? "This slug is already used."
              : "Slug available",
        });
    }, 350);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [table, slug, currentId]);
  return state;
}
