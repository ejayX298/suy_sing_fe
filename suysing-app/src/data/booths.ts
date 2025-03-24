import { Booth } from "@/context/BoothsContext";

// Simple booth interface for BoothZone component
export interface BoothZoneItem {
  name: string;
  logo: string;
  visited: boolean;
}

export const regularZoneBooths: BoothZoneItem[] = [
  { name: "Alaska Corporation", logo: "alaska", visited: false },
  { name: "Champion", logo: "champion", visited: false },
  { name: "Del Monte", logo: "delmonte", visited: false },
  { name: "Pepsi", logo: "pepsi", visited: false },
  { name: "NutriAsia", logo: "nutriasia", visited: false },
];

export const x2ZoneBooths: BoothZoneItem[] = [
  { name: "Alaska Corporation", logo: "alaska", visited: false },
  { name: "Champion", logo: "champion", visited: false },
  { name: "Del Monte", logo: "delmonte", visited: false },
  { name: "Pepsi", logo: "pepsi", visited: false },
  { name: "NutriAsia", logo: "nutriasia", visited: false },
];

export const visitedBooths: BoothZoneItem[] = [
  { name: "Alaska Corporation", logo: "alaska", visited: true },
  { name: "Champion", logo: "champion", visited: true },
  { name: "Del Monte", logo: "delmonte", visited: true },
  { name: "Pepsi", logo: "pepsi", visited: true },
  { name: "NutriAsia", logo: "nutriasia", visited: true },
];

export const getInitialBooths = (): Booth[] => {
  return [
    // Double Zone row 1-4 (spanning 4 rows)
    {
      id: "double-zone",
      name: "Double Zone",
      image: "/images/info-icon.png",
      isDoubleZone: true,
      visited: false,
      width: 100,
      height: 100,
    },
    // Double Zone booths
    {
      id: "double-zone-1",
      name: "Double Zone Brand 1",
      image: "/images/hapee.png",
      isDoubleZone: true,
      doubleZonePosition: 0,
      visited: false,
      width: 200,
      height: 200,
    },
    {
      id: "double-zone-2",
      name: "Double Zone Brand 2",
      image: "/images/pringles.png",
      isDoubleZone: true,
      doubleZonePosition: 1,
      visited: false,
      width: 150,
      height: 150,
    },
    {
      id: "double-zone-3",
      name: "Double Zone Brand 3",
      image: "/images/mega.png",
      isDoubleZone: true,
      doubleZonePosition: 2,
      visited: false,
      width: 120,
      height: 120,
    },
    {
      id: "double-zone-4",
      name: "Double Zone Brand 4",
      image: "/images/pepsi.png",
      isDoubleZone: true,
      doubleZonePosition: 3,
      visited: false,
      width: 180,
      height: 180,
    },

    // Main booth grid
    {
      id: "spam",
      name: "SPAM",
      image: "/images/spam.png",
      visited: false,
      width: 100,
      height: 100,
    },
    {
      id: "pepsi",
      name: "Pepsi",
      image: "/images/pepsi.png",
      visited: false,
      width: 100,
      height: 100,
    },
    {
      id: "universal-robina",
      name: "Universal Robina",
      image: "/images/universal-robina.png",
      visited: false,
      width: 100,
      height: 100,
    },
    {
      id: "rebisco",
      name: "Rebisco",
      image: "/images/rebisco.png",
      visited: false,
      width: 50,
      height: 50,
    },

    // Row 3
    {
      id: "nutriasia",
      name: "NutriAsia",
      image: "/images/nutriasia.png",
      visited: false,
      width: 80,
      height: 80,
    },
    {
      id: "silver-swan",
      name: "SILVER SWAN",
      image: "/images/silver-swan.png",
      visited: false,
      width: 80,
      height: 80,
    },

    // Row 4
    {
      id: "maling",
      name: "Ma Ling",
      image: "/images/maling.jpg",
      visited: false,
      width: 150,
      height: 150,
    },
    {
      id: "cdo",
      name: "CDO",
      image: "/images/cdo.png",
      visited: false,
      width: 120,
      height: 120,
    },
    {
      id: "ginebra",
      name: "GINEBRA SAN MIGUEL",
      image: "/images/ginebra.png",
      visited: false,
      width: 90,
      height: 90,
    },
    {
      id: "pringles",
      name: "PRINGLES",
      image: "/images/pringles.png",
      visited: false,
      width: 70,
      height: 70,
    },

    // Row 5
    {
      id: "bench",
      name: "BENCH/",
      image: "/images/bench.png",
      visited: false,
      width: 140,
      height: 140,
    },
    {
      id: "vitakeratin",
      name: "VITAKERATIN",
      image: "/images/vitakeratin.png",
      visited: false,
      width: 110,
      height: 110,
    },
    {
      id: "hapee",
      name: "hapee",
      image: "/images/hapee.png",
      visited: false,
      width: 90,
      height: 90,
    },
    {
      id: "mega",
      name: "MEGA SARDINES",
      image: "/images/mega-sardines.png",
      visited: false,
      width: 100,
      height: 100,
    },

    // Row 6
    {
      id: "perla",
      name: "Perla",
      image: "/images/perla.png",
      visited: false,
      width: 200,
      height: 200,
    },
    {
      id: "natures-spring",
      name: "NATURE'S SPRING",
      image: "/images/natures-spring.png",
      visited: false,
      width: 150,
      height: 150,
    },
    {
      id: "baygon",
      name: "Baygon",
      image: "/images/baygon.png",
      visited: false,
      width: 90,
      height: 90,
    },
    {
      id: "mrgulaman",
      name: "MR. GULAMAN",
      image: "/images/mrgulaman.png",
      visited: false,
      width: 100,
      height: 100,
    },

    // Row 7
    {
      id: "emperador",
      name: "EMPERADOR",
      image: "/images/emperador.png",
      visited: false,
      width: 160,
      height: 160,
    },
    {
      id: "rc",
      name: "RC",
      image: "/images/rc.png",
      visited: false,
      width: 140,
      height: 140,
    },
    {
      id: "nestle",
      name: "Nestlé",
      image: "/images/nescafe.png",
      visited: false,
      width: 110,
      height: 110,
    },
    {
      id: "monde-nissin",
      name: "Monde Nissin",
      image: "/images/monde-nissin1.png",
      visited: false,
      width: 130,
      height: 130,
    },

    // Row 8
    {
      id: "colgate",
      name: "Colgate",
      image: "/images/colgate.png",
      visited: false,
      width: 100,
      height: 100,
    },
    {
      id: "selecta",
      name: "SELECTA",
      image: "/images/selecta.png",
      visited: false,
      width: 200,
      height: 200,
    },
  ];
};

// Helper function to get all booth items (for the booth list page)
export const getAllBooths = (): BoothZoneItem[] => {
  return [...regularZoneBooths, ...x2ZoneBooths, ...visitedBooths];
};
