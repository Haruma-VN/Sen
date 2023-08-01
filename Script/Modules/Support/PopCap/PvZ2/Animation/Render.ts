namespace Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Render {
    /**
     * Structure
     */

    export interface PopcapAnimationRenderMethodJson {
        frame_name: string;
        append_width: int;
        append_height: int;
        image_position_append_x: int;
        image_position_append_y: int;
        disable_all_sprites: string | boolean;
    }

    /**
     *
     * @param pam_json - Deserialize pam json
     * @param sprites_to_disable - Sprite to disable list
     * @param use_media_images_by_path - Use media by path property?
     * @returns
     */

    export function LoadAnimationSpirte(pam_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson, sprites_to_disable: Array<int>, use_media_images_by_path: boolean): void {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("all_sprites_loaded"))
        );
        for (let i = 0; i < pam_json.sprite.length; i++) {
            const source_sprite_list: Array<string> = new Array();
            for (let k = 0; k < pam_json.sprite[i].frame![0].append!.length; k++) {
                const resource_index: int = pam_json.sprite[i].frame![0].append![k].resource;
                if (pam_json.sprite[i].frame![0].append![k].sprite) {
                    const sprite_number: string = `sprite_${resource_index + 1}`;
                    source_sprite_list.push(sprite_number);
                } else {
                    const image_name: string = use_media_images_by_path ? pam_json.image[resource_index].name!.split("|")[0] : pam_json.image[resource_index].name!.split("|")[1];
                    source_sprite_list.push(`${image_name}.png`);
                }
            }
            const sprite_name: string = pam_json.sprite[i].name!;
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `      "${i + 1}": ${sprite_name} | source: ${source_sprite_list.join(`, `)}`);
        }
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan, Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, ``));
        Sen.Shell.Console.Printf(null, `    ${Sen.Script.Modules.System.Default.Localization.GetString("enter_number_of_sprite_to_disable")}`);
        InputSprite(sprites_to_disable, pam_json.sprite.length);
        return;
    }

    /**
     *
     * @param sprites_to_disable - Sprite to disable list
     * @param sprite_length - Length of sprite
     * @returns
     */

    export function InputSprite(sprites_to_disable: Array<int>, sprite_length: int): void {
        let input: int = -1;
        while (input != 0) {
            input = parseInt(Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan));
            while (input < 0 || input > sprite_length) {
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(/\{\}/g, `${input}`))}`
                ),
                    (input = parseInt(Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan)));
            }
            while (sprites_to_disable.includes(input)) {
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                    `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("sprite_already_selected"))}`
                ),
                    (input = parseInt(Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan)));
            }
            sprites_to_disable.push(input);
        }
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("command_executed_success"))
        );
        return;
    }

    /**
     *
     * @param pam_json - Deserialize pam json
     * @param use_media_images_by_path - Use path property?
     * @returns
     */

    export function LoadSetting(pam_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson, use_media_images_by_path: boolean): Sen.Shell.AnimationHelperSetting {
        const default_setting_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation_render.json`));
        const animation_render_method_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Render.PopcapAnimationRenderMethodJson =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Render.PopcapAnimationRenderMethodJson>(default_setting_path);
        const sprites_to_disable: Array<int> = new Array<int>();
        const method: 1 | 2 | 3 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
            Sen.Script.Modules.System.Default.Localization.GetString("animation_render_disable_sprite_method"),
            [1, 2, 3],
            {
                "1": [Sen.Script.Modules.System.Default.Localization.GetString("enable_all_sprites"), Sen.Script.Modules.System.Default.Localization.GetString("enable_all_sprites")],
                "2": [Sen.Script.Modules.System.Default.Localization.GetString("disable_all_sprites"), Sen.Script.Modules.System.Default.Localization.GetString("disable_all_sprites")],
                "3": [Sen.Script.Modules.System.Default.Localization.GetString("choose_sprite_to_disable"), Sen.Script.Modules.System.Default.Localization.GetString("choose_sprite_to_disable")],
            },
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation_render.json`)),
            `disable_all_sprites`
        ) as 1 | 2 | 3;
        switch (method) {
            case 1:
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                    Sen.Script.Modules.System.Default.Localization.GetString("execution_loaded").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("enable_all_sprites"))
                );
                sprites_to_disable.push(0);
                break;
            case 2:
                Sen.Shell.Console.Print(
                    Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
                    Sen.Script.Modules.System.Default.Localization.GetString("execution_loaded").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("disable_all_sprites"))
                );
                for (let i: int = 0; i <= pam_json.sprite.length; i++) {
                    sprites_to_disable.push(i);
                }
                break;
            case 3:
                Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Render.LoadAnimationSpirte(pam_json, sprites_to_disable, use_media_images_by_path);
                let sprite_selected: string = ``;
                for (let i: int = 0; i < sprites_to_disable.length - 1; i++) {
                    sprite_selected += `${sprites_to_disable[i]} `;
                }
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, `${Sen.Script.Modules.System.Default.Localization.GetString("animation_render_disable_sprite_method")}: ${sprite_selected}`);
                break;
        }
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green,
            Sen.Script.Modules.System.Default.Localization.GetString("output_frame_name_set_as_default").replace(/\{\}/g, animation_render_method_json.frame_name)
        );
        const append_width: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
            Sen.Script.Modules.System.Default.Localization.GetString("append_width_input"),
            [],
            {},
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation_render.json`)),
            `append_width`
        ) as int;
        const append_height: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
            Sen.Script.Modules.System.Default.Localization.GetString("append_height_input"),
            [],
            {},
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation_render.json`)),
            `append_height`
        ) as int;
        const image_position_append_x: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
            Sen.Script.Modules.System.Default.Localization.GetString("posx_input"),
            [],
            {},
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation_render.json`)),
            `image_position_append_x`
        ) as int;
        const image_position_append_y: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
            Sen.Script.Modules.System.Default.Localization.GetString("posy_input"),
            [],
            {},
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation_render.json`)),
            `image_position_append_y`
        ) as int;
        const output_animation_render: 1 | 2 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
            Sen.Script.Modules.System.Default.Localization.GetString("output_animation_render"),
            [1, 2, 3],
            {
                "1": [Sen.Script.Modules.System.Default.Localization.GetString("output_animation_render_image"), Sen.Script.Modules.System.Default.Localization.GetString("output_animation_render_image")],
                "2": [Sen.Script.Modules.System.Default.Localization.GetString("output_animation_render_gif"), Sen.Script.Modules.System.Default.Localization.GetString("output_animation_render_gif")],
                "3": [Sen.Script.Modules.System.Default.Localization.GetString("output_animation_render_apng"), Sen.Script.Modules.System.Default.Localization.GetString("output_animation_render_apng")],
            },
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation_render.json`)),
            `output_file_type`
        ) as 1 | 2;
        const animation_setting: Sen.Shell.AnimationHelperSetting = {
            frameName: animation_render_method_json.frame_name,
            imageByPath: use_media_images_by_path,
            appendWidth: append_width,
            appendHeight: append_height,
            posX: image_position_append_x,
            posY: image_position_append_y,
            disableSprite: sprites_to_disable,
            output_animation_render: BigInt(output_animation_render),
        };
        return animation_setting;
    }

    /**
     *
     * @param file_input - Pass file
     * @param out_folder - Out dir
     * @returns
     */

    export function GenerateImageSequence(file_input: string, out_folder: string): void {
        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(file_input));
        const pam_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(file_input);
        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(pam_json);
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("provide_sprite_directory"))
        );
        const split_sprited_folder: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        const media_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${split_sprited_folder}`, `media`));
        if (!Sen.Shell.FileSystem.DirectoryExists(media_path)) {
            throw new Sen.Script.Modules.Exceptions.MissingDirectory(`${Sen.Script.Modules.System.Default.Localization.GetString(`no_such_directory`).replace(/\{\}/g, Sen.Shell.Path.GetFileName(media_path))}`, media_path);
        }
        const atlas_json_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${split_sprited_folder}`, `atlas.json`));
        if (!Sen.Shell.FileSystem.FileExists(atlas_json_path)) {
            throw new Sen.Script.Modules.Exceptions.MissingFile(`${Sen.Script.Modules.System.Default.Localization.GetString(`no_such_file`).replace(/\{\}/g, Sen.Shell.Path.GetFileName(atlas_json_path))}`, atlas_json_path);
        }
        const atlas_json: Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson>(
            atlas_json_path
        ) satisfies Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson;
        const use_media_images_by_path: boolean = (atlas_json.method as string) === `path`;
        const setting: Sen.Shell.AnimationHelperSetting = Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Render.LoadSetting(pam_json, use_media_images_by_path);
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.DarkGreen, Sen.Script.Modules.System.Default.Localization.GetString("please_wait_for_few_minutes_to_finish_conversion"));
        Sen.Script.Modules.FileSystem.Json.WriteJson<Record<string, [bigint, bigint]>>(
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(out_folder, `anim.json`)),
            Sen.Shell.PvZ2Shell.GenerateImageSequence(file_input, Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(out_folder, `frames`)), media_path, setting),
            false
        );
        switch (BigInt(setting.output_animation_render)) {
            case 1n: {
                break;
            }
            case 2n: {
                const option: Record<"input_path" | "output_path", string> = {
                    input_path: Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(out_folder, `frames`)),
                    output_path: Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(out_folder, `${Sen.Shell.Path.Parse(file_input).name_without_extension}.gif`)),
                };
                Sen.Script.Modules.Interface.Arguments.ArgumentPrint(option.output_path, "file");
                const frames: Array<string> = Sen.Shell.FileSystem.ReadDirectory(option.input_path, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.OnlyCurrentDirectory)
                    .filter((argument: string) => argument.toLowerCase().endsWith(`.png`))
                    .sort((a: string, b: string) => parseInt(a) - parseInt(b));
                Sen.Shell.DotNetBitmap.ExportAnimatedGif({
                    width: BigInt(Sen.Shell.DotNetBitmap.GetDimension(frames[0])!.width as unknown as number),
                    height: BigInt(Sen.Shell.DotNetBitmap.GetDimension(frames[0])!.height as unknown as number),
                    images: frames,
                    outputPath: option.output_path,
                    frame_delay: 0n,
                });
                break;
            }
            case 3n: {
                const option: Record<"input_path" | "output_path", string> = {
                    input_path: Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(out_folder, `frames`)),
                    output_path: Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(out_folder, `${Sen.Shell.Path.Parse(file_input).name_without_extension}.apng`)),
                };
                Sen.Script.Modules.Interface.Arguments.ArgumentPrint(option.output_path, "file");
                const frames: Array<string> = Sen.Shell.FileSystem.ReadDirectory(option.input_path, Sen.Script.Modules.FileSystem.Constraints.ReadDirectory.OnlyCurrentDirectory)
                    .filter((argument: string) => argument.toLowerCase().endsWith(`.png`))
                    .sort((a: string, b: string) => parseInt(a) - parseInt(b));
                Sen.Shell.DotNetBitmap.CreateAPNG({
                    imageList: frames,
                    outFile: option.output_path,
                    framesPerSecond: 30n,
                });
                break;
            }
        }
        return;
    }
}
