module.exports = {
  customSyntax: '@stylelint/postcss-css-in-js',
  processors: ['stylelint-processor-styled-components'],
  extends: ['stylelint-config-recommended', 'stylelint-config-styled-components'],
}
