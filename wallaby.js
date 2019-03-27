module.exports = function(wallaby) {
  return {
    files: [
      "src/**/*.+(ts|html|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)",
      "!src/**/*.spec.ts"
    ],

    tests: ["src/**/*.spec.ts"],

    env: {
      type: "node",
      runner: "node"
    },

    compilers: {
      "**/*.ts?(x)": wallaby.compilers.typeScript({
        module: "commonjs",
        getCustomTransformers: () => {
          return {
            before: [
              require("jest-preset-angular/InlineHtmlStripStylesTransformer").factory(
                {
                  compilerModule: require("typescript")
                }
              )
            ]
          };
        }
      }),
      "**/*.html": file => ({
        code: require("ts-jest").process(file.content, file.path, {
          globals: { "ts-jest": { stringifyContentPathRegex: "\\.html$" } }
        }),
        map: { version: 3, sources: [], names: [], mappings: [] },
        ranges: []
      })
    },

    preprocessors: {
      "src/**/*.js": [
        file =>
          require("@babel/core").transform(file.content, {
            sourceMap: true,
            compact: false,
            filename: file.path,
            presets: [require("babel-preset-jest")]
          })
      ]
    },

    setup: function(wallaby) {
      const jestConfig = require("./package.json").jest;
      delete jestConfig.preset;
      Object.assign(jestConfig, require("jest-preset-angular/jest-preset"));
      jestConfig.transformIgnorePatterns.push("instrumented.*.(jsx?|html)$");
      wallaby.testFramework.configure(jestConfig);
    },

    testFramework: "jest"
  };
};
