//import babel from 'rollup-plugin-babel';

export default {
    entry: './src/core/entry.js',
    targets: [{
		format: 'iife',
		moduleName: 'xtory.core',
		dest: './dist/xtory.core.js'
	}]
    // plugins: [
    //     babel ({
    //         exclude: 'node_modules/**'
    //     })
    // ]
};
