namespace Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle {
    /**
     * Bundle List Structure
     */
    export class BundleList {
        /**
         * argument
         */
        private _argument: Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure>;

        public constructor() {
            this._argument = {};
            return;
        }

        /**
         * getter
         */

        get argument(): Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure> {
            return this._argument;
        }

        /**
         * setter
         */

        public AppendArgument(key: string, str: Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure): void {
            this._argument[key] = str;
            return;
        }

        /**
         *
         * @param index - Pass index to delete
         * @returns
         */

        public DeleteArgument(key: string): void {
            delete this._argument[key];
            return;
        }

        /**
         * Print arguments
         * @returns
         */

        public PrintArgument(): void {
            Object.keys(this._argument).forEach((arg: string, index: int) => {
                Sen.Shell.Console.Printf(null, `        ${index + 1}. ${arg}`);
            });
            return;
        }
    }

    /**
     * Structure
     */

    export interface Option {
        int_bundle: string;
        cn_bundle: string;
    }

    /**
     *
     * @param option - pass option
     */

    export function Watch(option: Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.Option): Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure> {
        const bundle_list = new Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.BundleList();
        const chinese_manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(Sen.Shell.Path.Join(option.cn_bundle, `manifest.json`));
        const chinese_groups: Array<string> = Object.keys(chinese_manifest.group);
        const available: Array<int> = new Array();
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Execution Argument: Choose 1 or more group that displayed, click enter to finish...`);
        chinese_groups.forEach((group: string, index: int) => {
            const valid_option: int = index + 1;
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `        ${valid_option}. ${group}`);
            available.push(valid_option);
        });
        let input: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (input !== "") {
            if (available.includes(parseInt(input))) {
                const data: Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure = chinese_manifest.group[chinese_groups[available[parseInt(input)] - 2]] as any & Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure;
                bundle_list.AppendArgument(chinese_groups[available[parseInt(input)] - 2], data);
            } else {
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, `Execution Failed: Please Reinput`);
            }
            input = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, `Execution Finish: These are what you decided to add, confirm`);
        bundle_list.PrintArgument();
        const confirm: boolean = Boolean(Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputBoolean(`Would you like to confirm?`));
        if (!confirm) {
            // request implementation
        }
        return bundle_list.argument;
    }

    /**
     *
     * @returns Evaluate
     */

    export function Evaluate(): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Execution Argument: Input international bundle to continue...`);
        const international_bundle: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Execution Argument: Input chinese bundle to continue...`);
        const chinese_bundle: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        const argument: Record<string, Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure> = Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.Watch({
            int_bundle: international_bundle,
            cn_bundle: chinese_bundle,
        });
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle.Evaluate();
