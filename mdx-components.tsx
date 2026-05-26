import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";

import { slugify } from "@/lib/slugify";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node))
    return extractText((node.props as { children?: ReactNode }).children);
  return "";
}

function HeadingAnchor({ slug }: { slug: string }) {
  return (
    <a
      href={`#${slug}`}
      aria-hidden="true"
      tabIndex={-1}
      className="ml-2 font-normal text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100"
    >
      #
    </a>
  );
}

function H2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
  const slug = slugify(extractText(children));
  return (
    <h2
      id={slug}
      className="group mt-12 scroll-mt-20 text-3xl font-semibold tracking-tight"
      {...props}
    >
      {children}
      <HeadingAnchor slug={slug} />
    </h2>
  );
}

function H3({ children, ...props }: ComponentPropsWithoutRef<"h3">) {
  const slug = slugify(extractText(children));
  return (
    <h3
      id={slug}
      className="group mt-8 scroll-mt-20 text-xl font-semibold tracking-tight"
      {...props}
    >
      {children}
      <HeadingAnchor slug={slug} />
    </h3>
  );
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
  // block code (inside <pre>) carries a language-* class — leave it unstyled
  if (props.className?.startsWith("language-")) return <code {...props} />;
  return (
    <code
      className="rounded-md border border-border bg-secondary px-1.5 py-0.5 font-mono text-[0.875em] text-secondary-foreground"
      {...props}
    />
  );
}

function Pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const lang = isValidElement(children)
    ? (children.props as { className?: string }).className?.replace("language-", "")
    : undefined;

  return (
    <div className="relative my-6">
      {lang && (
        <span className="absolute right-3 top-2.5 font-mono text-xs text-muted-foreground">
          {lang}
        </span>
      )}
      <pre
        className="overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-sm leading-6"
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

const components = {
  h2: H2,
  h3: H3,
  p: Paragraph,
  a: Anchor,
  ul: List,
  ol: OrderedList,
  pre: Pre,
  code: Code,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
