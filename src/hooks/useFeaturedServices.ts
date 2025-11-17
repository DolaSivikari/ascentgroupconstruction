import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getIconForService } from "@/utils/serviceIcons";
import { LucideIcon } from "lucide-react";

interface FeaturedService {
  id: string;
  service_name: string;
  service_link: string;
  icon_name: string;
  icon: LucideIcon;
  display_order: number;
  is_active: boolean;
  category?: string;
  description?: string;
  promotion_badge?: string;
  start_date?: string;
  end_date?: string;
}

interface ServicePromotion {
  id: string;
  title: string;
  service_link: string;
  promotion_type: 'seasonal' | 'campaign' | 'urgent' | 'new';
  badge_text?: string;
  badge_color?: string;
  promotion_message?: string;
  discount_percentage?: number;
}

export const useFeaturedServices = () => {
  return useQuery({
    queryKey: ['featured-services'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_active_featured_services');

      if (error) {
        console.error('Error fetching featured services:', error);
        return [];
      }

      return (data || []).map((service: any) => ({
        ...service,
        icon: getIconForService(service.service_name),
      })) as FeaturedService[];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useServicePromotions = () => {
  return useQuery({
    queryKey: ['service-promotions'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_active_promotions');

      if (error) {
        console.error('Error fetching promotions:', error);
        return [];
      }

      return data as ServicePromotion[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Admin hooks for managing featured services
export const useFeaturedServicesAdmin = () => {
  const queryClient = useQueryClient();

  const { data: allFeaturedServices, isLoading } = useQuery({
    queryKey: ['featured-services-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createFeaturedService = useMutation({
    mutationFn: async (service: any) => {
      const { error } = await supabase
        .from('featured_services')
        .insert([service]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-services'] });
      queryClient.invalidateQueries({ queryKey: ['featured-services-admin'] });
    },
  });

  const updateFeaturedService = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('featured_services')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-services'] });
      queryClient.invalidateQueries({ queryKey: ['featured-services-admin'] });
    },
  });

  const deleteFeaturedService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('featured_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-services'] });
      queryClient.invalidateQueries({ queryKey: ['featured-services-admin'] });
    },
  });

  return {
    allFeaturedServices,
    isLoading,
    createFeaturedService: createFeaturedService.mutate,
    updateFeaturedService: updateFeaturedService.mutate,
    deleteFeaturedService: deleteFeaturedService.mutate,
  };
};

// Admin hooks for managing promotions
export const useServicePromotionsAdmin = () => {
  const queryClient = useQueryClient();

  const { data: allPromotions, isLoading } = useQuery({
    queryKey: ['service-promotions-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_promotions')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createPromotion = useMutation({
    mutationFn: async (promotion: any) => {
      const { error } = await supabase
        .from('service_promotions')
        .insert([promotion]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['service-promotions-admin'] });
    },
  });

  const updatePromotion = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('service_promotions')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['service-promotions-admin'] });
    },
  });

  const deletePromotion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_promotions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-promotions'] });
      queryClient.invalidateQueries({ queryKey: ['service-promotions-admin'] });
    },
  });

  return {
    allPromotions,
    isLoading,
    createPromotion: createPromotion.mutate,
    updatePromotion: updatePromotion.mutate,
    deletePromotion: deletePromotion.mutate,
  };
};
