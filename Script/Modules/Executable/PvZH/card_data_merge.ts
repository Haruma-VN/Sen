namespace Sen.Script.Modules.Executable.PvZH.CardData.Merge {
    export type Definition<T> = Record<string, T>;

    export type Description = {
        version: 1n;
        cards: Array<string>;
    };

    export function Process<T>(inDirectory: string, outData: Definition<T>): void {
        const description: Description = Sen.Script.Modules.FileSystem.Json.ReadJson<Description>(Sen.Shell.Path.Join(inDirectory, "description.json"));
        const cards = Sen.Shell.Path.Join(inDirectory, "cards");
        description.cards.forEach((e) => {
            outData[e] = Sen.Script.Modules.FileSystem.Json.ReadJson<T>(Sen.Shell.Path.Join(cards, `${e}.json`));
        });
        return;
    }

    export function Evaluate(): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, "Input splitted cards.txt path"));
        const rawDirectory: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        const map: Definition<any> = {};
        Sen.Script.Modules.Executable.PvZH.CardData.Merge.Process<any>(rawDirectory, map);
        Sen.Script.Modules.FileSystem.Json.WriteJson<Definition<any>>(Sen.Shell.Path.Join(Sen.Shell.Path.Dirname(rawDirectory), "cards.txt"), map, false);
        return;
    }
}
Sen.Script.Modules.Executable.PvZH.CardData.Merge.Evaluate();
