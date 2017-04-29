//import babel from 'rollup-plugin-babel';

export default {
    entry: './src/graphics-library/entry.js',
    targets: [{
		format: 'iife',
		moduleName: 'xtory.graphicsLibrary',
		dest: './dist/xtory.graphicsLibrary.js'
	}]
    // plugins: [
    //     babel ({
    //         exclude: 'node_modules/**'
    //     })
    // ]
};
