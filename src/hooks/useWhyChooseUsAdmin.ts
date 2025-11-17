import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useWhyChooseUsAdmin = () => {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["why-choose-us-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("why_choose_us_items")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });

  const createItem = useMutation({
    mutationFn: async (item: any) => {
      const { data, error } = await supabase
        .from("why_choose_us_items")
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["why-choose-us-admin"] });
      toast.success("Item created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create item: " + error.message);
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("why_choose_us_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["why-choose-us-admin"] });
      toast.success("Item updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update item: " + error.message);
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("why_choose_us_items")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["why-choose-us-admin"] });
      toast.success("Item deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete item: " + error.message);
    },
  });

  const reorderItems = useMutation({
    mutationFn: async (items: Array<{ id: string; display_order: number }>) => {
      const updates = items.map(({ id, display_order }) =>
        supabase
          .from("why_choose_us_items")
          .update({ display_order })
          .eq("id", id)
      );
      
      const results = await Promise.all(updates);
      const error = results.find(r => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["why-choose-us-admin"] });
      toast.success("Items reordered successfully");
    },
    onError: (error) => {
      toast.error("Failed to reorder items: " + error.message);
    },
  });

  return {
    items,
    isLoading,
    createItem,
    updateItem,
    deleteItem,
    reorderItems,
  };
};
