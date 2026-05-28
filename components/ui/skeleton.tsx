import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted-foreground/20 inline-block", className)}
      {...props}
    />
  );
}

export { Skeleton };
