// `join.js` instructs esbuild to join all `/URLFormJS` files into one file.
//
// From ESBuild for multiple files:
//
// > Note that bundling is different than file concatenation. Passing esbuild
// multiple input files with bundling enabled will create multiple separate
// bundles instead of joining the input files together. To join a set of files
// together with esbuild, import them all into a single entry point file and
// bundle just that one file with esbuild.
//
// Use one of the following commands for either human readable or minified. The
// only point of the `*.join.js` file is debugging.  `*.min.js` should be used
// in prod.  
//
// To generate the files, run the following:
// ```sh
// esbuild join.js --bundle --format=esm --outfile=urlform.join.js
// esbuild join.js --bundle --format=esm --minify --outfile=urlform.min.js
// ```
//
export * from './urlform.js';