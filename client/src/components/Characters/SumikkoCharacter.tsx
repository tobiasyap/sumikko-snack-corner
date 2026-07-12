import { CharacterType } from '../../types';

interface SumikkoCharacterProps {
  type: CharacterType;
  size?: number;
  flipped?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CHARACTER_IMAGES: Record<CharacterType, string> = {
  shirokuma: '/characters/shirokuma.png',
  penguin: '/characters/penguin.png',
  tonkatsu: '/characters/tonkatsu.png',
  neko: '/characters/neko.png',
  tokage: '/characters/tokage.png',
  yamapenguin: '/characters/yamapenguin.png',
};

export default function SumikkoCharacter({ type, size = 80, flipped, className, style }: SumikkoCharacterProps) {
  return (
    <img
      src={CHARACTER_IMAGES[type]}
      alt={type}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        transform: flipped ? 'scaleX(-1)' : undefined,
        imageRendering: 'auto',
        ...style,
      }}
      draggable={false}
    />
  );
}

const CHARACTERS: CharacterType[] = ['shirokuma', 'penguin', 'tonkatsu', 'neko', 'tokage', 'yamapenguin'];

export function getRandomCharacter(): CharacterType {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}
