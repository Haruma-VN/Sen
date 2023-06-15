# About

`modules` is the main modules loaded by the `Script`, which control the flows of the tool.

## Usage

If you wish to hook an implementation of `Script`, you should read `dotnet.d.ts` first and maybe get some example how the `Shell` and `Script` works.

Additional:

-   `link.bat/link.sh`: In general, `tsc` does not brings `json`, `xml`, `lua` with the transpiled code, so it is recommended to use them to compile to brings additionals along.

-   `language`: By default, the tool set language to `English`. You can hook a new language to the tool by creating a copy of `English.json` and start translating it, and if you could, please do a pull request to this project to help me obtaining it. If you want to change to your own language, `/modules/customization/entry.json` and change language to your language.

-   `functions`: By default, you can `Add`, `Remove`, `Edit` any existed functions are listed in the `script` through `/modules/customization/functions.json`. You can get example through looking other method, should be very simple.
