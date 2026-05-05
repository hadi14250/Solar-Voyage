interface UAEFlagProps {
  className?: string;
  /** width in px */
  size?: number;
}

/** Small UAE flag — pure SVG, no asset required. */
export default function UAEFlag({ className = "", size = 24 }: UAEFlagProps) {
  const w = size;
  const h = (size * 2) / 3;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 30 20"
      className={className}
      role="img"
      aria-label="UAE flag"
    >
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.667" fill="#009639" />
      <rect y="13.333" width="30" height="6.667" fill="#000" />
      <rect width="7.5" height="20" fill="#CE1126" />
    </svg>
  );
}
