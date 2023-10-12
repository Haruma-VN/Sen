namespace Sen.Script.Modules.Executable.PvZH.CardData.Split {
    export type Definition<T> = Record<string, T>;

    export type Description = {
        version: 1n;
        cards: Array<string>;
    };

    export function Process<T>(card_data: Record<string, T>, outDirectory: string): void {
        const keys: Array<string> = Object.keys(card_data);
        const cards: string = Sen.Shell.Path.Join(outDirectory, "cards");
        Sen.Shell.FileSystem.CreateDirectory(cards);
        const description: Description = {
            version: 1n,
            cards: [],
        };
        keys.forEach((e: string) => {
            Sen.Script.Modules.FileSystem.Json.WriteJson<T>(Sen.Shell.Path.Join(cards, `${e}.json`), card_data[e], false);
            description.cards.push(e);
        });
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Executable.PvZH.CardData.Split.Description>(Sen.Shell.Path.Join(outDirectory, "description.json"), description, true);
        return;
    }

    export function Evaluate(): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, "Input cards.txt path"));
        const rawFile: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        Sen.Script.Modules.Executable.PvZH.CardData.Split.Process(
            Sen.Script.Modules.FileSystem.Json.ReadJson<Definition<any>>(rawFile),
            Sen.Shell.Path.Join(Sen.Shell.Path.Dirname(rawFile), `${Sen.Shell.Path.Parse(rawFile).name_without_extension}.card`)
        );
        return;
    }
}
Sen.Script.Modules.Executable.PvZH.CardData.Split.Evaluate();
