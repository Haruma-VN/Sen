namespace Sen.Script.Modules.Executable.PvZ2Chinese.RepairPvZ2COrigPath {
    export function ProcessResourceGroup<T extends Resources_Group_Structure_Template>(resource: T): void {
        for (let i: number = 0; i < resource.groups.length; ++i) {
            if ("resources" in resource.groups[i]) {
                for (let j: number = 0; j < resource.groups[i].resources.length; ++j) {
                    if ("origpath" in resource.groups[i].resources[j] && typeof resource.groups[i].resources[j].origpath === "string" && "path" in resource.groups[i].resources[j] && Array.isArray(resource.groups[i].resources[j].path)) {
                        let origpath_str: string = resource.groups[i].resources[j].origpath as string;
                        let lambda: number = undefined!;
                        for (let k: number = 0; k < resource.groups[i].resources[j].path.length; ++k) {
                            const index: number = origpath_str.indexOf(resource.groups[i].resources[j].path[k]);
                            lambda = index !== -1 ? index + resource.groups[i].resources[j].path[k].length : (lambda as number);
                            const sliced_str: string = index !== -1 ? origpath_str.slice(origpath_str.indexOf(resource.groups[i].resources[j].path[k]), lambda) : origpath_str.slice(lambda);
                            (resource.groups[i].resources[j].path[k] as string) = sliced_str;
                        }
                        delete resource.groups[i].resources[j].origpath;
                    }
                }
            }
        }
        return;
    }

    export function Evaluate(): void {
        Sen.Shell.Console.Print(null, "Provide the path to resources.json");
        const rawFile: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        const ripeFile: Resources_Group_Structure_Template = Sen.Script.Modules.FileSystem.Json.ReadJson<Resources_Group_Structure_Template>(rawFile);
        Sen.Script.Modules.Executable.PvZ2Chinese.RepairPvZ2COrigPath.ProcessResourceGroup(ripeFile);
        Sen.Script.Modules.FileSystem.Json.WriteJson(`${Sen.Shell.Path.Dirname(rawFile)}/${Sen.Shell.Path.Parse(rawFile).name_without_extension}.patch.json`, ripeFile, false);
        return;
    }
}
Sen.Script.Modules.Executable.PvZ2Chinese.RepairPvZ2COrigPath.Evaluate();
