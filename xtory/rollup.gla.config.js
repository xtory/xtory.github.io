//import babel from 'rollup-plugin-babel';

export default {
    entry: './src/gla/gla.js',
    targets: [
		{
			format: 'iife',
			moduleName: 'GorillaLinkAnalysis',
			dest: './dist/gla.js',
		}
		//}, {
		// 	format: 'es',
        //     moduleName: 'GorillaGL',
		// 	dest: 'dist/g2l.es.js'
		// }, {
		// 	format: 'amd',
		// 	moduleName: 'GorillaGL',
		// 	dest: 'dist/g2l.amd.js'
		// }, {
		// 	format: 'cjs',
		// 	moduleName: 'GorillaGL',
		// 	dest: 'dist/g2l.cjs.js'
		// }, {
		// 	format: 'umd',
		// 	moduleName: 'GorillaGL',
		// 	dest: 'dist/g2l.umd.js'
		// }
	]
};
