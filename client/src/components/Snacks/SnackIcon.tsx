import { getSnackIcon, getSnackColor } from '../../utils/snackIcons';

interface SnackIconProps {
  snack: { name: string; imagePath: string | null };
  size?: number;
}

export default function SnackIcon({ snack, size = 48 }: SnackIconProps) {
  if (snack.imagePath) {
    return (
      <div
        className="snack-icon-frame"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${getSnackColor(snack.name)}`,
          backgroundColor: '#fff',
          flexShrink: 0,
        }}
      >
        <img
          src={`/uploads/${snack.imagePath}`}
          alt={snack.name}
          className="snack-icon-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      className="snack-icon-svg"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {getSnackIcon(snack.name)}
    </div>
  );
}
