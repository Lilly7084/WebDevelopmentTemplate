# L7084 web development template

This is a template I created for web development projects. It includes:

- **Webpack**, for bundling source files together and minifying;
- **TypeScript**, as a superset of JavaScript with better typing;
- **Sass / SCSS**, for more pleasant stylesheets;
- **A custom manifest loader**, to dynamically link your modules; and
- **A simple `package.json`**, so all dev libraries are already listed.

#
## Getting started

To prepare this template for use:

1. Clone or download this repository into your project's directory.
2. Make sure you have `node` and `npm` installed.
3. Run `npm install` to install all required development dependencies.

The project can be (re)built by simply running `npm run build`. Make sure to do this after _every_ change you want to test in your local server. _Note: Both development and production builds exist, and are selected using a boolean const in `webpack.config.js`. Development builds are not minified, and have full source maps appended to them, for faster building and easier debugging. Production builds are fully minified and have no source maps, to occupy less server space for new releases and updates._

The **Live Server** extension for VS Code (or equivalent for your preferred editor) is recommended for development; `fetch()` fails when you open the built project by double-clicking `index.html` due to the same-origin policy, so a server is required for testing.

#
## Adding modules

To add a module, create a new sub-directory in `src/` with the name of your module (preferably typed in `kebab-case` or `snake_case`), and add either an `index.js` (for classic JavaScript) or `index.ts` / `index.tsx` (for TypeScript) to it. This will be the entry point for your module, so all exported functions must be listed there.

If your module has styling associated with it, add a `.css`, `.sass`, or `.scss` file referenced by your index file. Webpack will determine that this is the 'main' stylesheet, and handle variables, includes, minifying, etc.

Exactly one module must provide a **project** entry point (as opposed to a module entry point), by assigning a value of type `function` to `window.main`. This will be detected by the bootloader (`bootstrap.js`), and executed once it's available and once all modules have been loaded.

You do **not** need to add your new module's name to any kind of registry or manifest; `webpack.config.js` will automatically scan the `src` folder for all available modules.

#
## File structure

This template, by default, is structured as follows:

- `.gitignore`: Files to be ignored by Git. Default: `package-lock.json` and `node_modules/` folder.
- `.vscode/`: Configuration for my preferred editor (Visual Studio Code)
    - `settings.json`: Currently just contains options for the Live Server plugin
- `bootstrap.js`: Custom bootstrapper; loads in module files listed in `dist/manifest.json`, waits for `window.main` to appear, then calls it
- `custom.d.ts`: Custom TypeScript typing for asset files. Default only includes stylesheets.
- `dist/`: Compiled/minified distribution files. Empty by default.
    - `assets/`: Asset files (not scripts, manifest, or stylesheets)
        - `[name].[hash].{png,jpg,svg,json,csv,...}`: Various asset files
    - `manifest.json`: Manifest containing file paths for all modules
    - `[name].bundle.js`: Bundled module file, code, development build
    - `[name].[hash].js`: Bundled module file, code, production build
    - `[name].min.css`: Bundled module file, style, development build
    - `[name].[hash].css`: Bundled module file, style, production build
- `index.html`: HTML stub to provide an environment for `bootstrap.js`
- `package-lock.json`: Used for deterministic builds by NPM and Webpack. Not included with the template due to size conerns, but generated during setup.
- `package.json`: Defines this Node package. Required to use Webpack.
- `README.md`: This file. Provides information about the project's structure.
- `src/`: Source directory. Empty by default.
    - `[name]`: Module directories
        - `index.{js,ts,tsx}`: Index/entry source file
        - `**/*.{js,ts,tsx}`: Other source files
        - `**/*.{css,sass,scss}`: Style sheet files
        - `**/*.{png,jpg,svg,json,csv,...}`: Asset files
- `tsconfig.json`: Configuration information for the TypeScript transpiler
- `webpack.config.js`: Configuration script for WebPack
