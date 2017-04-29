//import babel from 'rollup-plugin-babel';

export default {
    entry: './src/link-analysis/entry.js',
    targets: [{
		format: 'iife',
		moduleName: 'xtory.linkAnalysis',
		dest: 'dist/xtory.linkAnalysis.js',
	}],
    // plugins: [
    //     babel ({
    //         exclude: 'node_modules/**'
    //     })
    // ]
};
