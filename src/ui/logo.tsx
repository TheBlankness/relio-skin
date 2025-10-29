import { cn } from "@/utils/misc";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  [key: string]: unknown | undefined;
}

export function Logo({ width, height, className, ...args }: LogoProps) {
  return (
    <img
      {...args}
      src="/images/571215055_122102646765080338_8433465706728326189_n.jpg"
      alt="RelioSkin Logo"
      width={width ?? 40}
      height={height ?? 40}
      className={cn("object-contain", className)}
    />
  );
}
