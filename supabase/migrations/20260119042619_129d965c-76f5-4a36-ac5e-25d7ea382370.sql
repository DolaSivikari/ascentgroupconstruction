-- Create seo_keywords table for keyword tracking
CREATE TABLE public.seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 100),
  intent TEXT CHECK (intent IN ('informational', 'commercial', 'transactional', 'navigational')),
  target_page TEXT,
  primary_keyword BOOLEAN DEFAULT false,
  current_position INTEGER,
  position_change INTEGER,
  last_checked TIMESTAMPTZ,
  category TEXT CHECK (category IN ('service', 'location', 'brand', 'long-tail', 'audience')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_seo_keywords_target_page ON public.seo_keywords(target_page);
CREATE INDEX idx_seo_keywords_category ON public.seo_keywords(category);

-- Enable RLS
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only
CREATE POLICY "Admins can manage SEO keywords"
ON public.seo_keywords
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Insert strategic keywords
INSERT INTO public.seo_keywords (keyword, intent, target_page, primary_keyword, category) VALUES
-- Primary service keywords
('building envelope contractor ontario', 'commercial', '/services/building-envelope', true, 'service'),
('facade remediation toronto', 'commercial', '/services/building-envelope', true, 'service'),
('waterproofing contractor gta', 'commercial', '/services/building-envelope', true, 'service'),
('eifs contractor toronto', 'commercial', '/services/cladding-systems', true, 'service'),
('masonry restoration ontario', 'commercial', '/services/building-envelope', true, 'service'),
('parking garage restoration toronto', 'commercial', '/services/building-envelope', true, 'service'),
('cladding contractor ontario', 'commercial', '/services/cladding-systems', true, 'service'),
('commercial painting contractor toronto', 'commercial', '/services/painting-services', false, 'service'),
('interior buildout contractor gta', 'commercial', '/services/interior-buildouts', false, 'service'),

-- Location keywords
('specialty contractor north york', 'commercial', '/', false, 'location'),
('restoration contractor mississauga', 'commercial', '/resources/service-areas', false, 'location'),
('building envelope gta', 'commercial', '/', false, 'location'),
('commercial contractor vaughan', 'commercial', '/resources/service-areas', false, 'location'),
('construction company brampton', 'commercial', '/resources/service-areas', false, 'location'),

-- Audience keywords
('specialty contractor for general contractors', 'commercial', '/for-general-contractors', true, 'audience'),
('commercial painting property managers', 'commercial', '/property-managers', true, 'audience'),
('exterior contractor homeowners toronto', 'commercial', '/homeowners', true, 'audience'),

-- Long-tail keywords
('how much does facade remediation cost', 'informational', '/faq', false, 'long-tail'),
('eifs vs stucco ontario', 'informational', '/faq', false, 'long-tail'),
('parking garage waterproofing process', 'informational', '/services/building-envelope', false, 'long-tail'),
('building envelope inspection checklist', 'informational', '/faq', false, 'long-tail');

-- Add public read policy for keywords (for potential public SEO dashboard)
CREATE POLICY "Public can view keywords"
ON public.seo_keywords
FOR SELECT
USING (true);