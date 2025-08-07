import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  clean: true,
  outDir: "dist",
  target: "es6",
  minify: false,
  banner: {
    js: '"use client"',
  },
});
