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
  LucideIcon
} from "lucide-react";

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  'building envelope': Building2,
  'cladding systems': Warehouse,
  'waterproofing': Droplet,
  'masonry restoration': Wrench,
  'protective coatings': Shield,
  'painting services': Paintbrush,
  'tile flooring': Grid3x3,
  'interior buildouts': Layers,
  'sustainable construction': Leaf,
};

export const getIconForService = (serviceName: string): LucideIcon => {
  const normalizedName = serviceName.toLowerCase();
  return SERVICE_ICON_MAP[normalizedName] || Building2;
};
