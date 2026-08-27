module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // react-three-fiber elements (mesh, ambientLight, primitive, etc.) accept
    // real three.js properties that aren't DOM attributes; without this list
    // eslint-plugin-react treats every one of them as an unknown-property error.
    'react/no-unknown-property': [
      'error',
      {
        ignore: [
          'args',
          'object',
          'position',
          'position-y',
          'rotation',
          'rotation-y',
          'scale',
          'intensity',
          'castShadow',
          'receiveShadow',
          'penumbra',
          'angle',
          'groundColor',
          'shadow-mapSize',
          'map',
          'polygonOffset',
          'polygonOffsetFactor',
          'flatShading',
          'dispose',
          'transparent',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['*.config.js', '*.config.cjs'],
      env: { node: true },
    },
  ],
}
