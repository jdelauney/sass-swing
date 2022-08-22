import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default {
	input: 'src/scripts/sass-swing.js',
	plugins: [
		terser({
			ecma: 2020,
			mangle: { toplevel: true },
			compress: {
				module: true,
				toplevel: true,
				unsafe_arrows: true,
				drop_console: true,
				drop_debugger: true
			},
			output: { quote_style: 1 }
		})
	],
	output: [
		{
			name: 'sass-swing',
			file: pkg.browser,
			format: 'umd',
			sourcemap:false
		},
		{
			name: 'sass-swing',
			file: pkg.module,
			format: 'esm',
			sourcemap:false
		},
	],
};