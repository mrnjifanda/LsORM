import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/LsORM.js',
                format: 'umd',
                name: 'LsORM',
                sourcemap: true
            },
            {
                file: 'dist/LsORM.esm.js',
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
