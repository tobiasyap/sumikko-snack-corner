export interface User {
  id: number;
  email: string;
  hasEmailSetup: boolean;
}

export interface Snack {
  id: number;
  name: string;
  expiryDate: string;
  expiryIsApprox: boolean;
  imagePath: string | null;
  characterType: CharacterType;
  slotPosition: number;
  notifiedAt: string | null;
  createdAt: string;
  userId: number;
}

export interface ArchivedSnack {
  id: number;
  name: string;
  imagePath: string | null;
  rating: number | null;
  eatenAt: string;
  originalExpiry: string;
  expiryIsApprox?: boolean;
  characterType?: string;
  slotPosition?: number;
  userId: number;
}

export type CharacterType = 'shirokuma' | 'penguin' | 'tonkatsu' | 'neko' | 'tokage' | 'yamapenguin';

export const CHARACTER_NAMES: Record<CharacterType, string> = {
  shirokuma: 'Shirokuma',
  penguin: 'Penguin (Real)',
  tonkatsu: 'Tonkatsu',
  neko: 'Neko',
  tokage: 'Tokage',
  yamapenguin: 'Yamapenguin?',
};
