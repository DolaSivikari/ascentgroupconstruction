import { 
  Building2, 
  Warehouse, 
  Droplet, 
  Wrench, 
  Shield, 
  Paintbrush, 
  Grid3x3,
  Layers,
  Leaf,
  Home,
  Hammer,
  PanelTop,
  FileText,
  Settings,
  Bath,
  Building,
  ShieldCheck,
  LucideIcon
} from "lucide-react";

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  // Building Envelope
  'building envelope solutions': Building2,
  'building envelope': Building2,
  'cladding systems': Warehouse,
  'waterproofing systems': Droplet,
  'waterproofing': Droplet,
  'stucco & eifs repair': Building,
  'masonry restoration': Wrench,
  
  // Interior Construction
  'commercial tenant improvements': Layers,
  'residential renovations': Home,
  'painting services': Paintbrush,
  'tile & flooring': Grid3x3,
  
  // Restoration & Repair
  'caulking & sealant services': Shield,
  'parking garage restoration': Warehouse,
  'façade remediation': Building2,
  
  // Legacy mappings (for backwards compatibility)
  'eifs & stucco systems': Building,
  'interior buildouts & finishing': Layers,
  'interior finishing & renovations': Home,
  'sealant replacement programs': Shield,
  'architectural coatings': Paintbrush,
  'protective & architectural coatings': Shield,
  
  // Archived services
  'basement finishing': Home,
  'suite renovations': Building,
  'drywall & finishing': PanelTop,
  'carpentry & trim work': Hammer,
  'kitchen & bathroom renovations': Bath,
  'general repairs & maintenance': Settings,
  'sustainable building': Leaf,
};

export const getIconForService = (serviceName: string): LucideIcon => {
  const normalizedName = serviceName.toLowerCase();
  return SERVICE_ICON_MAP[normalizedName] || Building2;
};
