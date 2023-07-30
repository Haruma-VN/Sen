namespace Sen.Script.Modules.Executable.PvZ2.OrganizeResources {
    /**
     * Structure
     */
    export interface OrganizeOrder {
        slot: bigint;
        id: bigint;
        path: bigint;
        type: bigint;
        atlas: bigint;
        width: bigint;
        height: bigint;
        parent: bigint;
        ah: bigint;
        aw: bigint;
        ax: bigint;
        ay: bigint;
        cols: bigint;
        x: bigint;
        y: bigint;
        srcpath: bigint;
        runtime: bigint;
        forceOriginalVectorSymbolSize: bigint;
    }

    /**
     * Edit this to change order
     */

    export const Order: Sen.Script.Modules.Executable.PvZ2.OrganizeResources.OrganizeOrder = {
        slot: 1n,
        id: 2n,
        path: 3n,
        type: 4n,
        atlas: 5n,
        width: 6n,
        height: 7n,
        parent: 8n,
        ah: 9n,
        aw: 10n,
        ax: 11n,
        ay: 12n,
        cols: 13n,
        x: 14n,
        y: 15n,
        srcpath: 16n,
        runtime: 17n,
        forceOriginalVectorSymbolSize: 18n,
    };

    /**
     * Structure
     */

    export class OrganizeResources {
        /**
         * Organization
         */

        public organize_property: Array<string>;

        /**
         *
         * @param resource - Provide resources.json
         * @returns
         */

        public constructor(private resource: Resources_Group_Structure_Template) {
            this.organize_property = Object.keys(Sen.Script.Modules.Executable.PvZ2.OrganizeResources.Order).sort((a: string, b: string) =>
                Number((Sen.Script.Modules.Executable.PvZ2.OrganizeResources.Order as any)[a] - (Sen.Script.Modules.Executable.PvZ2.OrganizeResources.Order as any)[b])
            );
            return;
        }

        /**
         *
         * @param res - Provide res
         * @returns
         */

        private OrganizeResourceContent(res: Resource_Structure_Template): void {
            res.resources.forEach((e, i) => {
                const reorganizedObject: any = {};
                for (const prop of this.organize_property) {
                    if (e.hasOwnProperty(prop)) {
                        reorganizedObject[prop] = (e as any)[prop];
                    }
                }
                res.resources[i] = reorganizedObject;
            });
            Sen.Script.Modules.Third.JavaScript.FastSort.sort(res.resources).by([{ asc: (u) => u.id }]);
            return;
        }

        /**
         *
         * @returns Do sort
         */

        public Work(): void {
            this.resource.groups.forEach((res: any) => {
                if (`resources` in res) {
                    this.OrganizeResourceContent(res);
                }
            });
            return;
        }

        /**
         * Give resource back
         */

        public ExportResource(): Resources_Group_Structure_Template {
            return this.resource;
        }
    }

    export function Evaluate(): void {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_resources_json_path"))
        );
        const file_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        const worker: Sen.Script.Modules.Executable.PvZ2.OrganizeResources.OrganizeResources = new Sen.Script.Modules.Executable.PvZ2.OrganizeResources.OrganizeResources(
            Sen.Script.Modules.FileSystem.Json.ReadJson<Resources_Group_Structure_Template>(file_in)
        );
        worker.Work();
        Sen.Script.Modules.FileSystem.Json.WriteJson<Resources_Group_Structure_Template>(file_in.replace(/((\.json))?$/i, ".organize.json"), worker.ExportResource(), true);
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.OrganizeResources.Evaluate();
