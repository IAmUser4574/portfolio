import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// converts .mdx to valid JS so vite import-analysis doesn't choke on MDX syntax.
// vi.mock() calls in tests override specific files with real fixture metadata.
const mdxStub = {
  name: "mdx-stub",
  transform(_code: string, id: string) {
    if (id.endsWith(".mdx")) {
      return { code: "export default () => null; export const metadata = {};" };
    }
  },
};

export default defineConfig({
  plugins: [mdxStub, react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
