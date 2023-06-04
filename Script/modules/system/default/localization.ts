namespace Sen.Script.Modules.System.Default.Localization {
    /**
     *
     * @param property - Provide property to get
     * @returns String if exists, else return property
     */
    export function GetString(property: string): string {
        return DotNetLocalization.Get(property, Path.Resolve(`${MainScriptDirectory}\\modules\\language`), "English");
    }

    /**
     *
     * @param inputString - Pass the string like Test {1} {2} {3}
     * @param replacements - Pass array ["test", "test", "t"]
     * @returns Test test test t
     */

    export function RegexReplace(inputString: string, replacements: Array<string>) {
        return inputString.replace(/\{(\d+)\}/g, (match: string, index: string) => {
            let replacementIndex: number = parseInt(index) - 1;
            return replacements[replacementIndex] || match;
        });
    }
}
