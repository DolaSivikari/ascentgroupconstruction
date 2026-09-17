import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { openDocumentUrl } from '@/utils/documentUrl';

export interface Document {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  version: string | null;
  is_active: boolean;
  download_count: number | null;
  display_order: number | null;
}

// Fetch all active documents, optionally filtered by category
export function useDocuments(category?: string) {
  return useQuery({
    queryKey: ['documents', category],
    queryFn: async () => {
      let query = supabase
        .from('documents_library')
        .select('*')
        .eq('is_active', true);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('display_order');
      if (error) throw error;
      return data as Document[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Fetch a single document by category
export function useDocument(category: string) {
  return useQuery({
    queryKey: ['document', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents_library')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('display_order')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as Document | null;
    },
  });
}

// Track document download and increment counter
export function useTrackDownload() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (documentId: string) => {
      const { data: doc } = await supabase
        .from('documents_library')
        .select('download_count')
        .eq('id', documentId)
        .single();
      
      if (doc) {
        await supabase
          .from('documents_library')
          .update({ download_count: (doc.download_count || 0) + 1 })
          .eq('id', documentId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// Helper to trigger download
export async function downloadDocument(doc: Document, trackDownload?: (id: string) => void) {
  if (trackDownload) {
    trackDownload(doc.id);
  }
  await openDocumentUrl(doc.file_url);
}
