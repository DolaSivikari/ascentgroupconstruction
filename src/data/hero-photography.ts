/** Curated images. Sources: _assessment/headers/hero-image-sources.json. */
import { generatedHeroScenes } from "./hero-scenes";
import photoToronto from "@/assets/heroes/cities/toronto.jpg";
import photoMississauga from "@/assets/heroes/cities/mississauga.jpg";
import photoBrampton from "@/assets/heroes/cities/brampton.jpg";
import photoVaughan from "@/assets/heroes/cities/vaughan.jpg";
import photoMarkham from "@/assets/heroes/cities/markham.jpg";
import photoRichmondHill from "@/assets/heroes/cities/richmond-hill.jpg";
import photoOakville from "@/assets/heroes/cities/oakville.jpg";
import photoBurlington from "@/assets/heroes/cities/burlington.jpg";
import photoHamilton from "@/assets/heroes/cities/hamilton.jpg";
import photoMilton from "@/assets/heroes/cities/milton.jpg";
import photoNewmarket from "@/assets/heroes/cities/newmarket.jpg";
import photoAurora from "@/assets/heroes/cities/aurora.jpg";
import photoKingCity from "@/assets/heroes/cities/king-city.jpg";
import photoPickering from "@/assets/heroes/cities/pickering.jpg";
import photoAjax from "@/assets/heroes/cities/ajax.jpg";
import photoWhitby from "@/assets/heroes/cities/whitby.jpg";
import photoOshawa from "@/assets/heroes/cities/oshawa.jpg";

export interface HeroPhoto {
  image: string;
  alt: string;
  position?: string;
  mobilePosition?: string;
  source: string;
  author?: string;
  license?: string;
  licenseUrl?: string;
  projectPath?: string;
  projectTitle?: string;
  origin?: "generated";
}

export const cityPhotography: Record<string, HeroPhoto> = {
  toronto: {
    image: photoToronto,
    alt: "Toronto skyline seen from Snake Island",
    source:
      "https://commons.wikimedia.org/wiki/File:Toronto_Skyline_from_Snake_Island,_September_11_2026_(01).jpg",
    author: "Dillan Payne",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    position: "50% 55%",
    mobilePosition: "50% 55%",
  },
  mississauga: {
    image: photoMississauga,
    alt: "Mississauga skyline above the tree canopy",
    source:
      "https://commons.wikimedia.org/wiki/File:Skyline_of_Mississauga_(cropped).jpg",
    author: "The Eloquent Peasant",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    position: "50% 55%",
    mobilePosition: "50% 55%",
  },
  brampton: {
    image: photoBrampton,
    alt: "Peel Art Gallery, Museum and Archives building in Brampton",
    source:
      "https://commons.wikimedia.org/wiki/File:Peel_Art_Gallery,_Museum_and_Archives_Building_(PAMA).jpg",
    author: "Peter K Burian",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  vaughan: {
    image: photoVaughan,
    alt: "Vaughan Metropolitan Centre skyline",
    source:
      "https://commons.wikimedia.org/wiki/File:Vaughan_Metropolitan_Centre_Skyline,_August_7_2025.jpg",
    author: "Dillan Payne",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    position: "50% 55%",
    mobilePosition: "50% 55%",
  },
  markham: {
    image: photoMarkham,
    alt: "Markham Civic Centre and reflecting pool",
    source: "https://commons.wikimedia.org/wiki/File:MarkhamCivicCenter11.JPG",
    author: "Raysonho @ Open Grid Scheduler / Grid Engine",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "richmond-hill": {
    image: photoRichmondHill,
    alt: "Downtown Richmond Hill streetscape",
    source: "https://commons.wikimedia.org/wiki/File:DowntownRichmondHill3.jpg",
    author: "Raysonho @ Open Grid Scheduler / Scalable Grid Engine",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  oakville: {
    image: photoOakville,
    alt: "Aerial view of Oakville and its waterfront",
    source:
      "https://commons.wikimedia.org/wiki/File:Aerial_view_of_Oakville_2023.jpg",
    author: "Canmenwalker",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    position: "50% 55%",
    mobilePosition: "50% 55%",
  },
  burlington: {
    image: photoBurlington,
    alt: "Street clock and downtown buildings in Burlington",
    source:
      "https://commons.wikimedia.org/wiki/File:02Street_clocks_in_Burlington,_Ontario,_Canada.JPG",
    author: "Laslovarga",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  hamilton: {
    image: photoHamilton,
    alt: "Hamilton skyline viewed from the Niagara Escarpment",
    source:
      "https://commons.wikimedia.org/wiki/File:HamiltonOntarioSkylineD.JPG",
    author: "Nhl4hamilton (Rick Cordeiro)",
    license: "Public domain",
    licenseUrl: "",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  milton: {
    image: photoMilton,
    alt: "Downtown Milton streetscape",
    source: "https://commons.wikimedia.org/wiki/File:Downtown_Milton2.jpg",
    author: "Hozombel at English Wikipedia",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  newmarket: {
    image: photoNewmarket,
    alt: "Main Street South heritage district in Newmarket",
    source:
      "https://commons.wikimedia.org/wiki/File:Lower_Main_Street_South_Heritage_Conservation_District-Newmarket-Ontario-_OHAR58-20200905_(1).jpg",
    author: "Mhsheikholeslami",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  aurora: {
    image: photoAurora,
    alt: "Aurora Town Hall",
    source:
      "https://commons.wikimedia.org/wiki/File:Aurora_Town_Hall-_Aurora-_Ontario-20200905.jpg",
    author: "Mhsheikholeslami",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "king-city": {
    image: photoKingCity,
    alt: "King City GO station building",
    source: "https://commons.wikimedia.org/wiki/File:KingCityGOStationCrop.jpg",
    author: "AndroidCat",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  pickering: {
    image: photoPickering,
    alt: "Pickering City Hall",
    source:
      "https://commons.wikimedia.org/wiki/File:Pickering_City_Hall,_October_3_2026_(02).jpg",
    author: "Dillan Payne",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  ajax: {
    image: photoAjax,
    alt: "Aerial view of Ajax, Ontario",
    source:
      "https://commons.wikimedia.org/wiki/File:Aerial_Photograph_of_Ajax,_Ontario_-_Discover_The_Town_Of_Ajax_(01m08s)_(edited).jpg",
    author: "The Town of Ajax",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    position: "50% 55%",
    mobilePosition: "50% 55%",
  },
  whitby: {
    image: photoWhitby,
    alt: "Downtown Whitby streetscape",
    source:
      "https://commons.wikimedia.org/wiki/File:Downtown_Whitby,_Ontario,_March_9_2026_(03).jpg",
    author: "Dillan Payne",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  oshawa: {
    image: photoOshawa,
    alt: "Historic civic buildings in downtown Oshawa",
    source: "https://commons.wikimedia.org/wiki/File:Oshawa_ON.JPG",
    author: "P199",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
};

export const portfolioPhotography: Record<string, HeroPhoto> = {
  "envelope-complete": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/1781787450437-ttpe0td4vcp.jpg",
    alt: "Completed exterior at 65 Westmount Avenue",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/1781787450437-ttpe0td4vcp.jpg",
    projectPath: "/projects/65-westmount-avenue",
    projectTitle: "65 Westmount Avenue",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "envelope-opening": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/process/1781787394929-8.jpg",
    alt: "Exposed window opening during envelope repairs at 65 Westmount Avenue",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/process/1781787394929-8.jpg",
    projectPath: "/projects/65-westmount-avenue",
    projectTitle: "65 Westmount Avenue",
    position: "50% 35%",
    mobilePosition: "50% 50%",
  },
  "envelope-flashing": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/process/1781787402120-13.jpg",
    alt: "Window flashing work at 65 Westmount Avenue",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/process/1781787402120-13.jpg",
    projectPath: "/projects/65-westmount-avenue",
    projectTitle: "65 Westmount Avenue",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "envelope-staging": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/before/1781787442300-0.jpg",
    alt: "Scaffolding during envelope repairs at 65 Westmount Avenue",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/before/1781787442300-0.jpg",
    projectPath: "/projects/65-westmount-avenue",
    projectTitle: "65 Westmount Avenue",
    position: "50% 40%",
    mobilePosition: "50% 50%",
  },
  "stucco-installation": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/process/1763559933173-0.jpg",
    alt: "Stucco installation work at Comfort Inn & Suites",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/process/1763559933173-0.jpg",
    projectPath: "/projects/comfort-inn-suites",
    projectTitle: "Comfort Inn & Suites",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "stucco-finish": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/a1b7a274-1c99-49f6-bf0d-a420066b309d/process/1791488925391-0.jpg",
    alt: "Exterior stucco work at Comfort Inn & Suites",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/a1b7a274-1c99-49f6-bf0d-a420066b309d/process/1791488925391-0.jpg",
    projectPath: "/projects/comfort-inn-suites",
    projectTitle: "Comfort Inn & Suites",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "cladding-residential": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/after/1780716554931-0.jpeg",
    alt: "Finished residential exterior at 67 Edgecroft Road",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/after/1780716554931-0.jpeg",
    projectPath: "/projects/67-edgecroft-rd-etobicoke",
    projectTitle: "67 Edgecroft Rd Etobicoke",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "project-planning": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1780716647152-0.jpeg",
    alt: "Residential design sketch from the 67 Edgecroft Road project",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1780716647152-0.jpeg",
    projectPath: "/projects/67-edgecroft-rd-etobicoke",
    projectTitle: "67 Edgecroft Rd Etobicoke",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "project-documentation": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/1776798291945-laq7ij5uiye.png",
    alt: "Architectural project documentation for Blackhurst Cultural Centre",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/1776798291945-laq7ij5uiye.png",
    projectPath: "/projects/blackhurst-cultural-centre-",
    projectTitle: "Blackhurst Cultural Centre",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "interior-progress": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763561434045-0.jpg",
    alt: "Interior finishing in progress at Innisfil Catholic School",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763561434045-0.jpg",
    projectPath: "/projects/innisfil-catholic-school",
    projectTitle: "Innisfil Catholic School",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "interior-finishes": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763561435191-1.jpg",
    alt: "Finished interior at Innisfil Catholic School",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763561435191-1.jpg",
    projectPath: "/projects/innisfil-catholic-school",
    projectTitle: "Innisfil Catholic School",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "institutional-finishes": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763560946134-2.jpg",
    alt: "Repainted doors and interior finishes at Dunnville Secondary School",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763560946134-2.jpg",
    projectPath: "/projects/dunnville-secondary-school",
    projectTitle: "Dunnville Secondary School",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "residential-interior": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763561840596-0.jpg",
    alt: "Finished residential interior at Queensland Condos",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763561840596-0.jpg",
    projectPath: "/projects/queensland-condos",
    projectTitle: "Queensland Condos",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "residential-amenities": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/f258383c-6e1b-4e1e-910d-239bd695cf0e/gallery/1780716079277-0.jpeg",
    alt: "Finished shared interior at KW Habilitation Affordable Housing",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/f258383c-6e1b-4e1e-910d-239bd695cf0e/gallery/1780716079277-0.jpeg",
    projectPath: "/projects/kw-habilitation-affordable-housing",
    projectTitle: "KW Habilitation Affordable Housing",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "condominium-exterior": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/1763562552629-d5mnykzdjq.jpg",
    alt: "Queensland Condos building and surrounding streets",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/1763562552629-d5mnykzdjq.jpg",
    projectPath: "/projects/queensland-condos",
    projectTitle: "Queensland Condos",
    position: "50% 55%",
    mobilePosition: "50% 55%",
  },
  "housing-exterior": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/1780715688331-7eb7tkhjzp6.jpg",
    alt: "KW Habilitation Affordable Housing exterior",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/1780715688331-7eb7tkhjzp6.jpg",
    projectPath: "/projects/kw-habilitation-affordable-housing",
    projectTitle: "KW Habilitation Affordable Housing",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "commercial-interior": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763560368896-3.jpeg",
    alt: "Finished café interior from the Café Luka portfolio",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763560368896-3.jpeg",
    projectPath: "/projects/caf-luka",
    projectTitle: "Café Luka",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "coatings-progress": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/before/1775922122933-1.jpg",
    alt: "Structural steel coating work at York Region Warehouse",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/before/1775922122933-1.jpg",
    projectPath: "/projects/york-region-warehouse",
    projectTitle: "York Region Warehouse",
    position: "50% 40%",
    mobilePosition: "50% 50%",
  },
  "structural-coatings": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/after/1775922147777-2.jpeg",
    alt: "Coated structural steel at York Region Warehouse",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/after/1775922147777-2.jpeg",
    projectPath: "/projects/york-region-warehouse",
    projectTitle: "York Region Warehouse",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
  "school-corridor": {
    image:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763560947836-5.jpg",
    alt: "Finished school corridor at Dunnville Secondary School",
    source:
      "https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/project-images/new/gallery/1763560947836-5.jpg",
    projectPath: "/projects/dunnville-secondary-school",
    projectTitle: "Dunnville Secondary School",
    position: "50% 50%",
    mobilePosition: "50% 50%",
  },
};

const photosByImage = new Map<string, HeroPhoto>(
  [
    ...Object.values(cityPhotography),
    ...Object.values(portfolioPhotography),
    ...Object.values(generatedHeroScenes),
  ].map((photo) => [photo.image, photo]),
);

export function getHeroPhoto(image: string) {
  return photosByImage.get(image);
}
