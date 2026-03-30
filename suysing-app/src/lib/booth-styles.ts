import type { CSSProperties } from "react";

interface ActiveBoothColors {
  activeGradientColor?: string;
  activeAccentColor?: string;
}

export function getActiveBoothStyle(
  booth: ActiveBoothColors,
  visited: boolean,
): CSSProperties | undefined {
  if (!visited || !booth.activeGradientColor || !booth.activeAccentColor) {
    return undefined;
  }

  return {
    background: `linear-gradient(180deg, #FFFFFF 0%, ${booth.activeGradientColor} 100%)`,
    border: `0.98px solid ${booth.activeAccentColor}`,
    boxShadow: `2.94px 3.92px 0px 0px ${booth.activeAccentColor}, 0px 3.92px 6.46px 3.92px #00000059`,
  };
}
