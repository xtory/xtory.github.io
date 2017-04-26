//import babel from 'rollup-plugin-babel';

export default {
    entry: './src/gla/entry.js',
    targets: [
		{
			format: 'iife',
			moduleName: 'GorillaLinkAnalysis',
			dest: './dist/gla.js',
		}
		//}, {
		// 	format: 'es',
        //     moduleName: 'GorillaLinkAnalysis',
		// 	dest: './dist/g2l.es.js'
		// }, {
		// 	format: 'amd',
		// 	moduleName: 'GorillaLinkAnalysis',
		// 	dest: './dist/g2l.amd.js'
		// }, {
		// 	format: 'cjs',
		// 	moduleName: 'GorillaLinkAnalysis',
		// 	dest: './dist/g2l.cjs.js'
		// }, {
		// 	format: 'umd',
		// 	moduleName: 'GorillaLinkAnalysis',
		// 	dest: './dist/g2l.umd.js'
		// }
	],
    // plugins: [
    //     babel ({
    //         exclude: 'node_modules/**'
    //     })
    // ]
};
