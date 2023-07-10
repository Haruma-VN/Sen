namespace Sen.Script.Modules.Executable.Test {
    export function Evaluate(): void {
        Sen.Shell.Console.Print(null, `Script version: ${Sen.Script.ScriptVersion}`);
        Sen.Shell.Console.Print(null, `Shell version: ${Sen.Shell.ShellVersion.ShellVersion}`);
        return;
    }
}
Sen.Script.Modules.Executable.Test.Evaluate();
