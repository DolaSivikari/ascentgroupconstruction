export const serviceAreaCities = [
  "Toronto",
  "Mississauga",
  "Brampton",
  "Vaughan",
  "Markham",
  "Richmond Hill",
  "Oakville",
  "Burlington",
  "Milton",
  "Pickering",
  "Ajax",
  "Whitby",
  "Oshawa",
  "Newmarket",
  "Aurora",
  "King City",
  "Hamilton"
];

export const primaryServiceCities = [
  "Toronto",
  "Mississauga",
  "Brampton",
  "Vaughan",
  "Markham"
];

const serviceAreaPaths = new Map(
  serviceAreaCities.map((city) => [
    city.toLowerCase(),
    `/service-areas/${city.toLowerCase().replace(/\s+/g, '-')}`,
  ]),
);

/** Only link cities for which the website has a service-area page. */
export const getServiceAreaPath = (city: string): string | undefined =>
  serviceAreaPaths.get(city.trim().replace(/\s+/g, ' ').toLowerCase());
