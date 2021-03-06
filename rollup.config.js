import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'happyBarnacle',
      globals :{
          sitka:'sitka', 
          express: 'express', 
          cors: 'cors',
          'better-sqlite3': 'sqlite',
          'choicest-barnacle':'choicest-barnacle'
      }
    },
    plugins: [
        typescript({
          typescript: require('typescript'),
        }),
        nodePolyfills()
    ],
    external: [ 'sitka','cors','express','better-sqlite3','choicest-barnacle' ]
  };