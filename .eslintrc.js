/*
* The most common settings in design patterns
* Customize to your needs
*/

module.exports = {

   parserOptions: {

      ecmaVersion: 13, /* 2022 */
      ecmaFeatures: { }
   },
   env: {

      mocha: false,
      node: false,
      browser: true,
      commonjs: true,
      es2021: true
   },
   rules: {

      /* COMMON */
      eqeqeq: [ 1, 'always' ],
      indent: [ 1, 3, { ignoredNodes: [ 'ConditionalExpression' ] } ],
      'no-var': 1,
      quotes: [ 1, 'single', 'avoid-escape' ],
      semi: [ 1, 'always', { omitLastInOneLineBlock: true } ], /* Change to "never" to invert ";" rule */
      'semi-style': [ 1, 'last' ], /* Change to "first" to invert ";" rule */

      /* GENEREAL */
      'block-scoped-var': 1,
      // 'brace-style': 1,
      'comma-spacing': [ 1, { before: false, after: true } ],
      'no-async-promise-executor': 1,
      'no-bitwise': [ 1, { allow: [ '~' ] } ],
      'no-duplicate-case': 1,
      'no-duplicate-imports': [ 1, { includeExports: true } ],
      'no-empty-pattern': 1,
      'no-eq-null': 1,
      'no-ex-assign': 1,
      'no-extra-boolean-cast': [ 1, { enforceForLogicalOperands: true } ],
      'no-func-assign': 1,
      'no-global-assign': 1,
      'no-multi-spaces': [ 1, { ignoreEOLComments: false } ],
      'no-multiple-empty-lines': [ 1, { max: 1, maxEOF: 0 } ],
      'no-nested-ternary': 1,
      'no-param-reassign': [ 1, { props: false } ],
      'no-redeclare': 1,
      'no-self-assign': [ 1, { props: false } ],
      'no-shadow': [ 1, { hoist: 'functions' } ],
      'no-shadow-restricted-names': 1,
      'no-template-curly-in-string': 1,
      'no-unneeded-ternary': 1,
      'no-with': 1,
      'no-whitespace-before-property': 1,
      'quote-props': [ 1, 'as-needed' ],
      'require-await': 1,
      'rest-spread-spacing': [ 1, 'never' ],
      'semi-spacing': 1,
      'space-before-function-paren': [ 1, { anonymous: 'always', named: 'never', asyncArrow: 'always' } ],
      'space-unary-ops': 1,
      yoda: 1,

      /* ERRORS */
      'no-const-assign': 2,
      'no-extra-semi': 2,
      'for-direction': 2,

      /* RECOMMENDED */
      // 'getter-return': [ 1, { allowImplicit: true } ],
      // 'no-unused-vars': 1,

      /* FIX */
      // 'array-bracket-spacing': [ 1, 'always' ],
      // 'block-spacing': 1,
      // 'comma-dangle': [ 1, { arrays: 'never', objects: 'never', imports: 'never', exports: 'never', functions: 'never' } ],
      // 'computed-property-spacing': [ 1, 'never' ],
      // curly: [ 1, 'multi' ],
      // 'dot-location': [ 1, 'object' ],
      // 'eol-last': [ 1, 'never' ],
      // 'func-call-spacing': [ 1, 'never' ],
      // 'key-spacing': [ 1, { beforeColon: false, mode: 'strict' } ],
      // 'keyword-spacing': [ 1, { overrides: { if: { after: true }, for: { after: true }, while: { after: true } } } ],
      // 'lines-between-class-members': [ 1, 'always', { exceptAfterSingleLine: true } ],
      // 'multiline-ternary': [ 1, 'never' ],
      // 'newline-after-var': [ 1, 'always' ],
      // 'no-mixed-spaces-and-tabs': 1,
      // 'no-tabs': 1,
      // 'no-trailing-spaces': [ 1, { ignoreComments: true, skipBlankLines: true } ],
      // 'nonblock-statement-body-position': [ 1, 'beside' ],
      // 'object-curly-spacing': [ 1, 'always' ],
      // 'operator-linebreak': [ 1, 'none' ],
      // 'space-before-blocks': 1,
      // 'space-in-parens': [ 1, 'never' ],
      // 'space-infix-ops': 1,
      // 'spaced-comment': [ 1, 'always', { exceptions: [ '+-=*' ] } ],
      // 'template-curly-spacing': [ 1, 'never' ],

      /* OTHERS */
      // 'func-style': [ 1, 'expression' ],
      // 'grouped-accessor-pairs': [ 1, 'getBeforeSet' ],
      // 'init-declarations': [ 1, 'always' ],
      // 'no-console': [ 1, { allow: [ 'warn', 'error', 'clear', 'info' ] } ],
      // 'no-eval': 1,
      // 'no-mixed-operators': [ 1, { allowSamePrecedence: true } ],
      // 'no-multi-assign': 1,
      // 'no-return-await': 1,
      // 'no-script-url': 1,
   }
};