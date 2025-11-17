import { Building2, Home, Cpu, Sparkles } from "lucide-react";

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: typeof Building2;
  color: string;
  serviceNames: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "building-envelope",
    name: "Building Envelope Systems",
    description: "Comprehensive exterior envelope solutions",
    icon: Building2,
    color: "primary",
    serviceNames: [
      "Building Envelope Solutions",
      "Cladding Systems",
      "Masonry"
    ]
  },
  {
    id: "interior-construction",
    name: "Interior Construction",
    description: "Complete interior buildouts, finishing, and painting services",
    icon: Home,
    color: "terracotta",
    serviceNames: [
      "Interior Buildouts & Finishing",
      "Tile & Flooring",
      "Painting Services"
    ]
  },
  {
    id: "specialized-services",
    name: "Specialized Services",
    description: "Expert specialty solutions",
    icon: Sparkles,
    color: "primary",
    serviceNames: [
      "Protective & Architectural Coatings",
      "Sustainable Building"
    ]
  }
];

export const getCategoryForService = (serviceName: string): ServiceCategory | undefined => {
  return SERVICE_CATEGORIES.find(cat => 
    cat.serviceNames.some(name => 
      name.toLowerCase() === serviceName.toLowerCase()
    )
  );
};

export const getServicesInCategory = (categoryId: string, allServices: any[]) => {
  const category = SERVICE_CATEGORIES.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  return allServices.filter(service => 
    category.serviceNames.some(name => 
      name.toLowerCase() === service.name.toLowerCase()
    )
  );
};
