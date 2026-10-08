export type Campaign = {
  id: string;
  title: string;
  category: string;
  location: string;
  organizer: string;
  organizerRole: string;
  raised: number;
  goal: number;
  donors: number;
  daysLeft: number;
  image: string;
  imageAlt: string;
  accent: "sun" | "lavender" | "mint" | "sky";
  summary: string;
};

export const campaigns: Campaign[] = [
  {
    id: "after-school-library",
    title: "A safe place to learn after school",
    category: "Education",
    location: "Hpa-an, Kayin",
    organizer: "Thiri Min",
    organizerRole: "Kayin Youth Network",
    raised: 4820000,
    goal: 7000000,
    donors: 128,
    daysLeft: 12,
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Students reading together in a bright classroom",
    accent: "sun",
    summary:
      "Help us turn an unused community room into a warm, well-stocked learning space for 60 children.",
  },
  {
    id: "village-water",
    title: "Clean water for 11 village homes",
    category: "Essential needs",
    location: "Myeik, Tanintharyi",
    organizer: "Myo Zaw",
    organizerRole: "Myeik Community Circle",
    raised: 9650000,
    goal: 12000000,
    donors: 204,
    daysLeft: 8,
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Clear water flowing from a tap into a blue container",
    accent: "sky",
    summary:
      "A gravity-fed water line will make clean, reliable water accessible all year round.",
  },
  {
    id: "market-stall",
    title: "Restart a family market stall",
    category: "Livelihoods",
    location: "Mawlamyine, Mon",
    organizer: "Ei Ei Hlaing",
    organizerRole: "Neighbourhood Support Group",
    raised: 3180000,
    goal: 5000000,
    donors: 76,
    daysLeft: 21,
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "A small local market counter with fresh produce",
    accent: "mint",
    summary:
      "A small grant for stock and a new awning will help this family reopen their market stall.",
  },
  {
    id: "mobile-clinic",
    title: "A mobile clinic for remote villages",
    category: "Health",
    location: "Kyaukphyu, Rakhine",
    organizer: "Dr. Nwe Nwe",
    organizerRole: "Open Hands Medical Team",
    raised: 14700000,
    goal: 20000000,
    donors: 312,
    daysLeft: 34,
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "A community health worker speaking with a patient",
    accent: "lavender",
    summary:
      "Help us keep a mobile team on the road with medicine, fuel, and basic diagnostic equipment.",
  },
];

export const categories = ["All causes", "Education", "Health", "Essential needs", "Livelihoods"];

export const featuredCampaign = campaigns[0];
