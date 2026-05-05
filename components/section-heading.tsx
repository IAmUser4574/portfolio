export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      {children ? (
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{children}</p>
      ) : null}
    </div>
  );
}
