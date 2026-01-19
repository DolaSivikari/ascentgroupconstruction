import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SEOKeyword {
  id: string;
  keyword: string;
  search_volume: number | null;
  difficulty: number | null;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational' | null;
  target_page: string | null;
  primary_keyword: boolean;
  current_position: number | null;
  position_change: number | null;
  last_checked: string | null;
  category: 'service' | 'location' | 'brand' | 'long-tail' | 'audience' | null;
  created_at: string;
  updated_at: string;
}

export function useSEOKeywords() {
  return useQuery({
    queryKey: ['seo-keywords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_keywords')
        .select('*')
        .order('primary_keyword', { ascending: false })
        .order('category');
      
      if (error) throw error;
      return data as SEOKeyword[];
    },
  });
}

export function useSEOKeywordsByCategory(category: string) {
  return useQuery({
    queryKey: ['seo-keywords', 'category', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_keywords')
        .select('*')
        .eq('category', category)
        .order('primary_keyword', { ascending: false });
      
      if (error) throw error;
      return data as SEOKeyword[];
    },
  });
}

export function useSEOKeywordsByPage(targetPage: string) {
  return useQuery({
    queryKey: ['seo-keywords', 'page', targetPage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_keywords')
        .select('*')
        .eq('target_page', targetPage)
        .order('primary_keyword', { ascending: false });
      
      if (error) throw error;
      return data as SEOKeyword[];
    },
    enabled: !!targetPage,
  });
}

export function useUpdateKeywordPosition() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, position }: { id: string; position: number }) => {
      // Get current position first
      const { data: current } = await supabase
        .from('seo_keywords')
        .select('current_position')
        .eq('id', id)
        .single();
      
      const positionChange = current?.current_position 
        ? current.current_position - position 
        : null;
      
      const { error } = await supabase
        .from('seo_keywords')
        .update({
          current_position: position,
          position_change: positionChange,
          last_checked: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keywords'] });
    },
  });
}

export function useAddKeyword() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keyword: { keyword: string } & Partial<Omit<SEOKeyword, 'keyword'>>) => {
      const { error } = await supabase
        .from('seo_keywords')
        .insert([keyword]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keywords'] });
    },
  });
}

export function useDeleteKeyword() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('seo_keywords')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keywords'] });
    },
  });
}
