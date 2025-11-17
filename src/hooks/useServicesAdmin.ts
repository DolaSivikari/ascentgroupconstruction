import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useServicesAdmin = () => {
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const createService = useMutation({
    mutationFn: async (service: any) => {
      const { data, error } = await supabase
        .from("services")
        .insert([service])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-admin"] });
      toast.success("Service created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create service: " + error.message);
    },
  });

  const updateService = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-admin"] });
      toast.success("Service updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update service: " + error.message);
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-admin"] });
      toast.success("Service deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete service: " + error.message);
    },
  });

  return {
    services,
    isLoading,
    createService,
    updateService,
    deleteService,
  };
};
