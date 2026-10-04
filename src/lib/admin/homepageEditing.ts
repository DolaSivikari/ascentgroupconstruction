import type { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { adminErrorMessage } from "./editorValues";

export function invalidateHomepageQueries(client: QueryClient) {
  void client.invalidateQueries({ queryKey: ["hero-slides"] });
  void client.invalidateQueries({ queryKey: ["why-choose-us"] });
  void client.invalidateQueries({ queryKey: ["why-choose-us-public"] });
}

export async function saveHeroOrder(slides: Array<{ id: string }>) {
  let saved = 0;
  const failures: string[] = [];
  for (const [index, slide] of slides.entries()) {
    try {
      const { data, error } = await supabase
        .from("hero_slides")
        .update({ display_order: index + 1 })
        .eq("id", slide.id)
        .select("id")
        .single();
      if (error) throw error;
      if (!data)
        throw new Error("The saved slide order could not be verified.");
      saved += 1;
    } catch (error) {
      failures.push(adminErrorMessage(error));
    }
  }
  if (failures.length)
    throw new Error(
      `Slide order is incomplete: ${saved} of ${slides.length} updates saved. ${failures[0]} The list has been reloaded; retry reordering.`,
    );
}
