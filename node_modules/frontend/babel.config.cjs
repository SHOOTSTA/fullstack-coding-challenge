module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  // Only used by Jest (babel-jest); Vite handles import.meta.env natively
  // via esbuild for the real dev/build pipeline, so this doesn't affect it.
  plugins: ['babel-plugin-transform-vite-meta-env'],
}
