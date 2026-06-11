import { useInView } from "@/hooks/common/use-in-view";
import { cn } from "@/lib/utils";
import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
};

type RevealStyle = CSSProperties & { "--reveal-delay"?: string };

export function Reveal({ children, as, className, delay = 0 }: RevealProps) {
  const Tag = as ?? "div";
  const { ref, inView } = useInView<HTMLElement>();

  const style: RevealStyle = delay ? { "--reveal-delay": `${delay}ms` } : {};

  return (
    <Tag
      ref={ref}
      data-revealed={inView ? "true" : "false"}
      style={style}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
