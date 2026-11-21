import React from "react";

interface KenyanAccentBarProps {
  className?: string;
  width?: string;
}

/**
 * Kenyan National Flag Colors Accent Bar
 * Order: Black, White fimbriation, Red, White fimbriation, Green
 */
export function KenyanAccentBar({ className = "", width = "w-28 sm:w-36" }: KenyanAccentBarProps) {
  return (
    <div
      role="img"
      aria-label="Kenyan National Colors: Black, Red, White, Green"
      className={`inline-flex items-center h-1.5 ${width} rounded-full overflow-hidden shadow-lg border border-white/20 select-none my-3 ${className}`}
    >
      {/* Black stripe */}
      <span className="h-full flex-1 bg-black" />
      {/* White fimbriation */}
      <span className="h-full w-1 bg-white" />
      {/* Kenya Red stripe */}
      <span className="h-full flex-[1.4] bg-[#dc2626]" />
      {/* White fimbriation */}
      <span className="h-full w-1 bg-white" />
      {/* Kenya Green stripe */}
      <span className="h-full flex-1 bg-[#16a34a]" />
    </div>
  );
}
