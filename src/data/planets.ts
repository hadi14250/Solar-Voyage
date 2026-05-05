export type PlanetType = "rocky" | "gas-giant" | "ice-giant" | "star";

export interface PlanetFact {
  en: string;
  ar: string;
}

export interface PlanetInfo {
  id: string;
  name: string;
  nameAr: string;
  type: PlanetType;
  typeAr: string;
  /** Aesthetic radius (NOT to scale). */
  radius: number;
  /** Real-world relative size, used by "compare sizes" toggle. Earth = 1. */
  realRadiusRelative: number;
  /** Aesthetic distance from sun (scene units). */
  distance: number;
  /** Color used by procedural material. */
  color: string;
  /** Emissive accent color (subtle). */
  emissive?: string;
  /** Self-rotation speed (radians per second at speed=1). */
  rotationSpeed: number;
  /** Orbital angular speed (radians per second at speed=1). */
  orbitSpeed: number;
  /** Axial tilt in radians. */
  axialTilt: number;
  /** Initial orbital phase in radians (so planets aren't all aligned). */
  orbitPhase: number;
  /** Ring color if any. */
  ringColor?: string;
  /** Real-world facts. */
  distanceFromSun: { en: string; ar: string };
  diameter: { en: string; ar: string };
  dayLength: { en: string; ar: string };
  yearLength: { en: string; ar: string };
  facts: PlanetFact[];
}

export const SUN: PlanetInfo = {
  id: "sun",
  name: "The Sun",
  nameAr: "الشمس",
  type: "star",
  typeAr: "نجم",
  radius: 3.4,
  realRadiusRelative: 109,
  distance: 0,
  color: "#FDB813",
  emissive: "#FFB347",
  rotationSpeed: 0.05,
  orbitSpeed: 0,
  axialTilt: 0.12,
  orbitPhase: 0,
  distanceFromSun: { en: "0 km (center)", ar: "٠ كم (المركز)" },
  diameter: { en: "1,392,700 km", ar: "١٬٣٩٢٬٧٠٠ كم" },
  dayLength: { en: "~25 Earth days", ar: "~٢٥ يوم أرضي" },
  yearLength: { en: "—", ar: "—" },
  facts: [
    {
      en: "The Sun contains 99.86% of the mass of the entire solar system.",
      ar: "تحتوي الشمس على ٩٩٫٨٦٪ من كتلة المجموعة الشمسية بأكملها.",
    },
    {
      en: "Light from the Sun takes about 8 minutes 20 seconds to reach Earth.",
      ar: "يستغرق ضوء الشمس حوالي ٨ دقائق و٢٠ ثانية ليصل إلى الأرض.",
    },
  ],
};

export const PLANETS: PlanetInfo[] = [
  {
    id: "mercury",
    name: "Mercury",
    nameAr: "عطارد",
    type: "rocky",
    typeAr: "كوكب صخري",
    radius: 0.45,
    realRadiusRelative: 0.38,
    distance: 6,
    color: "#A8A29E",
    rotationSpeed: 0.18,
    orbitSpeed: 0.42,
    axialTilt: 0.0006,
    orbitPhase: 0.3,
    distanceFromSun: { en: "57.9 million km", ar: "٥٧٫٩ مليون كم" },
    diameter: { en: "4,879 km", ar: "٤٬٨٧٩ كم" },
    dayLength: { en: "59 Earth days", ar: "٥٩ يوم أرضي" },
    yearLength: { en: "88 Earth days", ar: "٨٨ يوم أرضي" },
    facts: [
      {
        en: "Mercury has no atmosphere, so its sky is always pitch black.",
        ar: "لا يملك عطارد غلافًا جويًا، لذا فإن سماءه سوداء دائمًا.",
      },
      {
        en: "A day on Mercury (sunrise to sunrise) lasts longer than its year.",
        ar: "اليوم على عطارد (من شروق إلى شروق) أطول من سنته.",
      },
    ],
  },
  {
    id: "venus",
    name: "Venus",
    nameAr: "الزهرة",
    type: "rocky",
    typeAr: "كوكب صخري",
    radius: 0.7,
    realRadiusRelative: 0.95,
    distance: 9,
    color: "#E8C547",
    emissive: "#3a2e10",
    rotationSpeed: -0.08,
    orbitSpeed: 0.32,
    axialTilt: 3.0962,
    orbitPhase: 1.1,
    distanceFromSun: { en: "108.2 million km", ar: "١٠٨٫٢ مليون كم" },
    diameter: { en: "12,104 km", ar: "١٢٬١٠٤ كم" },
    dayLength: { en: "243 Earth days", ar: "٢٤٣ يوم أرضي" },
    yearLength: { en: "225 Earth days", ar: "٢٢٥ يوم أرضي" },
    facts: [
      {
        en: "Venus rotates backward — the Sun rises in the west.",
        ar: "تدور الزهرة بشكل عكسي، فتشرق الشمس فيها من الغرب.",
      },
      {
        en: "It is the hottest planet, hotter than Mercury, due to its thick CO₂ atmosphere.",
        ar: "هي أسخن كوكب، حتى أكثر من عطارد، بسبب غلافها الجوي السميك من ثاني أكسيد الكربون.",
      },
    ],
  },
  {
    id: "earth",
    name: "Earth",
    nameAr: "الأرض",
    type: "rocky",
    typeAr: "كوكب صخري",
    radius: 0.75,
    realRadiusRelative: 1,
    distance: 13,
    color: "#1f6feb",
    rotationSpeed: 0.5,
    orbitSpeed: 0.26,
    axialTilt: 0.4101,
    orbitPhase: 2.4,
    distanceFromSun: { en: "149.6 million km", ar: "١٤٩٫٦ مليون كم" },
    diameter: { en: "12,742 km", ar: "١٢٬٧٤٢ كم" },
    dayLength: { en: "24 hours", ar: "٢٤ ساعة" },
    yearLength: { en: "365.25 days", ar: "٣٦٥٫٢٥ يومًا" },
    facts: [
      {
        en: "Earth is the only known world with liquid water on its surface.",
        ar: "الأرض هي العالم الوحيد المعروف بوجود مياه سائلة على سطحه.",
      },
      {
        en: "From space, the UAE's Empty Quarter desert is one of the most striking landmarks visible.",
        ar: "من الفضاء، تُعدّ صحراء الربع الخالي في الإمارات من أبرز المعالم الظاهرة.",
      },
    ],
  },
  {
    id: "mars",
    name: "Mars",
    nameAr: "المريخ",
    type: "rocky",
    typeAr: "كوكب صخري",
    radius: 0.55,
    realRadiusRelative: 0.53,
    distance: 17,
    color: "#c1440e",
    rotationSpeed: 0.48,
    orbitSpeed: 0.21,
    axialTilt: 0.4396,
    orbitPhase: 4.0,
    distanceFromSun: { en: "227.9 million km", ar: "٢٢٧٫٩ مليون كم" },
    diameter: { en: "6,779 km", ar: "٦٬٧٧٩ كم" },
    dayLength: { en: "24h 37m", ar: "٢٤ س ٣٧ د" },
    yearLength: { en: "687 Earth days", ar: "٦٨٧ يوم أرضي" },
    facts: [
      {
        en: "Home of Olympus Mons — the largest volcano in the solar system.",
        ar: "موطن أوليمبوس مونس، أكبر بركان في المجموعة الشمسية.",
      },
      {
        en: "The UAE Hope Probe (مسبار الأمل) reached Mars in February 2021 — the first Arab interplanetary mission.",
        ar: "وصل مسبار الأمل الإماراتي إلى المريخ في فبراير ٢٠٢١، وهو أول مهمة عربية بين الكواكب.",
      },
    ],
  },
  {
    id: "jupiter",
    name: "Jupiter",
    nameAr: "المشتري",
    type: "gas-giant",
    typeAr: "عملاق غازي",
    radius: 1.9,
    realRadiusRelative: 11.21,
    distance: 24,
    color: "#d6a064",
    rotationSpeed: 0.9,
    orbitSpeed: 0.11,
    axialTilt: 0.0546,
    orbitPhase: 0.7,
    distanceFromSun: { en: "778.5 million km", ar: "٧٧٨٫٥ مليون كم" },
    diameter: { en: "139,820 km", ar: "١٣٩٬٨٢٠ كم" },
    dayLength: { en: "9h 56m", ar: "٩ س ٥٦ د" },
    yearLength: { en: "11.86 Earth years", ar: "١١٫٨٦ سنة أرضية" },
    facts: [
      {
        en: "The Great Red Spot is a storm that has raged for at least 350 years.",
        ar: "البقعة الحمراء الكبرى عاصفة مستمرة منذ ٣٥٠ سنة على الأقل.",
      },
      {
        en: "Jupiter has 95 known moons, including the volcanic Io and icy Europa.",
        ar: "يملك المشتري ٩٥ قمرًا معروفًا، من بينها آيو البركاني وأوروبا الجليدي.",
      },
    ],
  },
  {
    id: "saturn",
    name: "Saturn",
    nameAr: "زحل",
    type: "gas-giant",
    typeAr: "عملاق غازي",
    radius: 1.6,
    realRadiusRelative: 9.45,
    distance: 31,
    color: "#e3c98f",
    ringColor: "#bfa066",
    rotationSpeed: 0.85,
    orbitSpeed: 0.085,
    axialTilt: 0.4665,
    orbitPhase: 3.3,
    distanceFromSun: { en: "1.43 billion km", ar: "١٫٤٣ مليار كم" },
    diameter: { en: "116,460 km", ar: "١١٦٬٤٦٠ كم" },
    dayLength: { en: "10h 42m", ar: "١٠ س ٤٢ د" },
    yearLength: { en: "29.46 Earth years", ar: "٢٩٫٤٦ سنة أرضية" },
    facts: [
      {
        en: "Saturn's rings are made mostly of water ice, ranging from dust grains to chunks the size of houses.",
        ar: "حلقات زحل مكوّنة بمعظمها من جليد الماء، تتراوح من ذرات غبار إلى كتل بحجم البيوت.",
      },
      {
        en: "It is the least dense planet — it would float in a giant tub of water.",
        ar: "هو أقل الكواكب كثافة، ويمكن أن يطفو نظريًا في حوض ماء عملاق.",
      },
    ],
  },
  {
    id: "uranus",
    name: "Uranus",
    nameAr: "أورانوس",
    type: "ice-giant",
    typeAr: "عملاق جليدي",
    radius: 1.15,
    realRadiusRelative: 4.01,
    distance: 38,
    color: "#7DD3FC",
    rotationSpeed: -0.6,
    orbitSpeed: 0.06,
    axialTilt: 1.7064,
    orbitPhase: 5.2,
    distanceFromSun: { en: "2.87 billion km", ar: "٢٫٨٧ مليار كم" },
    diameter: { en: "50,724 km", ar: "٥٠٬٧٢٤ كم" },
    dayLength: { en: "17h 14m", ar: "١٧ س ١٤ د" },
    yearLength: { en: "84 Earth years", ar: "٨٤ سنة أرضية" },
    facts: [
      {
        en: "Uranus rotates on its side — likely from a giant ancient impact.",
        ar: "يدور أورانوس على جانبه، غالبًا بسبب اصطدام عملاق قديم.",
      },
      {
        en: "Its blue-green color comes from methane in the upper atmosphere.",
        ar: "لونه الأزرق المخضر ناتج عن غاز الميثان في غلافه الجوي العلوي.",
      },
    ],
  },
  {
    id: "neptune",
    name: "Neptune",
    nameAr: "نبتون",
    type: "ice-giant",
    typeAr: "عملاق جليدي",
    radius: 1.1,
    realRadiusRelative: 3.88,
    distance: 45,
    color: "#3b6dff",
    rotationSpeed: 0.55,
    orbitSpeed: 0.048,
    axialTilt: 0.4943,
    orbitPhase: 1.9,
    distanceFromSun: { en: "4.50 billion km", ar: "٤٫٥٠ مليار كم" },
    diameter: { en: "49,244 km", ar: "٤٩٬٢٤٤ كم" },
    dayLength: { en: "16h 6m", ar: "١٦ س ٦ د" },
    yearLength: { en: "164.8 Earth years", ar: "١٦٤٫٨ سنة أرضية" },
    facts: [
      {
        en: "Neptune has the fastest winds in the solar system — over 2,000 km/h.",
        ar: "تهبّ على نبتون أسرع رياح في المجموعة الشمسية، بأكثر من ٢٠٠٠ كم/س.",
      },
      {
        en: "It was discovered by mathematics before being seen by a telescope.",
        ar: "اكتُشف نبتون رياضيًا قبل أن يُرصد بالتلسكوب.",
      },
    ],
  },
];

export const ALL_BODIES: PlanetInfo[] = [SUN, ...PLANETS];

export function getBodyById(id: string): PlanetInfo | undefined {
  return ALL_BODIES.find((b) => b.id === id);
}
