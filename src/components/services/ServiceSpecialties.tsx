import { getServiceSpecialties } from "@/data/service-registry";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";

/** Introduce specialty pages from the broader service visitors already know. */
export const ServiceSpecialties = ({ slug }: { slug: string }) => {
  const specialties = getServiceSpecialties(slug);
  if (specialties.length === 0) return null;

  return (
    <RelatedLinksGrid
      title="Explore Specialized Services"
      description="Choose a service below for more details about the work you need."
      background="default"
      links={specialties.map((entry) => ({
        title: entry.navLabel,
        description: entry.navDescription,
        href: entry.path,
      }))}
    />
  );
};
