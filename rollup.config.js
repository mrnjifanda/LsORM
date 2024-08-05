import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/LsWebORM.js',
                format: 'umd',
                name: 'LsWebORM',
                sourcemap: true
            },
            {
                file: 'dist/LsWebORM.esm.js',
                format: 'es',
                sourcemap: true
            }
        ],
        plugins: [
            typescript(),
            commonjs(),
            resolve(),
            terser()
        ]
    }
];
