namespace Sen.Script.Modules.Support.PopCap.PvZ2.TextTable {
    /**
     * This is the newest JSON type of PvZ2 Localization
     */

    export interface PopCapLocalizationJsonList {
        objects: [
            {
                aliases: ["LawnStringsData"];
                objclass: "LawnStringsData";
                objdata: {
                    LocStringValues: Array<string>;
                };
            },
        ];
        version: 1;
        timestamp?: string;
    }

    /**
     * Allowed conversion
     */

    export type AllowedConversion = "json_map" | "json_list" | "text";

    /**
     * This is the old JSON type of PvZ2 Localization, has been changed since 8.x
     */

    export interface PopCapLocalizationJsonMap {
        objects: [
            {
                aliases: ["LawnStringsData"];
                objclass: "LawnStringsData";
                objdata: {
                    LocStringValues: Record<string, string>;
                };
            },
        ];
        version: 1;
    }

    /**
     * This is the old text type of PvZ2 Localization, has been changed since 6.x
     */

    export type PopCapLocalizationText = string;

    /**
     * Abstract class for convert table
     */

    export type WorkingDataType = Record<string, string>;

    export abstract class ConvertTableAbstract {
        // check
        protected abstract CheckOfficialPopCapLocalizationJsonStructure<
            Generic_T extends PopCapLocalizationJsonMap | PopCapLocalizationJsonMap,
        >(data: Generic_T, file_path?: string): data is Generic_T;

        // convert

        public abstract ConvertLocalizationTable<
            Generic_T extends PopCapLocalizationText | PopCapLocalizationJsonMap | PopCapLocalizationJsonList,
        >(data: Generic_T, convert: AllowedConversion): void;
    }

    /**
     * Convert Table
     */

    export class ConvertTable extends ConvertTableAbstract {
        // null

        public constructor() {
            super();
        }

        /**
         *
         * @param data - Pass deserialized object
         * @param file_path - Pass file path
         * @returns true if accepted
         */

        protected override CheckOfficialPopCapLocalizationJsonStructure<
            Generic_T extends PopCapLocalizationJsonMap | PopCapLocalizationJsonList,
        >(data: Generic_T, file_path?: string): data is Generic_T {
            if (!("objects" in data)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        `objects`,
                    ),
                    `objects`,
                    (file_path ??= "undefined"),
                );
            }
            if (!Array.isArray(data.objects)) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [
                            `version`,
                            `this`,
                            Sen.Script.Modules.System.Default.Localization.GetString("array"),
                            `${data.version}`,
                        ],
                    ),
                    `objects`,
                    (file_path ??= "undefined"),
                    Sen.Script.Modules.System.Default.Localization.GetString("array"),
                );
            }
            if (!("version" in data)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        `version`,
                    ),
                    `version`,
                    (file_path ??= "undefined"),
                );
            }
            if (data.version !== 1) {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [`version`, `this`, `1`, `${data.version}`],
                    ),
                    `version`,
                    (file_path ??= "undefined"),
                    `1`,
                );
            }
            if (data.objects.length !== 1) {
                throw new Sen.Script.Modules.Exceptions.WrongListSize(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("size_of_this_must_be"),
                        [`objects`, `1`],
                    ),
                    (file_path ??= "undefined"),
                );
            }
            if (!("aliases" in data.objects[0])) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        `aliases`,
                    ),
                    `aliases`,
                    (file_path ??= "undefined"),
                );
            }
            if (data.objects[0].aliases.length !== 1) {
                throw new Sen.Script.Modules.Exceptions.WrongListSize(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("size_of_this_must_be"),
                        [`aliases`, `1`],
                    ),
                    (file_path ??= "undefined"),
                );
            }
            if (data.objects[0].aliases[0] !== "LawnStringsData") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [`aliases`, `objects[0].aliases[0]`, `LawnStringsData`, `${data.objects[0].aliases[0]}`],
                    ),
                    `objects[0].aliases[0]`,
                    (file_path ??= "undefined"),
                    `LawnStringsData`,
                );
            }
            if (!("objclass" in data.objects[0])) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        `objclass`,
                    ),
                    `objclass`,
                    (file_path ??= "undefined"),
                );
            }
            if (data.objects[0].objclass !== "LawnStringsData") {
                throw new Sen.Script.Modules.Exceptions.WrongDataType(
                    Sen.Script.Modules.System.Default.Localization.RegexReplace(
                        Sen.Script.Modules.System.Default.Localization.GetString("this_property_must_be"),
                        [`objclass`, `data.objects[0].objclass`, `LawnStringsData`, `${data.objects[0].objclass}`],
                    ),
                    `data.objects[0].objclass`,
                    (file_path ??= "undefined"),
                    `LawnStringsData`,
                );
            }
            if (!("objdata" in data.objects[0])) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        `objdata`,
                    ),
                    `objdata`,
                    (file_path ??= "undefined"),
                );
            }
            if (!("LocStringValues" in data.objects[0].objdata)) {
                throw new Sen.Script.Modules.Exceptions.MissingProperty(
                    Sen.Script.Modules.System.Default.Localization.GetString("property_is_undefined").replace(
                        /\{\}/g,
                        `LocStringValues`,
                    ),
                    `LocStringValues`,
                    (file_path ??= "undefined"),
                );
            }
            return true;
        }

        public override ConvertLocalizationTable<
            Generic_T extends PopCapLocalizationJsonList | PopCapLocalizationJsonMap | PopCapLocalizationText,
        >(data: Generic_T, convert: AllowedConversion): Generic_T {
            let is_text: boolean = false;
            try {
                JSON.parse(data as any);
            } catch (error) {
                is_text = true;
            }
            if (is_text) {
                const destination: Generic_T = {
                    objects: [
                        {
                            aliases: ["LawnStringsData"],
                            objclass: "LawnStringsData",
                            objdata: {
                                LocStringValues: [],
                            },
                        },
                    ],
                    version: 1,
                } as any & Generic_T;
            }
            return {} as any;
        }

        public static DoAllConversion(): void {
            const text_table = new ConvertTable();
            let input = Console.Input(null);
            text_table.ConvertLocalizationTable(
                Fs.ReadText(input, Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
                "json_list",
            );
        }
    }
}
