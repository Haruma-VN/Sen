namespace Sen.Script.Modules.Executable.PvZ2.ErasePlantLevels {
    /**
     * @todo Update this for official
     */
    export type PlantLevelsEraseDataOnly = {
        objects: Array<{
            objdata: {
                UsesLeveling?: boolean;
                LevelCoins?: Array<int>;
                LevelXP?: Array<int>;
                LevelCap?: int;
                PlantTier?: Array<int>;
            };
        }>;
    };
    /**
     *
     * @param file_in - Pass file input
     * @param file_out - Pass file output
     * @returns Erased
     */
    export function EraseLevels(file_in: string, file_out: string): void {
        const deserialize_json: Sen.Script.Modules.Executable.PvZ2.ErasePlantLevels.PlantLevelsEraseDataOnly = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Executable.PvZ2.ErasePlantLevels.PlantLevelsEraseDataOnly>(file_in);
        for (let obj of deserialize_json.objects) {
            obj.objdata.LevelCap = 1;
            obj.objdata.LevelCoins = [];
            obj.objdata.LevelXP = [];
            obj.objdata.UsesLeveling = false;
            if (`PlantTier` in obj.objdata) {
                (obj.objdata.PlantTier as Array<int>).length = 1;
            }
        }
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Executable.PvZ2.ErasePlantLevels.PlantLevelsEraseDataOnly>(file_out, deserialize_json);
        return;
    }

    /**
     *
     * @returns Evaluate
     */

    export function Evaluate(): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Execution Argument: Input json path to continue`);
        const file_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        Sen.Script.Modules.Executable.PvZ2.ErasePlantLevels.EraseLevels(file_in, file_in.replace(/((\.json))?$/i, ".patch.json"));
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.ErasePlantLevels.Evaluate();
