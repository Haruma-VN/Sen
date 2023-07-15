namespace Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Render {
    // AnimationRenderMethodJson
    export interface PopcapAnimationRenderMethodJson {
        frame_name: string,
        use_media_images_by_path: boolean,
        append_width: int,
        append_height: int,
        image_position_append_x: int,
        image_position_append_y: int,
        disable_all_sprites: string | boolean
    }

    export function LoadAnimationSpirte(pam_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson, sprites_to_disable: Array<int>, use_media_images_by_path: boolean): void {
        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("all_functions_loaded")));
        for (let i = 0; i < pam_json.sprite.length; i++) {
            const image_name: string = use_media_images_by_path ? pam_json.image[i].name!.split("|")[0] : pam_json.image[i].name!.split("|")[1];
            const sprite_name: string = pam_json.sprite[i].name!;
            Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `"${i}": ${sprite_name} | Source: ${image_name}.png`);
        }
        InputSprite(sprites_to_disable, pam_json.sprite.length);
    }

    export function InputSprite(sprites_to_disable: Array<int>, sprite_length: int) {
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, `Enter the number of sprite you want to disable, enter "0" to finish`)
        );
        let input: int = parseInt(Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan));
        while (input < 0 && input > sprite_length) {
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(/\{\}/g, `${input}`))}`
            ),
                (input = parseInt(Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan)));
        }
        if (input == 0) {
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("execution_status").replace(/\{\}/g, `OK`));
            let sprite_selected: string = ``;
            for (let i = 0; i < sprites_to_disable.length; i++) {
                sprite_selected += `${sprites_to_disable[i]} `;
            }
            Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.White, `Selected sprites are: ${sprite_selected}`);
        }
        while (sprites_to_disable.includes(input)) {
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, `Sprite is selected before`)}`
            ),
                (input = parseInt(Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan)));
        }
        sprites_to_disable.push(input);
        InputSprite(sprites_to_disable, sprite_length);
    }

    export function LoadSetting(pam_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson, use_media_images_by_path: boolean): Shell.AnimationHelperSetting {
        const default_setting_path: string = Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `methods`, `popcap_animation_render.json`));
        const animation_render_method_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Render.PopcapAnimationRenderMethodJson = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Render.PopcapAnimationRenderMethodJson>(default_setting_path);
        const sprites_to_disable: Array<int> = new Array();
        const method: 1 | 2 | 3 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
            Sen.Script.Modules.System.Default.Localization.GetString("popcap_official_resource_path_convert"),
            [1, 2, 3],
            {
                "1": [Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_array"), Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_array")],
                "2": [Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_string"), Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_string")],
                "3": [Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_string"), Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_string")],
            },
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `methods`, `popcap_animation_render.json`)),
            `disable_all_sprites`
        ) as 1 | 2 | 3;
        switch (method) {
            case 1:
                for (var i = 0; i <= pam_json.image.length; i++) {
                    sprites_to_disable.push(i);
                }
                break;
            case 2:
                sprites_to_disable.push(0);
                break;
            case 3:
                LoadAnimationSpirte(pam_json, sprites_to_disable, use_media_images_by_path);
                break;
        }
        const animation_setting: Shell.AnimationHelperSetting = {
            frameName: animation_render_method_json.frame_name,
            imageByPath: use_media_images_by_path,
            appendWidth: animation_render_method_json.append_width,
            appendHeight: animation_render_method_json.append_height,
            posX: animation_render_method_json.image_position_append_x,
            posY: animation_render_method_json.image_position_append_y,
            disableSprite: sprites_to_disable
        }
        return animation_setting;
    }

    export function GenerateImageSequence(file_input: string, out_folder: string): void {
        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(file_input));
        const pam_json: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.SexyAppFrameworkAnimationPamJson>(file_input);
        Sen.Script.Modules.Support.PopCap.PvZ2.Animation.CheckPamJson(pam_json);
        const mediaFolder: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        const use_media_images_by_path: boolean = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
            Sen.Script.Modules.System.Default.Localization.GetString("popcap_official_resource_path_convert"),
            [1, 2],
            {
                "1": [Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_array"), Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_array")],
                "2": [Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_string"), Sen.Script.Modules.System.Default.Localization.GetString("convert_resources_path_to_string")],
            },
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `methods`, `popcap_animation_render.json`)),
            `use_media_images_by_path`
        ) as 1 | 2 == 2 ? true : false;
        const setting: Shell.AnimationHelperSetting = LoadSetting(pam_json, use_media_images_by_path);
        Sen.Shell.PvZ2Shell.GenerateImageSequence(file_input, out_folder, mediaFolder, setting);
        return;
    }
}