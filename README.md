# Coywolf Meta Tags

Originally forked from [Extension Boilerplate](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate). Check there for more docs/info.

TODO: Checkout the react branch of the boiler plate extension? See: https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate/tree/react

# Notes
- This repo was updated to use Web Manifest V3, so quite a few changes were made to the manifest.json file. This upgrade also requires you to develop with `NODE_ENV=production` to avoid CSP "no unsafe eval" errors that occur in the development build. This means that during development, the hot reloader gets "full", so you will need to delete `build` every once in a while and run `yarn dev` again. Watch the `build` dir as you develop and you will see lots of `...hot-update.json` files. I am not a webpack guru and there are lots of rules around extensions, manifest, csp, etc...so just adding `NODE_ENV=production` to the `yarn dev` script was the KISS solution.