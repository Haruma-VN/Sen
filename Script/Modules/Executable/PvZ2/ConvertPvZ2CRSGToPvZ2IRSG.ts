namespace Sen.Script.Modules.Executable.PvZ2.ConvertPvZ2ChineseResourceStreamGroupToPvZ2InternationalResourceStreamGroup {
    export function ConvertInsideRSG(file_in: string, file_out: string): void {
        const packet_directory: string = Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Dirname(file_in)}/${Sen.Shell.Path.Parse(file_in).name_without_extension}.packet`);
        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGUnpack(file_in, packet_directory);
        const information: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo>(`${packet_directory}/packet.json`);
        let count: int = 0;
        information.res.forEach((resource: Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.ResInfo) => {
            let home: string = Sen.Shell.Path.Resolve(`${packet_directory}/res`);
            create_nested_directory: for (let i: int = 0; i < (resource.path as Array<string>).length; ++i) {
                if (i === resource.path.length - 1) {
                    break create_nested_directory;
                }
                const directory: string = resource.path[i];
                home = Sen.Shell.Path.Join(home, directory);
            }
            const ptx_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(home, resource.path.at(-1) as string));
            const png_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(home, resource.path.at(-1) as string).replace(/((\.ptx))?$/i, `.png`));
            Sen.Shell.TextureHandler.Create_PVRTC1_4BPP_RGBA_Decode(ptx_path, png_path, (resource.ptx_info as any).width, (resource.ptx_info as any).height);
            Sen.Shell.FileSystem.DeleteFile(ptx_path);
            Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodePopCapPTX(png_path, ptx_path, Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ETC1_RGB_A8);
            Sen.Shell.FileSystem.DeleteFile(png_path);
            count++;
        });
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, `Execution Status: Converted ${count} PTX from PVRTC1_4BPP_RGBA to RGB_ETC1_A8`);
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, `Execution Status: Changed compression flag from 0x0${information.compression_flags} to 0x03`);
        information.compression_flags = 3;
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.PacketInfo>(`${packet_directory}/packet.json`, information);
        Sen.Script.Modules.Support.PopCap.PvZ2.RSG.Encode.RSGPack(packet_directory, file_out);
        Sen.Shell.FileSystem.DeleteDirectory([packet_directory]);
        return;
    }

    export function Evaluate(): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, `Execution Argument: Input RSG path of PvZ2C to continue`);
        const file_in: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        const output_file: string = Sen.Shell.Path.Resolve(`${Sen.Shell.Path.Dirname(file_in)}/${Sen.Shell.Path.Parse(file_in).name_without_extension}.converted.rsg`);
        Sen.Script.Modules.Interface.Arguments.ArgumentPrint(output_file, "file");
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, `Execution Set By Default: Convert PvZ2C Texture Format to RGB_ETC1_A8`);
        Sen.Script.Modules.Executable.PvZ2.ConvertPvZ2ChineseResourceStreamGroupToPvZ2InternationalResourceStreamGroup.ConvertInsideRSG(file_in, output_file);
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.ConvertPvZ2ChineseResourceStreamGroupToPvZ2InternationalResourceStreamGroup.Evaluate();
