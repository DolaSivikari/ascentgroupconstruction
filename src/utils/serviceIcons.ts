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
  // Building Envelope & Exterior
  'building envelope solutions': Building2,
  'building envelope': Building2,
  'cladding systems': Warehouse,
  'waterproofing systems': Droplet,
  'waterproofing': Droplet,
  'eifs & stucco systems': Building,
  'masonry restoration': Wrench,
  
  // Protective & Coatings
  'protective & architectural coatings': Shield,
  'protective coatings': Shield,
  'protective architectural coatings': Shield,
  
  // Interior Construction
  'interior buildouts & finishing': Layers,
  'interior buildouts': Layers,
  'basement finishing': Home,
  'suite renovations': Building,
  'drywall & finishing': PanelTop,
  'carpentry & trim work': Hammer,
  
  // Specialty Finishing
  'painting services': Paintbrush,
  'tile & flooring': Grid3x3,
  'tile flooring': Grid3x3,
  'kitchen & bathroom renovations': Bath,
  
  // General Services
  'general repairs & maintenance': Settings,
  'sustainable building': Leaf,
  'sustainable construction': Leaf,
};

export const getIconForService = (serviceName: string): LucideIcon => {
  const normalizedName = serviceName.toLowerCase();
  return SERVICE_ICON_MAP[normalizedName] || Building2;
};
