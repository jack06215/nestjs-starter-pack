module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
  "^(nest/(.*)$)|^(nest$)",
  "^types$",
  "^@local/(.*)$",
  "^[./]",],
  importOrderSeparation: true,
  importOrderParserPlugins: ["typescript", "decorators-legacy"],
  importOrderSortSpecifiers: true
};
