import { SpaikeWordmark } from "./EditorialUI";

type LogoSize = "sm" | "md" | "lg" | "xl" | "hero";

interface LogoProps {
  size?: LogoSize;
  inverted?: boolean;
}

export default function Logo({ size = "md", inverted = false }: LogoProps) {
  return <SpaikeWordmark size={size} inverted={inverted} />;
}
