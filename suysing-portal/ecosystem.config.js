module.exports = {
  apps: [{
    name: "app",
    script: "npm",
    args: "run build-and-start",
    watch: ["package.json","next.config.ts","tsconfig.json","eslint.config.mjs","postcss.config.mjs", "src", "public"],
    ignore_watch: ["node_modules", ".next"]
  }]
}
