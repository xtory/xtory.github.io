//import babel from 'rollup-plugin-babel';

export default {
    entry: './src/link-analysis/entry.js',
    targets: [{
		format: 'cjs',
		moduleName: 'xtory.linkAnalysis',
		dest: './tests/unit/dist/xtory.linkAnalysis.cjs.js'
	}]
    // plugins: [
    //     babel ({
    //         exclude: 'node_modules/**'
    //     })
    // ]
};
