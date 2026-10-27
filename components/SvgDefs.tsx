/**
 * Shared SVG symbols referenced by <use href="#id"> throughout the card:
 * the gold medallion seal, frame corners, divider rule and birds.
 * (Garland flowers and leaves are image files in public/ornaments; see lib/flora.ts.)
 */

const steps = (count: number, step: number, start = 0) =>
  Array.from({ length: count }, (_, i) => +(start + i * step).toFixed(1));

const ring = (count: number, r: number) =>
  Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return [+(r * Math.cos(a)).toFixed(1), +(r * Math.sin(a)).toFixed(1)];
  });

export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0bd" />
          <stop offset=".45" stopColor="#d9b25c" />
          <stop offset="1" stopColor="#8f6a25" />
        </linearGradient>
      </defs>

      <symbol id="medallion" viewBox="-100 -100 200 200">
        <g fill="none" stroke="#e2c070" strokeWidth="1.4">
          <circle r="98" />
          <circle r="94" strokeWidth=".6" />
        </g>
        <g fill="#d8b25a" fillOpacity=".2" stroke="#e2c070" strokeWidth="1.1">
          {steps(16, 22.5).map((a) => (
            <g key={a} transform={`rotate(${a.toFixed(1)} 0 0)`}>
              <path d="M0,-50 C10,-62 10,-80 0,-93 C-10,-80 -10,-62 0,-50Z" />
            </g>
          ))}
        </g>
        <g fill="#e2c070" fillOpacity=".8">
          {ring(32, 86).map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.3" />
          ))}
        </g>
        <g fill="none" stroke="#e2c070" strokeWidth="1.6">
          <rect x="-40" y="-40" width="80" height="80" />
          <rect x="-40" y="-40" width="80" height="80" transform="rotate(45)" />
        </g>
        <polygon
          points="0.0,-44.0 8.4,-20.3 31.1,-31.1 20.3,-8.4 44.0,0.0 20.3,8.4 31.1,31.1 8.4,20.3 0.0,44.0 -8.4,20.3 -31.1,31.1 -20.3,8.4 -44.0,0.0 -20.3,-8.4 -31.1,-31.1 -8.4,-20.3"
          fill="url(#gold)"
          stroke="#8f6a25"
          strokeWidth=".6"
        />
        <circle r="12" fill="#2a0509" stroke="#e2c070" strokeWidth="1.4" />
        <circle r="5" fill="url(#gold)" />
      </symbol>

      <symbol id="paisley" viewBox="0 0 24 40">
        <path
          d="M12,1 C20,9 23,22 17,31 C13,37 5,38 3,32 C1,26 6,22 10,24 C13,26 12,30 9,30 C14,29 14,22 10,18 C6,13 8,6 12,1Z"
          fill="currentColor"
          fillOpacity=".28"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="14" cy="26" r="1.6" fill="currentColor" />
      </symbol>

      <symbol id="corner" viewBox="0 0 150 150">
        <g fill="none" stroke="#e2c070" strokeWidth="2.2">
          <path d="M5,150 V34 Q5,5 34,5 H150" />
        </g>
        <g fill="none" stroke="#e2c070" strokeWidth=".9">
          <path d="M15,150 V38 Q15,15 38,15 H150" />
          <path d="M25,150 V42 Q25,25 42,25 H150" strokeOpacity=".5" />
        </g>
        <g transform="translate(50 50)" fill="#d8b25a" fillOpacity=".25" stroke="#e2c070" strokeWidth="1.1">
          {steps(8, 45).map((a) => (
            <g key={a} transform={`rotate(${a} 0 0)`}>
              <ellipse cx="0" cy="-15" rx="5.5" ry="11" />
            </g>
          ))}
          <circle r="6" fill="#e2c070" fillOpacity=".9" />
        </g>
        <g fill="none" stroke="#e2c070" strokeWidth="1.2">
          <path d="M60,58 C88,60 104,78 98,108" />
          <path d="M58,60 C60,88 78,104 108,98" />
          <circle cx="50" cy="50" r="24" strokeOpacity=".6" />
        </g>
        <g color="#e2c070">
          <use href="#paisley" x="92" y="22" width="15" height="25" transform="rotate(90 99 34)" />
          <use href="#paisley" x="22" y="92" width="15" height="25" transform="rotate(180 29 104)" />
          <use href="#paisley" x="104" y="104" width="15" height="25" transform="rotate(135 111 116)" />
        </g>
        <g fill="#e2c070">
          <circle cx="124" cy="14" r="2" />
          <circle cx="14" cy="124" r="2" />
          <circle cx="136" cy="14" r="1.4" />
          <circle cx="14" cy="136" r="1.4" />
        </g>
      </symbol>

      <symbol id="divider" viewBox="0 0 300 24">
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <path d="M0,12 H112" />
          <path d="M188,12 H300" />
          <path d="M112,12 C122,2 134,3 142,12 C134,21 122,22 112,12Z" />
          <path d="M188,12 C178,2 166,3 158,12 C166,21 178,22 188,12Z" />
        </g>
        <path d="M150,3 L159,12 L150,21 L141,12Z" fill="currentColor" />
      </symbol>

      <symbol id="bird" viewBox="0 0 60 24">
        <path d="M0,8 C10,-2 22,0 30,12 C38,0 50,-2 60,8 C50,6 40,10 30,20 C20,10 10,6 0,8Z" fill="currentColor" />
      </symbol>
    </svg>
  );
}
