namespace Sen.Script.Modules.Extension.PvZ2.ErasePlantLevels {
    /**
     * @todo Update this for official
     */
    export type PlantLevelsEraseDataOnly = {
        objects: Array<{
            objdata: {
                UsesLeveling?: boolean;
                LevelCoins?: Array<int>;
                LevelXp?: Array<int>;
                LevelCap?: Array<int>;
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
        const deserialize_json: Sen.Script.Modules.Extension.PvZ2.ErasePlantLevels.PlantLevelsEraseDataOnly =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Extension.PvZ2.ErasePlantLevels.PlantLevelsEraseDataOnly>(
                file_in,
            );
        for (let obj of deserialize_json.objects) {
            obj.objdata.LevelCap = [];
            obj.objdata.LevelCoins = [];
            obj.objdata.LevelXp = [];
            obj.objdata.UsesLeveling = false;
        }
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Extension.PvZ2.ErasePlantLevels.PlantLevelsEraseDataOnly>(
            file_out,
            deserialize_json,
        );
        return;
    }

    /**
     *
     * @returns Evaluate
     */

    export function Evaluate(): void {
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            `Execution Argument: Input json path to continue`,
        );
        const file_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        Sen.Script.Modules.Extension.PvZ2.ErasePlantLevels.EraseLevels(
            file_in,
            file_in.replace(/((\.json))?$/i, ".patch.json"),
        );
        return;
    }
}

Sen.Script.Modules.Extension.PvZ2.ErasePlantLevels.Evaluate();
