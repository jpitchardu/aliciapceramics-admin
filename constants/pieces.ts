export const PIECE_TYPES = {
  MUG_WITH_HANDLE: "mug-with-handle",
  MUG_WITHOUT_HANDLE: "mug-without-handle",
  TUMBLER: "tumbler",
  MATCHA_BOWL: "matcha-bowl",
  TRINKET_DISH: "trinket-dish",
  DINNERWARE: "dinnerware",
  OTHER: "other",
} as const;

export type PieceType = (typeof PIECE_TYPES)[keyof typeof PIECE_TYPES];

export const SIZE_OPTIONS = {
  EIGHT_OZ: "8",
  TEN_OZ: "10",
  TWELVE_OZ: "12",
} as const;

export type SizeOption = (typeof SIZE_OPTIONS)[keyof typeof SIZE_OPTIONS];

export type PieceConfig = {
  type: PieceType;
  label: string;
  icon: string;
  sizes: readonly SizeOption[];
};

export const PIECE_CONFIGS: Record<PieceType, PieceConfig> = {
  [PIECE_TYPES.MUG_WITH_HANDLE]: {
    type: PIECE_TYPES.MUG_WITH_HANDLE,
    label: "Mug w/ Handle",
    icon: "https://aliciapceramics.com/icons/mug_with_handle.png",
    sizes: [SIZE_OPTIONS.EIGHT_OZ, SIZE_OPTIONS.TEN_OZ, SIZE_OPTIONS.TWELVE_OZ],
  },
  [PIECE_TYPES.MUG_WITHOUT_HANDLE]: {
    type: PIECE_TYPES.MUG_WITHOUT_HANDLE,
    label: "Mug w/o Handle",
    icon: "https://aliciapceramics.com/icons/mug_without_handle.png",
    sizes: [SIZE_OPTIONS.EIGHT_OZ, SIZE_OPTIONS.TEN_OZ, SIZE_OPTIONS.TWELVE_OZ],
  },
  [PIECE_TYPES.TUMBLER]: {
    type: PIECE_TYPES.TUMBLER,
    label: "Tumbler",
    icon: "https://aliciapceramics.com/icons/tumbler.png",
    sizes: [SIZE_OPTIONS.EIGHT_OZ, SIZE_OPTIONS.TEN_OZ, SIZE_OPTIONS.TWELVE_OZ],
  },
  [PIECE_TYPES.MATCHA_BOWL]: {
    type: PIECE_TYPES.MATCHA_BOWL,
    label: "Matcha Bowl",
    icon: "https://aliciapceramics.com/icons/matcha_bowl.png",
    sizes: [],
  },
  [PIECE_TYPES.TRINKET_DISH]: {
    type: PIECE_TYPES.TRINKET_DISH,
    label: "Trinket Dish",
    icon: "https://aliciapceramics.com/icons/trinket_dish.png",
    sizes: [],
  },
  [PIECE_TYPES.DINNERWARE]: {
    type: PIECE_TYPES.DINNERWARE,
    label: "Dinnerware",
    icon: "https://aliciapceramics.com/icons/plate.png",
    sizes: [],
  },
  [PIECE_TYPES.OTHER]: {
    type: PIECE_TYPES.OTHER,
    label: "Other",
    icon: "https://aliciapceramics.com/icons/vase.png",
    sizes: [],
  },
};

export function getSizeLabel(size: SizeOption): string {
  return `${size} oz`;
}

export function isSizedPiece(type: PieceType): boolean {
  return PIECE_CONFIGS[type].sizes.length > 0;
}

export type PieceDetail = {
  type: PieceType;
  size?: SizeOption;
  quantity: number;
  description: string;
};
