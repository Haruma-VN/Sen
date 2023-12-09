namespace Sen.Script.Modules.Executable.PvZ2.MergeWorldMapData {
    /**
     *
     * @param source_directory - source directory
     * @returns
     */

    export function merge_fs(source_directory: string): Sen.Script.Modules.Executable.PvZ2.SplitWorldMapData.WorldMapData {
        const result: Sen.Script.Modules.Executable.PvZ2.SplitWorldMapData.WorldMapData = {
            version: 1,
            objects: [],
        };
        const definition: Sen.Script.Modules.Executable.PvZ2.SplitWorldMapData.Definition = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Executable.PvZ2.SplitWorldMapData.Definition>(
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(source_directory, "map_list.json"))
        );
        for (const map_name of Object.keys(definition.objects)) {
            const data = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Executable.PvZ2.SplitWorldMapData.Object>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(source_directory, "worldmap", `${map_name}.json`)));
            data.objdata.m_worldName = map_name;
            data.objdata.m_resGroupID = definition.objects[map_name].m_resGroupID;
            data.objdata.m_worldId = definition.objects[map_name].m_worldId;
            result.objects.push(data);
        }
        return result;
    }

    /**
     * Evaluate method
     * @returns
     */

    export function Evaluate(): void {
        Sen.Script.Modules.System.Implement.JavaScript.EvaluatePrint(Sen.Script.Modules.System.Default.Localization.GetString("evaluate_fs"), Sen.Script.Modules.System.Default.Localization.GetString("merge_worldmap_data"));
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_worldmap_data_directory"))
        );
        const directory_source: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Executable.PvZ2.SplitWorldMapData.WorldMapData>(
            Sen.Shell.Path.Join(Sen.Shell.Path.Dirname(directory_source), "WorldMapData.json"),
            Sen.Script.Modules.Executable.PvZ2.MergeWorldMapData.merge_fs(directory_source),
            false,
            "\t"
        );
        return;
    }
}
Sen.Script.Modules.Executable.PvZ2.MergeWorldMapData.Evaluate();
