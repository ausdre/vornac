// Optimization config for static SVG assets (logos, favicon, trust icons).
// preset-default in this SVGO version keeps the viewBox, which we need for
// responsive <img> scaling; we just strip editor cruft and collapse path data.
// Re-run after adding/replacing an SVG:
//   npx svgo --config svgo.config.cjs -q <files...>
module.exports = {
  multipass: true,
  js2svg: { pretty: false },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: { minify: true },
        },
      },
    },
  ],
};
