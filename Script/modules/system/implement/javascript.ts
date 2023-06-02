namespace Runtime.Script.Modules.System.Implement.JavaScript {
    /**
     *
     * @param js_string_to_evaluate - Pass JS String to Evaluate
     * @returns Finished evaluate
     */
    export function Evaluate(js_string_to_evaluate: string, source: string): void {
        try {
            JavaScriptEngine.Evaluate(js_string_to_evaluate, source);
        } catch (error: any) {
            Console.Print(error.message);
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
            Runtime.Script.Modules.System.Implement.JavaScript.Evaluate(
                Fs.ReadText(js_path, Runtime.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
                js_path,
            );
        } catch (error: any) {
            Console.Print(error.message);
        }
        return;
    }
}
