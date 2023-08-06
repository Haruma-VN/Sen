namespace Sen.Script.Modules.Executable.PvZ2Chinese.CollectTextureFormat {
    export function Execute(): void {
        const tex_fmt = new Array<int>();
        const chinese_bundle: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        Sen.Shell.FileSystem.ReadDirectory(chinese_bundle, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.AllNestedDirectory)
            .filter((e) => e.toLowerCase().endsWith("manifest.json"))
            .map((e) => Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformation>(e))
            .map((e) => {
                const composite = Object.keys(e.group);
                composite.forEach((k) => {
                    const subgroups = Object.keys(e.group[k].subgroup);
                    subgroups.forEach((m) => {
                        e.group[k].subgroup[m].packet_info.res.forEach((p) => {
                            if (p.ptx_info && p.ptx_property) {
                                tex_fmt.push(p.ptx_property.format!);
                            }
                        });
                    });
                });
            });
        new Set(tex_fmt).forEach((e) => Shell.Console.Print(null, e));
        return;
    }
}
Sen.Script.Modules.Executable.PvZ2Chinese.CollectTextureFormat.Execute();
