import base from "./pages/city-page";
import { defineContent } from "./types";
import { CITY_DESCRIPTION_FIELDS } from "./shared/city-fields";
export function cityContentModule(city: string) {
  const descriptions = new Set(Object.values(CITY_DESCRIPTION_FIELDS));
  return defineContent(
    `service-areas-${city}`,
    base.defaults,
    Object.fromEntries(
      Object.entries(base.meta).map(([key, meta]) => [
        key,
        {
          ...meta,
          locked:
            meta.locked ||
            ["name", "region"].includes(meta.label) ||
            (descriptions.has(key) && key !== CITY_DESCRIPTION_FIELDS[city]),
          label:
            key === CITY_DESCRIPTION_FIELDS[city]
              ? `${city.replace(/-/g, " ")} description`
              : meta.label,
        },
      ]),
    ),
  );
}
