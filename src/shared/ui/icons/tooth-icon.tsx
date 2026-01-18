import React from "react";

export const toothIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 48">
  <path d="M20 0C9 0 0 9 0 20c0 13 20 28 20 28s20-15 20-28C40 9 31 0 20 0z" fill="#ff6f61"/>
  <path d="M20 10c-4 0-7 3-7 7 0 2.5 1 4 1.5 5.5.5 1.5.5 5.5 2.5 6.5 1.5.8 2.5-1 3-3 .5 2 1.5 3.8 3 3 2-1 2-5 2.5-6.5.5-1.5 1.5-3 1.5-5.5 0-4-3-7-7-7z" fill="#fff"/>
</svg>
`;

export function ToothIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 48"
      aria-hidden
    >
      <path
        d="M20 0C9 0 0 9 0 20c0 13 20 28 20 28s20-15 20-28C40 9 31 0 20 0z"
        fill="#ff6f61"
      />
      <path
        d="M20 10c-4 0-7 3-7 7 0 2.5 1 4 1.5 5.5.5 1.5.5 5.5 2.5 6.5 1.5.8 2.5-1 3-3 .5 2 1.5 3.8 3 3 2-1 2-5 2.5-6.5.5-1.5 1.5-3 1.5-5.5 0-4-3-7-7-7z"
        fill="#fff"
      />
    </svg>
  );
}

export default ToothIcon;
