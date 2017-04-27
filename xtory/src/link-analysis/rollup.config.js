//import babel from 'rollup-plugin-babel';

export default {
    entry: './src/link-analysis/entry.js',
    targets: [{
		format: 'iife',
		moduleName: 'gorilla.linkAnalysis',
		dest: 'dist/gorilla.linkAnalysis.js',
	}],
    // plugins: [
    //     babel ({
    //         exclude: 'node_modules/**'
    //     })
    // ]
};
