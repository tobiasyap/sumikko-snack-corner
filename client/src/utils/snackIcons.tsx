import React from "react";

// Pastel color palette
const COLORS = {
  pink: "#FFB7C5",
  peach: "#FFD4B8",
  cream: "#FFF5DC",
  mint: "#B8E8D0",
  lavender: "#D4C8E8",
  sky: "#B8D8F0",
  yellow: "#FFF0B3",
  coral: "#FFB8A8",
};

const OUTLINE = "#8B7D6B";
const EYE_COLOR = "#5D4E60";

// ── Category keyword map ──────────────────────────────────────────────
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  chips: ["chip", "crisp", "potato", "doritos", "lays", "pringles", "cheetos"],
  chocolate: ["chocolate", "choco", "cocoa", "kitkat", "snickers", "twix", "ferrero"],
  cookie: ["cookie", "biscuit", "oreo", "cracker", "shortbread"],
  candy: ["candy", "gummy", "haribo", "skittles", "sweet", "lollipop", "jellybean"],
  fruit: ["apple", "banana", "strawberry", "grape", "orange", "mango", "fruit", "berry"],
  drink: ["juice", "soda", "cola", "tea", "coffee", "milk", "water", "drink", "beverage"],
  bread: ["bread", "bun", "croissant", "pastry", "muffin", "cake", "donut", "bagel"],
  rice: ["rice", "onigiri", "sushi", "mochi", "dango"],
  icecream: ["ice cream", "icecream", "gelato", "popsicle", "frozen yogurt"],
  noodle: ["noodle", "ramen", "pasta", "cup noodle", "instant", "udon"],
  nuts: ["nut", "almond", "cashew", "peanut", "pistachio", "walnut", "trail mix"],
  cheese: ["cheese", "cheddar", "brie", "gouda"],
  popcorn: ["popcorn", "corn", "kernel"],
  jerky: ["jerky", "beef", "dried", "meat stick", "slim jim"],
};

// ── Category-to-color mapping ─────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  chips: COLORS.yellow,
  chocolate: COLORS.peach,
  cookie: COLORS.cream,
  candy: COLORS.pink,
  fruit: COLORS.coral,
  drink: COLORS.sky,
  bread: COLORS.cream,
  rice: COLORS.mint,
  icecream: COLORS.lavender,
  noodle: COLORS.yellow,
  nuts: COLORS.peach,
  cheese: COLORS.yellow,
  popcorn: COLORS.cream,
  jerky: COLORS.coral,
  generic: COLORS.lavender,
};

// ── Resolve category from snack name ──────────────────────────────────
function resolveCategory(snackName: string): string {
  const lower = snackName.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return category;
      }
    }
  }
  return "generic";
}

// ── SVG icon builders (one per category) ──────────────────────────────

function ChipsIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Bag body */}
      <path
        d="M18 18 L14 52 Q14 56 18 56 L46 56 Q50 56 50 52 L46 18 Z"
        fill={COLORS.yellow}
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Zigzag top */}
      <polyline
        points="18,18 22,12 26,18 30,12 34,18 38,12 42,18 46,12 46,18"
        fill={COLORS.yellow}
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Eyes */}
      <circle cx="27" cy="36" r="2" fill={EYE_COLOR} />
      <circle cx="37" cy="36" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M30 41 Q32 44 34 41" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      {/* Chip details - little diagonal lines */}
      <line x1="22" y1="46" x2="26" y2="48" stroke={OUTLINE} strokeWidth="1" opacity="0.4" />
      <line x1="36" y1="48" x2="40" y2="46" stroke={OUTLINE} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function ChocolateIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Chocolate bar body */}
      <rect
        x="12" y="18" width="40" height="28" rx="6" ry="6"
        fill={COLORS.peach}
        stroke={OUTLINE}
        strokeWidth="2"
      />
      {/* Grid lines for chocolate segments */}
      <line x1="24" y1="18" x2="24" y2="46" stroke={OUTLINE} strokeWidth="1" opacity="0.35" />
      <line x1="36" y1="18" x2="36" y2="46" stroke={OUTLINE} strokeWidth="1" opacity="0.35" />
      <line x1="12" y1="32" x2="52" y2="32" stroke={OUTLINE} strokeWidth="1" opacity="0.35" />
      {/* Wrapper peeking out */}
      <rect x="10" y="40" width="44" height="10" rx="3" fill={COLORS.coral} stroke={OUTLINE} strokeWidth="1.5" opacity="0.5" />
      {/* Eyes */}
      <circle cx="26" cy="27" r="2" fill={EYE_COLOR} />
      <circle cx="36" cy="27" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M29 37 Q32 40 35 37" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CookieIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Cookie body */}
      <circle cx="32" cy="32" r="20" fill={COLORS.cream} stroke={OUTLINE} strokeWidth="2" />
      {/* Chocolate chip dots */}
      <circle cx="22" cy="24" r="2.5" fill={OUTLINE} opacity="0.5" />
      <circle cx="38" cy="22" r="2" fill={OUTLINE} opacity="0.5" />
      <circle cx="24" cy="40" r="2" fill={OUTLINE} opacity="0.5" />
      <circle cx="40" cy="38" r="2.5" fill={OUTLINE} opacity="0.5" />
      <circle cx="34" cy="44" r="1.5" fill={OUTLINE} opacity="0.5" />
      {/* Eyes */}
      <circle cx="27" cy="30" r="2" fill={EYE_COLOR} />
      <circle cx="37" cy="30" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M30 36 Q32 39 34 36" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CandyIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Candy body */}
      <ellipse cx="32" cy="32" rx="14" ry="12" fill={COLORS.pink} stroke={OUTLINE} strokeWidth="2" />
      {/* Left wrapper twist */}
      <path
        d="M18 32 Q12 26 8 28 Q12 32 8 36 Q12 38 18 32"
        fill={COLORS.pink}
        stroke={OUTLINE}
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* Right wrapper twist */}
      <path
        d="M46 32 Q52 26 56 28 Q52 32 56 36 Q52 38 46 32"
        fill={COLORS.pink}
        stroke={OUTLINE}
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* Stripe on candy */}
      <path d="M28 21 Q26 32 28 43" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
      <path d="M36 21 Q38 32 36 43" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
      {/* Eyes */}
      <circle cx="28" cy="30" r="2" fill={EYE_COLOR} />
      <circle cx="36" cy="30" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M30 36 Q32 38 34 36" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FruitIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Apple body */}
      <ellipse cx="32" cy="36" rx="16" ry="17" fill={COLORS.coral} stroke={OUTLINE} strokeWidth="2" />
      {/* Apple indent */}
      <path d="M28 20 Q32 24 36 20" fill="none" stroke={OUTLINE} strokeWidth="1.5" />
      {/* Stem */}
      <line x1="32" y1="20" x2="32" y2="13" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
      {/* Leaf */}
      <ellipse cx="37" cy="14" rx="5" ry="3" fill={COLORS.mint} stroke={OUTLINE} strokeWidth="1" transform="rotate(20 37 14)" />
      {/* Eyes */}
      <circle cx="26" cy="34" r="2" fill={EYE_COLOR} />
      <circle cx="36" cy="34" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M29 40 Q32 43 35 40" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="22" cy="38" rx="3" ry="2" fill={COLORS.pink} opacity="0.4" />
      <ellipse cx="40" cy="38" rx="3" ry="2" fill={COLORS.pink} opacity="0.4" />
    </svg>
  );
}

function DrinkIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Cup body */}
      <path
        d="M18 16 L20 52 Q20 56 24 56 L40 56 Q44 56 44 52 L46 16 Z"
        fill={COLORS.sky}
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Lid */}
      <rect x="16" y="12" width="32" height="6" rx="3" fill={OUTLINE} opacity="0.3" stroke={OUTLINE} strokeWidth="1.5" />
      {/* Straw */}
      <line x1="36" y1="4" x2="34" y2="16" stroke={COLORS.coral} strokeWidth="3" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="27" cy="32" r="2" fill={EYE_COLOR} />
      <circle cx="37" cy="32" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M30 38 Q32 41 34 38" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      {/* Condensation drops */}
      <ellipse cx="20" cy="28" rx="1.5" ry="2" fill="#fff" opacity="0.5" />
      <ellipse cx="44" cy="36" rx="1.5" ry="2" fill="#fff" opacity="0.5" />
    </svg>
  );
}

function BreadIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Bread loaf body */}
      <ellipse cx="32" cy="40" rx="20" ry="14" fill={COLORS.cream} stroke={OUTLINE} strokeWidth="2" />
      {/* Puffy top */}
      <ellipse cx="24" cy="28" rx="10" ry="10" fill={COLORS.cream} stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx="40" cy="28" rx="10" ry="10" fill={COLORS.cream} stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx="32" cy="26" rx="8" ry="9" fill={COLORS.cream} stroke={OUTLINE} strokeWidth="2" />
      {/* Cover the connecting lines */}
      <ellipse cx="32" cy="34" rx="18" ry="10" fill={COLORS.cream} />
      {/* Eyes */}
      <circle cx="27" cy="36" r="2" fill={EYE_COLOR} />
      <circle cx="37" cy="36" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M30 42 Q32 44 34 42" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="22" cy="40" rx="3" ry="2" fill={COLORS.pink} opacity="0.35" />
      <ellipse cx="42" cy="40" rx="3" ry="2" fill={COLORS.pink} opacity="0.35" />
    </svg>
  );
}

function RiceIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Onigiri body (triangle with rounded corners) */}
      <path
        d="M32 10 Q34 10 46 36 Q48 42 46 46 Q44 52 32 52 Q20 52 18 46 Q16 42 18 36 Q30 10 32 10 Z"
        fill="#fff"
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Nori seaweed strip */}
      <rect x="22" y="38" width="20" height="14" rx="3" fill="#5B6B5A" stroke={OUTLINE} strokeWidth="1" />
      {/* Eyes */}
      <circle cx="27" cy="30" r="2" fill={EYE_COLOR} />
      <circle cx="37" cy="30" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M30 35 Q32 37 34 35" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="23" cy="33" rx="3" ry="2" fill={COLORS.pink} opacity="0.4" />
      <ellipse cx="41" cy="33" rx="3" ry="2" fill={COLORS.pink} opacity="0.4" />
    </svg>
  );
}

function IceCreamIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Cone */}
      <polygon
        points="22,36 42,36 32,58"
        fill={COLORS.cream}
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Cone cross-hatching */}
      <line x1="24" y1="38" x2="34" y2="54" stroke={OUTLINE} strokeWidth="0.8" opacity="0.3" />
      <line x1="40" y1="38" x2="30" y2="54" stroke={OUTLINE} strokeWidth="0.8" opacity="0.3" />
      {/* Ice cream scoop */}
      <circle cx="32" cy="26" r="14" fill={COLORS.lavender} stroke={OUTLINE} strokeWidth="2" />
      {/* Eyes */}
      <circle cx="27" cy="24" r="2" fill={EYE_COLOR} />
      <circle cx="37" cy="24" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M30 30 Q32 33 34 30" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      {/* Drip */}
      <path d="M24 36 Q23 42 25 40" fill={COLORS.lavender} stroke={OUTLINE} strokeWidth="1" />
    </svg>
  );
}

function NoodleIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Cup body */}
      <path
        d="M16 24 L18 52 Q18 56 22 56 L42 56 Q46 56 46 52 L48 24 Z"
        fill={COLORS.yellow}
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Cup rim */}
      <ellipse cx="32" cy="24" rx="16" ry="4" fill={COLORS.cream} stroke={OUTLINE} strokeWidth="2" />
      {/* Noodle squiggles poking out */}
      <path d="M24 22 Q26 14 28 18 Q30 22 32 16" fill="none" stroke={COLORS.cream} strokeWidth="2" strokeLinecap="round" />
      <path d="M34 20 Q36 12 38 17 Q40 22 42 15" fill="none" stroke={COLORS.cream} strokeWidth="2" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="27" cy="36" r="2" fill={EYE_COLOR} />
      <circle cx="37" cy="36" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M30 42 Q32 44 34 42" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      {/* Steam */}
      <path d="M26 12 Q28 8 26 4" fill="none" stroke={OUTLINE} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <path d="M38 10 Q40 6 38 2" fill="none" stroke={OUTLINE} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

function NutsIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Main peanut shape (figure-eight) */}
      <ellipse cx="26" cy="30" rx="10" ry="13" fill={COLORS.peach} stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx="38" cy="34" rx="10" ry="13" fill={COLORS.peach} stroke={OUTLINE} strokeWidth="2" />
      {/* Pinch in the middle */}
      <path d="M30 22 Q32 30 30 42" fill="none" stroke={OUTLINE} strokeWidth="1.5" opacity="0.4" />
      {/* Texture lines */}
      <path d="M20 26 Q22 28 20 30" fill="none" stroke={OUTLINE} strokeWidth="0.8" opacity="0.3" />
      <path d="M42 30 Q44 32 42 34" fill="none" stroke={OUTLINE} strokeWidth="0.8" opacity="0.3" />
      {/* Eyes */}
      <circle cx="28" cy="30" r="2" fill={EYE_COLOR} />
      <circle cx="38" cy="32" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M31 36 Q33 38 35 36" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheeseIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Cheese wedge */}
      <polygon
        points="10,48 54,48 54,28"
        fill={COLORS.yellow}
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Side face of wedge */}
      <polygon
        points="10,48 10,52 54,52 54,48"
        fill="#E8D880"
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Cheese holes */}
      <ellipse cx="30" cy="42" rx="4" ry="3" fill="#E8D880" stroke={OUTLINE} strokeWidth="1" opacity="0.6" />
      <ellipse cx="44" cy="40" rx="3" ry="2.5" fill="#E8D880" stroke={OUTLINE} strokeWidth="1" opacity="0.6" />
      <circle cx="22" cy="46" r="2" fill="#E8D880" stroke={OUTLINE} strokeWidth="1" opacity="0.6" />
      {/* Eyes */}
      <circle cx="34" cy="38" r="2" fill={EYE_COLOR} />
      <circle cx="44" cy="35" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M37 42 Q39 44 41 42" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PopcornIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Container (red striped bucket) */}
      <path
        d="M18 30 L20 54 Q20 56 24 56 L40 56 Q44 56 44 54 L46 30 Z"
        fill={COLORS.coral}
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Stripes on container */}
      <line x1="26" y1="30" x2="27" y2="56" stroke="#fff" strokeWidth="2" opacity="0.4" />
      <line x1="36" y1="30" x2="37" y2="56" stroke="#fff" strokeWidth="2" opacity="0.4" />
      {/* Popcorn puffs */}
      <circle cx="26" cy="24" r="7" fill={COLORS.cream} stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="38" cy="24" r="7" fill={COLORS.cream} stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="32" cy="18" r="7" fill={COLORS.cream} stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="24" cy="16" r="5" fill={COLORS.cream} stroke={OUTLINE} strokeWidth="1.5" />
      <circle cx="40" cy="16" r="5" fill={COLORS.cream} stroke={OUTLINE} strokeWidth="1.5" />
      {/* Eyes (on the middle puff) */}
      <circle cx="29" cy="18" r="1.5" fill={EYE_COLOR} />
      <circle cx="35" cy="18" r="1.5" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M31 22 Q32 24 33 22" fill="none" stroke={EYE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function JerkyIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Jerky strip body */}
      <path
        d="M14 24 Q16 20 20 22 L48 26 Q52 27 52 32 L50 40 Q49 44 44 44 L18 40 Q12 39 12 34 Z"
        fill={COLORS.coral}
        stroke={OUTLINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Texture lines (dried look) */}
      <path d="M20 28 L40 30" fill="none" stroke={OUTLINE} strokeWidth="0.8" opacity="0.3" />
      <path d="M18 34 L42 36" fill="none" stroke={OUTLINE} strokeWidth="0.8" opacity="0.3" />
      <path d="M22 38 L38 40" fill="none" stroke={OUTLINE} strokeWidth="0.8" opacity="0.3" />
      {/* Rough edges */}
      <path d="M14 28 Q12 30 14 32" fill="none" stroke={OUTLINE} strokeWidth="1" opacity="0.4" />
      <path d="M50 30 Q52 34 50 38" fill="none" stroke={OUTLINE} strokeWidth="1" opacity="0.4" />
      {/* Eyes */}
      <circle cx="28" cy="30" r="2" fill={EYE_COLOR} />
      <circle cx="38" cy="31" r="2" fill={EYE_COLOR} />
      {/* Mouth */}
      <path d="M31 35 Q33 37 35 35" fill="none" stroke={EYE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GenericIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {/* Mystery box body */}
      <rect
        x="14" y="16" width="36" height="36" rx="8" ry="8"
        fill={COLORS.lavender}
        stroke={OUTLINE}
        strokeWidth="2"
      />
      {/* Box lid line */}
      <line x1="14" y1="26" x2="50" y2="26" stroke={OUTLINE} strokeWidth="2" />
      {/* Bow / ribbon */}
      <rect x="29" y="16" width="6" height="36" rx="2" fill={COLORS.pink} stroke={OUTLINE} strokeWidth="1" opacity="0.5" />
      {/* Bow knot */}
      <ellipse cx="28" cy="22" rx="5" ry="3" fill={COLORS.pink} stroke={OUTLINE} strokeWidth="1" />
      <ellipse cx="36" cy="22" rx="5" ry="3" fill={COLORS.pink} stroke={OUTLINE} strokeWidth="1" />
      <circle cx="32" cy="22" r="2.5" fill={COLORS.coral} stroke={OUTLINE} strokeWidth="1" />
      {/* Eyes */}
      <circle cx="26" cy="38" r="2" fill={EYE_COLOR} />
      <circle cx="38" cy="38" r="2" fill={EYE_COLOR} />
      {/* Question mark mouth */}
      <text
        x="32" y="48"
        textAnchor="middle"
        fontSize="10"
        fontFamily="serif"
        fill={EYE_COLOR}
        fontWeight="bold"
      >
        ?
      </text>
    </svg>
  );
}

// ── Icon registry ─────────────────────────────────────────────────────
const ICON_MAP: Record<string, () => React.ReactElement> = {
  chips: ChipsIcon,
  chocolate: ChocolateIcon,
  cookie: CookieIcon,
  candy: CandyIcon,
  fruit: FruitIcon,
  drink: DrinkIcon,
  bread: BreadIcon,
  rice: RiceIcon,
  icecream: IceCreamIcon,
  noodle: NoodleIcon,
  nuts: NutsIcon,
  cheese: CheeseIcon,
  popcorn: PopcornIcon,
  jerky: JerkyIcon,
  generic: GenericIcon,
};

// ── Public API ────────────────────────────────────────────────────────

/**
 * Returns a cute Sumikko Gurashi-style SVG icon for the given snack name.
 * The snack name is matched against keyword lists to determine the category.
 * Falls back to a cute mystery-box icon when no category matches.
 */
export function getSnackIcon(snackName: string): React.ReactElement {
  const category = resolveCategory(snackName);
  const IconComponent = ICON_MAP[category] ?? GenericIcon;
  return <IconComponent />;
}

/**
 * Returns a pastel background color appropriate for the given snack name,
 * based on its resolved category.
 */
export function getSnackColor(snackName: string): string {
  const category = resolveCategory(snackName);
  return CATEGORY_COLORS[category] ?? COLORS.lavender;
}
