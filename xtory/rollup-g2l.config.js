//import babel from 'rollup-plugin-babel';

export default {
    entry: './src/g2l/entry.js',
    targets: [
		{
			format: 'iife',
			moduleName: 'GorillaGL',
			dest: './dist/g2l.js'
		}
		//}, {
		// 	format: 'es',
        //     moduleName: 'GorillaGL',
		// 	dest: './dist/g2l.es.js'
		// }, {
		// 	format: 'amd',
		// 	moduleName: 'GorillaGL',
		// 	dest: './dist/g2l.amd.js'
		// }, {
		// 	format: 'cjs',
		// 	moduleName: 'GorillaGL',
		// 	dest: './dist/g2l.cjs.js'
		// }, {
		// 	format: 'umd',
		// 	moduleName: 'GorillaGL',
		// 	dest: './dist/g2l.umd.js'
		// }
	],
    // plugins: [
    //     babel ({
    //         exclude: 'node_modules/**'
    //     })
    // ]
};
