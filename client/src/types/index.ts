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
  rating: number;
  eatenAt: string;
  originalExpiry: string;
  userId: number;
}

export type CharacterType = 'shirokuma' | 'penguin' | 'tonkatsu' | 'neko' | 'tokage' | 'yamapenguin';

export const CHARACTER_NAMES: Record<CharacterType, string> = {
  shirokuma: 'Shirokuma',
  penguin: 'Penguin?',
  tonkatsu: 'Tonkatsu',
  neko: 'Neko',
  tokage: 'Tokage',
  yamapenguin: 'Yama Penguin',
};
