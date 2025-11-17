import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCompanyOverviewAdmin = () => {
  const queryClient = useQueryClient();

  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ["company-overview-sections-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_overview_sections")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["company-overview-items-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_overview_items")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });

  const createSection = useMutation({
    mutationFn: async (section: any) => {
      const { data, error } = await supabase
        .from("company_overview_sections")
        .insert([section])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-overview-sections-admin"] });
      toast.success("Section created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create section: " + error.message);
    },
  });

  const updateSection = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("company_overview_sections")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-overview-sections-admin"] });
      toast.success("Section updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update section: " + error.message);
    },
  });

  const deleteSection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("company_overview_sections")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-overview-sections-admin"] });
      queryClient.invalidateQueries({ queryKey: ["company-overview-items-admin"] });
      toast.success("Section deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete section: " + error.message);
    },
  });

  const createItem = useMutation({
    mutationFn: async (item: any) => {
      const { data, error } = await supabase
        .from("company_overview_items")
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-overview-items-admin"] });
      toast.success("Item created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create item: " + error.message);
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("company_overview_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-overview-items-admin"] });
      toast.success("Item updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update item: " + error.message);
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("company_overview_items")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-overview-items-admin"] });
      toast.success("Item deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete item: " + error.message);
    },
  });

  return {
    sections,
    items,
    isLoading: sectionsLoading || itemsLoading,
    createSection,
    updateSection,
    deleteSection,
    createItem,
    updateItem,
    deleteItem,
  };
};
