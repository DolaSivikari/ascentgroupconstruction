import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  stats_badge: string | null;
  icon_name: string | null;
  display_order: number;
}

export const useWhyChooseUs = () => {
  return useQuery({
    queryKey: ["why-choose-us-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("why_choose_us_items" as any)
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data as unknown as WhyChooseUsItem[];
    },
  });
};
