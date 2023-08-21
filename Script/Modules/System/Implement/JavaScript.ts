namespace Sen.Script.Modules.System.Implement.JavaScript {
    /**
     *
     * @param js_string_to_evaluate - Pass JS String to Evaluate
     * @returns Finished evaluate
     */
    export function Evaluate(js_string_to_evaluate: string, source: string): void {
        try {
            Sen.Shell.JavaScriptCoreEngine.Evaluate(js_string_to_evaluate, source);
        } catch (error: unknown) {
            throw new Sen.Script.Modules.Exceptions.RuntimeError((error as Error).message, source);
        }
        return;
    }

    /**
     *
     * @param js_path - Pass ".js" script to the tool
     * @returns Finish evaluate
     */

    export function JSEvaluate(js_path: string): void {
        try {
            Sen.Script.Modules.System.Implement.JavaScript.Evaluate(Sen.Shell.FileSystem.ReadText(js_path, Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8), js_path);
        } catch (error: any) {
            throw new Sen.Script.Modules.Exceptions.RuntimeError((error as Error).message, js_path);
        }
        return;
    }

    /**
     *
     * @param js_path - Pass the path to require in this project
     * @returns Evaluate that
     */

    export function Require(js_path: string): void {
        while (js_path.startsWith(`.`) || js_path.startsWith(`/`)) {
            js_path = js_path.substring(1, js_path.length);
        }
        Sen.Script.Modules.System.Implement.JavaScript.JSEvaluate(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `${js_path}`)));
        return;
    }

    /**
     *
     * @param title - Pass title
     * @param description - Description
     * @returns
     */

    export function EvaluatePrint(title: string, description: string): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, title);
        Sen.Shell.Console.Printf(null, `      ${description}`);
        return;
    }
}
