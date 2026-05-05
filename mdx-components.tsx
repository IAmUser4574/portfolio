import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";

function H2(props: ComponentPropsWithoutRef<"h2">) {
  return <h2 className="mt-12 text-3xl font-semibold tracking-tight" {...props} />;
}

function Paragraph(props: ComponentPropsWithoutRef<"p">) {
  return <p className="my-6 leading-8 text-muted-foreground" {...props} />;
}

function Anchor(props: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      className="font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
      {...props}
    />
  );
}

function List(props: ComponentPropsWithoutRef<"ul">) {
  return <ul className="my-6 list-disc space-y-2 pl-6 text-muted-foreground" {...props} />;
}

function OrderedList(props: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol className="my-6 list-decimal space-y-2 pl-6 text-muted-foreground" {...props} />
  );
}

function Code(props: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
      {...props}
    />
  );
}

const components = {
  h2: H2,
  p: Paragraph,
  a: Anchor,
  ul: List,
  ol: OrderedList,
  code: Code,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
