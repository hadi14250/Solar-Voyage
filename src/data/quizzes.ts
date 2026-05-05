/**
 * Bilingual quiz bank — 3 multiple-choice questions per planet, derived from
 * the same fact pool the panels show. Calibrated for Grade 4–8 readers.
 */

export interface QuizChoice {
  en: string;
  ar: string;
}

export interface QuizQuestion {
  question: { en: string; ar: string };
  choices: QuizChoice[];
  /** Index into `choices`. */
  answer: number;
  /** Short bilingual explanation shown after answering. */
  explain: { en: string; ar: string };
}

export const QUIZZES: Record<string, QuizQuestion[]> = {
  mercury: [
    {
      question: {
        en: "What color is Mercury's sky during the day?",
        ar: "ما لون سماء عطارد في النهار؟",
      },
      choices: [
        { en: "Blue, like Earth", ar: "أزرق، مثل الأرض" },
        { en: "Black — it has no atmosphere", ar: "أسود — لا يملك غلافًا جويًا" },
        { en: "Red and dusty", ar: "أحمر ومغبر" },
        { en: "Bright yellow", ar: "أصفر ساطع" },
      ],
      answer: 1,
      explain: {
        en: "Without air to scatter sunlight, the sky stays pitch black.",
        ar: "بدون هواء يبعثر ضوء الشمس، تبقى السماء سوداء تمامًا.",
      },
    },
    {
      question: {
        en: "On Mercury, which is longer?",
        ar: "أيهما أطول على عطارد؟",
      },
      choices: [
        { en: "Its day", ar: "يومه" },
        { en: "Its year", ar: "سنته" },
        { en: "They are equal", ar: "متساويان" },
        { en: "It depends on the season", ar: "يعتمد على الفصل" },
      ],
      answer: 0,
      explain: {
        en: "A Mercury day (sunrise to sunrise) lasts longer than its 88-day year.",
        ar: "يوم عطارد (من شروق إلى شروق) أطول من سنته البالغة ٨٨ يومًا.",
      },
    },
    {
      question: {
        en: "How far is Mercury from the Sun?",
        ar: "كم تبعد عطارد عن الشمس؟",
      },
      choices: [
        { en: "About 58 million km", ar: "حوالي ٥٨ مليون كم" },
        { en: "About 150 million km", ar: "حوالي ١٥٠ مليون كم" },
        { en: "About 1 billion km", ar: "حوالي مليار كم" },
        { en: "Less than 1 million km", ar: "أقل من مليون كم" },
      ],
      answer: 0,
      explain: {
        en: "Mercury is the closest planet — about 57.9 million km from the Sun.",
        ar: "عطارد أقرب الكواكب — على بعد ٥٧٫٩ مليون كم من الشمس.",
      },
    },
  ],

  venus: [
    {
      question: {
        en: "Why is Venus the hottest planet?",
        ar: "لماذا الزهرة أسخن كوكب؟",
      },
      choices: [
        { en: "It is closest to the Sun", ar: "لأنها الأقرب إلى الشمس" },
        {
          en: "Its thick CO₂ atmosphere traps heat",
          ar: "غلافها السميك من ثاني أكسيد الكربون يحبس الحرارة",
        },
        { en: "It has active volcanoes", ar: "لأنها تملك براكين نشطة" },
        { en: "It is made of fire", ar: "لأنها مصنوعة من النار" },
      ],
      answer: 1,
      explain: {
        en: "A runaway greenhouse effect keeps Venus hotter than Mercury.",
        ar: "تأثير الدفيئة الجامح يجعل الزهرة أسخن من عطارد.",
      },
    },
    {
      question: {
        en: "On Venus, the Sun rises in the…",
        ar: "على الزهرة، تشرق الشمس من…",
      },
      choices: [
        { en: "East", ar: "الشرق" },
        { en: "West", ar: "الغرب" },
        { en: "North", ar: "الشمال" },
        { en: "South", ar: "الجنوب" },
      ],
      answer: 1,
      explain: {
        en: "Venus rotates backward, so sunrise happens in the west.",
        ar: "تدور الزهرة عكسيًا، لذا تشرق الشمس من الغرب.",
      },
    },
    {
      question: {
        en: "Venus is roughly the same size as which planet?",
        ar: "الزهرة قريبة في الحجم من أي كوكب؟",
      },
      choices: [
        { en: "Mercury", ar: "عطارد" },
        { en: "Earth", ar: "الأرض" },
        { en: "Jupiter", ar: "المشتري" },
        { en: "Neptune", ar: "نبتون" },
      ],
      answer: 1,
      explain: {
        en: "Venus is sometimes called Earth's twin — about 95% of Earth's size.",
        ar: "تُلقّب الزهرة أحيانًا بتوأم الأرض — حوالي ٩٥٪ من حجم الأرض.",
      },
    },
  ],

  earth: [
    {
      question: {
        en: "What makes Earth unique in our solar system?",
        ar: "ما الذي يميز الأرض في مجموعتنا الشمسية؟",
      },
      choices: [
        { en: "It has rings", ar: "لديها حلقات" },
        {
          en: "Liquid water on its surface",
          ar: "وجود مياه سائلة على سطحها",
        },
        { en: "It is the largest planet", ar: "هي أكبر كوكب" },
        { en: "It has no moon", ar: "ليس لها قمر" },
      ],
      answer: 1,
      explain: {
        en: "Earth is the only known world with liquid water on its surface.",
        ar: "الأرض هي العالم الوحيد المعروف بوجود مياه سائلة على سطحه.",
      },
    },
    {
      question: {
        en: "Which UAE landmark is one of the most striking deserts visible from space?",
        ar: "أي معلم إماراتي يُعدّ من أبرز الصحاري الظاهرة من الفضاء؟",
      },
      choices: [
        { en: "Hajar Mountains", ar: "جبال الحجر" },
        { en: "The Empty Quarter (Rub' al Khali)", ar: "الربع الخالي" },
        { en: "Liwa Oasis", ar: "واحة ليوا" },
        { en: "Jebel Jais", ar: "جبل جيس" },
      ],
      answer: 1,
      explain: {
        en: "The Empty Quarter — Rub' al Khali — is one of the largest sand deserts on Earth.",
        ar: "الربع الخالي من أكبر الصحاري الرملية على وجه الأرض.",
      },
    },
    {
      question: {
        en: "How long does Earth take to spin once on its axis?",
        ar: "كم تستغرق الأرض لتدور دورة كاملة حول محورها؟",
      },
      choices: [
        { en: "1 hour", ar: "ساعة واحدة" },
        { en: "24 hours", ar: "٢٤ ساعة" },
        { en: "365 days", ar: "٣٦٥ يومًا" },
        { en: "1 minute", ar: "دقيقة واحدة" },
      ],
      answer: 1,
      explain: {
        en: "One full rotation takes about 24 hours — that's a day.",
        ar: "تستغرق دورة كاملة حوالي ٢٤ ساعة — وهذا هو اليوم.",
      },
    },
  ],

  mars: [
    {
      question: {
        en: "When did the UAE Hope Probe reach Mars?",
        ar: "متى وصل مسبار الأمل الإماراتي إلى المريخ؟",
      },
      choices: [
        { en: "February 2021", ar: "فبراير ٢٠٢١" },
        { en: "July 2018", ar: "يوليو ٢٠١٨" },
        { en: "January 2025", ar: "يناير ٢٠٢٥" },
        { en: "October 2015", ar: "أكتوبر ٢٠١٥" },
      ],
      answer: 0,
      explain: {
        en: "Hope arrived at Mars on 9 February 2021 — the first Arab interplanetary mission.",
        ar: "وصل مسبار الأمل إلى المريخ في ٩ فبراير ٢٠٢١ — أول مهمة عربية بين الكواكب.",
      },
    },
    {
      question: {
        en: "What is Olympus Mons?",
        ar: "ما هو أوليمبوس مونس؟",
      },
      choices: [
        { en: "A Martian moon", ar: "قمر للمريخ" },
        {
          en: "The largest volcano in the solar system",
          ar: "أكبر بركان في المجموعة الشمسية",
        },
        { en: "A deep canyon on Mars", ar: "وادٍ عميق على المريخ" },
        { en: "A Mars rover", ar: "مركبة جوّالة على المريخ" },
      ],
      answer: 1,
      explain: {
        en: "Olympus Mons towers ~22 km — about 2.5× the height of Mount Everest.",
        ar: "يرتفع أوليمبوس مونس نحو ٢٢ كم — حوالي ٢٫٥ ضعف ارتفاع جبل إيفرست.",
      },
    },
    {
      question: {
        en: "Why is Mars called the Red Planet?",
        ar: "لماذا يُسمى المريخ بالكوكب الأحمر؟",
      },
      choices: [
        { en: "It glows hot", ar: "لأنه يتوهج بالحرارة" },
        {
          en: "Iron oxide (rust) covers its surface",
          ar: "أكسيد الحديد (الصدأ) يغطي سطحه",
        },
        { en: "It is closest to the Sun", ar: "لأنه الأقرب إلى الشمس" },
        { en: "Its sky is red", ar: "سماؤه حمراء" },
      ],
      answer: 1,
      explain: {
        en: "The rusty iron-rich dust on the surface gives Mars its red color.",
        ar: "الغبار الغني بالحديد الصدئ على السطح يمنح المريخ لونه الأحمر.",
      },
    },
  ],

  jupiter: [
    {
      question: {
        en: "What is the Great Red Spot?",
        ar: "ما هي البقعة الحمراء الكبرى؟",
      },
      choices: [
        { en: "A volcano", ar: "بركان" },
        { en: "A storm raging for centuries", ar: "عاصفة مستمرة منذ قرون" },
        { en: "A moon's shadow", ar: "ظل قمر" },
        { en: "A landing site", ar: "موقع هبوط" },
      ],
      answer: 1,
      explain: {
        en: "It is a giant storm that has been observed for at least 350 years.",
        ar: "عاصفة عملاقة رُصدت منذ ٣٥٠ سنة على الأقل.",
      },
    },
    {
      question: {
        en: "About how many known moons does Jupiter have?",
        ar: "كم عدد أقمار المشتري المعروفة تقريبًا؟",
      },
      choices: [
        { en: "1", ar: "١" },
        { en: "12", ar: "١٢" },
        { en: "95", ar: "٩٥" },
        { en: "More than 1000", ar: "أكثر من ١٠٠٠" },
      ],
      answer: 2,
      explain: {
        en: "Jupiter has 95 known moons including Io, Europa, Ganymede, and Callisto.",
        ar: "للمشتري ٩٥ قمرًا معروفًا منها آيو وأوروبا وغانيميد وكاليستو.",
      },
    },
    {
      question: {
        en: "What kind of planet is Jupiter?",
        ar: "ما نوع كوكب المشتري؟",
      },
      choices: [
        { en: "Rocky", ar: "صخري" },
        { en: "Ice giant", ar: "عملاق جليدي" },
        { en: "Gas giant", ar: "عملاق غازي" },
        { en: "Dwarf planet", ar: "كوكب قزم" },
      ],
      answer: 2,
      explain: {
        en: "Jupiter is a gas giant — mostly hydrogen and helium.",
        ar: "المشتري عملاق غازي — معظمه هيدروجين وهيليوم.",
      },
    },
  ],

  saturn: [
    {
      question: {
        en: "Saturn's rings are mostly made of…",
        ar: "تتكوّن حلقات زحل غالبًا من…",
      },
      choices: [
        { en: "Solid metal", ar: "معدن صلب" },
        { en: "Water ice and rocks", ar: "جليد الماء والصخور" },
        { en: "Hot gas", ar: "غاز ساخن" },
        { en: "Sand", ar: "رمل" },
      ],
      answer: 1,
      explain: {
        en: "Mostly water ice — from dust grains up to chunks the size of houses.",
        ar: "بمعظمها جليد الماء — من ذرات غبار إلى كتل بحجم البيوت.",
      },
    },
    {
      question: {
        en: "If you put Saturn in a giant bath of water, it would…",
        ar: "إذا وضعت زحل في حوض ماء عملاق، فإنه سـ…",
      },
      choices: [
        { en: "Sink instantly", ar: "يغرق فورًا" },
        { en: "Float — it is less dense than water", ar: "يطفو — كثافته أقل من الماء" },
        { en: "Dissolve", ar: "يذوب" },
        { en: "Boil the water", ar: "يغلي الماء" },
      ],
      answer: 1,
      explain: {
        en: "Saturn is the least dense planet — it would float (in theory!).",
        ar: "زحل أقل الكواكب كثافة — سيطفو نظريًا.",
      },
    },
    {
      question: {
        en: "Roughly how long is one year on Saturn?",
        ar: "كم تقريبًا طول السنة على زحل؟",
      },
      choices: [
        { en: "1 Earth year", ar: "سنة أرضية واحدة" },
        { en: "About 12 Earth years", ar: "حوالي ١٢ سنة أرضية" },
        { en: "About 29 Earth years", ar: "حوالي ٢٩ سنة أرضية" },
        { en: "100 Earth years", ar: "١٠٠ سنة أرضية" },
      ],
      answer: 2,
      explain: {
        en: "Saturn takes about 29.5 Earth years to orbit the Sun once.",
        ar: "يستغرق زحل حوالي ٢٩٫٥ سنة أرضية ليكمل دورة حول الشمس.",
      },
    },
  ],

  uranus: [
    {
      question: {
        en: "What is unusual about how Uranus rotates?",
        ar: "ما الغريب في طريقة دوران أورانوس؟",
      },
      choices: [
        { en: "It does not rotate", ar: "لا يدور" },
        { en: "It rotates on its side", ar: "يدور على جانبه" },
        { en: "It rotates twice per second", ar: "يدور مرتين في الثانية" },
        { en: "It rotates only at night", ar: "يدور ليلًا فقط" },
      ],
      answer: 1,
      explain: {
        en: "Uranus is tipped over ~98° — likely from a giant ancient impact.",
        ar: "يميل أورانوس بزاوية ٩٨° تقريبًا — على الأرجح بسبب اصطدام قديم عملاق.",
      },
    },
    {
      question: {
        en: "What gives Uranus its blue-green color?",
        ar: "ما الذي يمنح أورانوس لونه الأزرق المخضر؟",
      },
      choices: [
        { en: "Oceans of water", ar: "محيطات من الماء" },
        { en: "Methane in its atmosphere", ar: "غاز الميثان في غلافه الجوي" },
        { en: "Ice on its surface", ar: "الجليد على سطحه" },
        { en: "Reflected starlight", ar: "ضوء النجوم المنعكس" },
      ],
      answer: 1,
      explain: {
        en: "Methane absorbs red light and reflects blue-green back to us.",
        ar: "يمتص الميثان الضوء الأحمر ويعكس الأزرق المخضر إلينا.",
      },
    },
    {
      question: {
        en: "What type of planet is Uranus?",
        ar: "ما نوع كوكب أورانوس؟",
      },
      choices: [
        { en: "Rocky", ar: "صخري" },
        { en: "Ice giant", ar: "عملاق جليدي" },
        { en: "Star", ar: "نجم" },
        { en: "Dwarf planet", ar: "كوكب قزم" },
      ],
      answer: 1,
      explain: {
        en: "Uranus is an ice giant — water, methane, and ammonia ices around a small core.",
        ar: "أورانوس عملاق جليدي — جليد الماء والميثان والأمونيا حول لب صغير.",
      },
    },
  ],

  neptune: [
    {
      question: {
        en: "Neptune has the solar system's…",
        ar: "في نبتون توجد…",
      },
      choices: [
        { en: "Tallest mountains", ar: "أعلى الجبال" },
        { en: "Fastest winds", ar: "أسرع الرياح" },
        { en: "Hottest surface", ar: "أسخن سطح" },
        { en: "Brightest rings", ar: "ألمع الحلقات" },
      ],
      answer: 1,
      explain: {
        en: "Neptune's winds top 2,000 km/h — the fastest in the solar system.",
        ar: "تتجاوز رياح نبتون ٢٠٠٠ كم/س — الأسرع في المجموعة الشمسية.",
      },
    },
    {
      question: {
        en: "How was Neptune first discovered?",
        ar: "كيف اكتُشف نبتون أول مرة؟",
      },
      choices: [
        { en: "By a space probe", ar: "بواسطة مسبار فضائي" },
        { en: "By a child with binoculars", ar: "من قبل طفل بمنظار" },
        { en: "By mathematics, before being seen", ar: "رياضيًا، قبل رؤيته" },
        { en: "By accident on a photograph", ar: "بالصدفة في صورة" },
      ],
      answer: 2,
      explain: {
        en: "Astronomers predicted its position from math before any telescope spotted it.",
        ar: "تنبأ الفلكيون بموقعه بالرياضيات قبل أن يرصده أي تلسكوب.",
      },
    },
    {
      question: {
        en: "How long is one year on Neptune?",
        ar: "كم طول السنة على نبتون؟",
      },
      choices: [
        { en: "1 Earth year", ar: "سنة أرضية واحدة" },
        { en: "About 30 Earth years", ar: "حوالي ٣٠ سنة أرضية" },
        { en: "About 165 Earth years", ar: "حوالي ١٦٥ سنة أرضية" },
        { en: "About 1000 Earth years", ar: "حوالي ١٠٠٠ سنة أرضية" },
      ],
      answer: 2,
      explain: {
        en: "Neptune takes about 165 Earth years to orbit the Sun once.",
        ar: "يستغرق نبتون حوالي ١٦٥ سنة أرضية ليكمل دورة حول الشمس.",
      },
    },
  ],
};

export function getQuiz(planetId: string): QuizQuestion[] | undefined {
  return QUIZZES[planetId];
}
