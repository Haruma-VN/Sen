namespace Sen.Script.Modules.Executable.PvZ2.CloneAnimateContent {
    /**
     * Structure
     */

    export enum SelectionQuery {
        ink = 1,
        butter,
        costume,
        unknown,
    }

    export class Clone {
        public constructor(private xfl_path: string, private resolution: int) {
            return;
        }

        public Input(): SelectionQuery {
            return Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(
                Sen.Script.Modules.System.Default.Localization.GetString("select_method"),
                [SelectionQuery.ink, SelectionQuery.butter, SelectionQuery.costume, SelectionQuery.unknown],
                {
                    "1": [Sen.Script.Modules.System.Default.Localization.GetString("ink"), Sen.Script.Modules.System.Default.Localization.GetString("ink")],
                    "2": [Sen.Script.Modules.System.Default.Localization.GetString("butter"), Sen.Script.Modules.System.Default.Localization.GetString("butter")],
                    "3": [Sen.Script.Modules.System.Default.Localization.GetString("costume"), Sen.Script.Modules.System.Default.Localization.GetString("costume")],
                    "4": [Sen.Script.Modules.System.Default.Localization.GetString("unknown"), Sen.Script.Modules.System.Default.Localization.GetString("unknown")],
                }
            ) as SelectionQuery;
        }

        public Ink(): void {
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_more_that_path").replace(/\{\}/g, "png"))
            );
            const png_argument: Array<string> = new Array();
            assert_argument: while (true) {
                let arg: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
                if (arg.endsWith(` `)) {
                    arg = arg.slice(0, -1);
                }
                if ((arg.startsWith(`"`) && arg.endsWith(`"`)) || (arg.startsWith(`'`) && arg.endsWith(`'`))) {
                    arg = arg.slice(1, -1);
                }
                if (Sen.Shell.FileSystem.FileExists(arg) && /((\.png))$/i.test(arg)) {
                    png_argument.push(arg);
                    break assert_argument;
                } else {
                    Sen.Shell.Console.Print(
                        Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                        Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("file_assert_is_not").replace(/\{\}/g, "png"))
                    );
                }
            }
            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.AddImageToAnimationAdobeFlash(png_argument, this.xfl_path, this.resolution, {
                generate_sprite: "new",
                sprite_name: "",
            });
            const import_type: 1 | 2 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(Sen.Script.Modules.System.Default.Localization.GetString("costume_import_type"), [1, 2], {
                "1": [Sen.Script.Modules.System.Default.Localization.GetString("find_custom_and_import"), Sen.Script.Modules.System.Default.Localization.GetString("find_custom_and_import")],
                "2": [Sen.Script.Modules.System.Default.Localization.GetString("generate_new_custom"), Sen.Script.Modules.System.Default.Localization.GetString("generate_new_custom")],
            }) as 1 | 2;
            const struct = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser>(Sen.Shell.Path.Join(this.xfl_path, `struct.json`));
            const m_list: Array<[string, string]> = Object.entries(struct.sprite);
            return;
        }

        public Butter(): void {
            return;
        }

        public Costume(): void {
            Sen.Shell.Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_more_that_path").replace(/\{\}/g, "png"))
            );
            const png_argument: Array<string> = new Array();
            assert_argument: while (true) {
                let arg: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
                if (arg.endsWith(` `)) {
                    arg = arg.slice(0, -1);
                }
                if ((arg.startsWith(`"`) && arg.endsWith(`"`)) || (arg.startsWith(`'`) && arg.endsWith(`'`))) {
                    arg = arg.slice(1, -1);
                }
                if (Sen.Shell.FileSystem.FileExists(arg) && /((\.png))$/i.test(arg)) {
                    png_argument.push(arg);
                    break assert_argument;
                } else {
                    Sen.Shell.Console.Print(
                        Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                        Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("file_assert_is_not").replace(/\{\}/g, "png"))
                    );
                }
            }
            Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.AddImageToAnimationAdobeFlash(png_argument, this.xfl_path, this.resolution, {
                generate_sprite: "new",
                sprite_name: "",
            });
            const import_type: 1 | 2 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(Sen.Script.Modules.System.Default.Localization.GetString("costume_import_type"), [1, 2], {
                "1": [Sen.Script.Modules.System.Default.Localization.GetString("find_custom_and_import"), Sen.Script.Modules.System.Default.Localization.GetString("find_custom_and_import")],
                "2": [Sen.Script.Modules.System.Default.Localization.GetString("generate_new_custom"), Sen.Script.Modules.System.Default.Localization.GetString("generate_new_custom")],
            }) as 1 | 2;
            const struct = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser>(Sen.Shell.Path.Join(this.xfl_path, `struct.json`));
            const m_list: Array<[string, string]> = Object.entries(struct.sprite);
            switch (import_type) {
                case 1: {
                    //#region _custom
                    let k_find: string = "";
                    finder: for (let i = 0; i < m_list.length; ++i) {
                        if (m_list[i][1] === "_custom") {
                            k_find = m_list[i][0];
                            break finder;
                        }
                    }
                    if (k_find === "") {
                        throw new Error(Sen.Script.Modules.System.Default.Localization.GetString("does_not_find_custom"));
                    }
                    const xml_path: string = Sen.Shell.Path.Join(this.xfl_path, `library`, `sprite`, `${k_find}.xml`);
                    const sprite_n: Sen.Script.Modules.Implement.XML.Sprite = Sen.Script.Modules.Implement.XML.ReadXML(xml_path);
                    const dom = sprite_n.DOMSymbolItem.timeline.DOMTimeline.layers.DOMLayer;
                    dom.unshift({
                        "@name": `${dom.length}`,
                        frames: {
                            DOMFrame: {
                                "@index": "0",
                                "@duration": "1",
                                elements: {
                                    DOMSymbolInstance: {
                                        "@libraryItemName": `sprite/${m_list.at(-1)!.at(0)!}`,
                                        "@symbolType": "graphic",
                                        "@loop": "loop",
                                        "@firstFrame": "0",
                                        matrix: {
                                            Matrix: {
                                                "@a": "1.000000",
                                                "@b": "0.000000",
                                                "@c": "0.000000",
                                                "@d": "1.000000",
                                                "@tx": "0.000000",
                                                "@ty": "20.200000",
                                            },
                                        },
                                        color: {
                                            Color: {
                                                "@redMultiplier": "1.000000",
                                                "@greenMultiplier": "1.000000",
                                                "@blueMultiplier": "1.000000",
                                                "@alphaMultiplier": "1.000000",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                    Sen.Script.Modules.Implement.XML.WriteXML(xml_path, sprite_n, false);
                    Sen.Shell.Console.Print(Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("success_apply_to_sprite").replace(/\{\}/g, k_find));
                    break;
                    //#endregion
                }
                case 2: {
                    //#region self
                    const import_k: 1 | 2 = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputArgument.InputInteger(Sen.Script.Modules.System.Default.Localization.GetString("select_method"), [1, 2], {
                        "1": [Sen.Script.Modules.System.Default.Localization.GetString("sprite"), Sen.Script.Modules.System.Default.Localization.GetString("sprite")],
                        "2": [Sen.Script.Modules.System.Default.Localization.GetString("image"), Sen.Script.Modules.System.Default.Localization.GetString("image")],
                    }) as 1 | 2;
                    let k_find: string;
                    switch (import_k) {
                        case 1: {
                            Sen.Shell.Console.Print(
                                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                                Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_sprite"))
                            );
                            const available: Array<int> = new Array<int>();
                            const k_exp: Array<[string, string]> = Object.entries(struct.sprite);
                            k_exp.forEach((k_data, m_index) => {
                                Sen.Shell.Console.Printf(null, `      ${m_index + 1}. ${k_data}`);
                                available.push(m_index + 1);
                            });
                            let input: string = Sen.Shell.Console.Input(Platform.Constraints.ConsoleColor.Cyan);
                            while (!available.includes(parseInt(input))) {
                                Sen.Shell.Console.Printf(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(/\{\}/g, `${input}`));
                                input = Sen.Shell.Console.Input(Platform.Constraints.ConsoleColor.Cyan);
                            }
                            k_find = k_exp[parseInt(input) - 1][0];
                            break;
                        }
                        case 2: {
                            Sen.Shell.Console.Print(
                                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                                Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_image"))
                            );
                            const available: Array<int> = new Array<int>();
                            const k_exp: Array<
                                [
                                    string,
                                    {
                                        name: string;
                                        width: int;
                                        height: int;
                                    }
                                ]
                            > = Object.entries(struct.image);
                            k_exp.forEach((k_data, m_index) => {
                                Sen.Shell.Console.Printf(null, `      ${m_index + 1}. ${k_data}`);
                                available.push(m_index + 1);
                            });
                            let input: string = Sen.Shell.Console.Input(Platform.Constraints.ConsoleColor.Cyan);
                            while (!available.includes(parseInt(input))) {
                                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red, Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(/\{\}/g, `${input}`));
                                input = Sen.Shell.Console.Input(Platform.Constraints.ConsoleColor.Cyan);
                            }
                            k_find = k_exp[parseInt(input) - 1][0];
                            break;
                        }
                    }
                    const xml_path: string = Sen.Shell.Path.Join(this.xfl_path, `library`, `main.xml`);
                    const main: Sen.Script.Modules.Implement.XML.Sprite = Sen.Script.Modules.Implement.XML.ReadXML(xml_path);
                    const layer = main.DOMSymbolItem.timeline.DOMTimeline.layers.DOMLayer;
                    const m_finder = layer.filter((e) => {
                        if (Array.isArray(e.frames.DOMFrame as unknown as Array<any>)) {
                            return (e.frames.DOMFrame as unknown as Array<any>).some((m) => m.elements !== null && m.elements.DOMSymbolInstance[`@libraryItemName`].includes(k_find));
                        }
                        return false;
                    });
                    m_finder.forEach((e) => {
                        const m_data = JSON.parse(JSON.stringify(e));
                        m_data["@name"] = `${layer.length}`;
                        if (Array.isArray(m_data.frames.DOMFrame)) {
                            m_data.frames.DOMFrame.forEach((m: any) => {
                                if (m.elements !== null) {
                                    m.elements.DOMSymbolInstance[`@libraryItemName`] = import_k === 1 ? `sprite/${m_list.at(-1)!.at(0)!}` : `image/${m_list.at(-1)!.at(0)!}`;
                                }
                            });
                        }
                        layer.unshift(m_data);
                    });
                    Sen.Script.Modules.Implement.XML.WriteXML(xml_path, main, false);
                    Sen.Shell.Console.Print(Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("success_apply_to_sprite").replace(/\{\}/g, k_find));
                    break;
                    //#endregion
                }
            }
            return;
        }

        public Unknown(): void {
            return;
        }
    }

    export function Evaluate(): void {
        Sen.Script.Modules.System.Implement.JavaScript.EvaluatePrint(Sen.Script.Modules.System.Default.Localization.GetString("evaluate_fs"), Sen.Script.Modules.System.Default.Localization.GetString("animation_helper_clone_content"));
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_flash_project"))
        );
        const arg: string = Sen.Script.Modules.Interface.Arguments.InputPath("directory");
        const resolution: int = Sen.Script.Modules.Support.PopCap.PvZ2.Argument.Input.InputTextureResolution(Sen.Script.Modules.System.Default.Localization.GetString("popcap_resize_animation"));
        const clone: Sen.Script.Modules.Executable.PvZ2.CloneAnimateContent.Clone = new Clone(arg, resolution);
        const option: SelectionQuery = clone.Input();
        switch (option) {
            case SelectionQuery.ink: {
                clone.Ink();
                break;
            }
            case SelectionQuery.butter: {
                clone.Butter();
                break;
            }
            case SelectionQuery.costume: {
                clone.Costume();
                break;
            }
            case SelectionQuery.unknown: {
                clone.Unknown();
                break;
            }
        }
        return;
    }
}

Sen.Script.Modules.Executable.PvZ2.CloneAnimateContent.Evaluate();
