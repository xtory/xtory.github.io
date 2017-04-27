//import babel from 'rollup-plugin-babel';

export default {
    entry: './src/graphics-library/entry.js',
    targets: [{
		format: 'iife',
		moduleName: 'gorilla.graphicsLibrary',
		dest: './dist/gorilla.graphicsLibrary.js'
	}]
    // plugins: [
    //     babel ({
    //         exclude: 'node_modules/**'
    //     })
    // ]
};
