import { useSearchParams } from "react-router-dom";

/**
 * Hook to detect if the current page is in preview mode
 * Preview mode allows viewing unpublished/draft content
 */
export const usePreviewMode = () => {
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const previewToken = searchParams.get('token');
  
  return { 
    isPreview, 
    previewToken,
    isValidPreview: isPreview && !!previewToken 
  };
};
