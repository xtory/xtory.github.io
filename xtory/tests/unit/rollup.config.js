//import babel from 'rollup-plugin-babel';

export default {
    entry: './src/core/entry.js',
    targets: [{
		format: 'cjs',
		moduleName: 'xtory.core',
		dest: './tests/unit/dist/xtory.core.js'
	}]
    // plugins: [
    //     babel ({
    //         exclude: 'node_modules/**'
    //     })
    // ]
};
