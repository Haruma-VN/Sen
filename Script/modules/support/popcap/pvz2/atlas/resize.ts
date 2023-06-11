namespace Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Resize {
    /**
     * @param expected_output - The output that the user wanted
     */

    export type expected_output = 1536 | 768 | 384 | 1200 | 640;
    /**
     *
     * @param output - Pass output wanted
     * @param original - Original texture quality: 1200
     * @returns output/original
     */

    export function DoCalculate(output: int, original: int = 1200): float {
        return output / original;
    }

    /**
     *
     * @param input - Pass number needs to beautify
     * @returns Beautify the number
     */

    export function BeautifyDimension(input: float): int {
        let down: int = Math.ceil(input);
        return input - down >= 0.5 ? Math.floor(input) : down;
    }

    /**
     *
     * @param file_path - Pass input path
     * @param output - Pass output number
     * @param original - Pass original number
     * @param output_path - Pass output path
     * @returns Resized image
     */

    export function ResizeAutomatically<T extends Record<"width" | "height", int>>(
        file_path: string,
        modify_number: float,
        output_path: string,
        dimension: T,
    ): void {
        DotNetBitmap.ResizeImage(
            BeautifyDimension(dimension.width * modify_number),
            BeautifyDimension(dimension.height * modify_number),
            file_path,
            output_path,
        );
        return;
    }

    /**
     * Resize all PopCap Sprites class implement Tre
     */

    export class ResizePopCapSprite extends Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackFromAtlasJson {
        /**
         *
         * @param atlas_json - Provide atlas json
         * @param original - Provide original
         * @param modified - Provide modified
         * @returns new atlas json
         */
        protected static RenamePathForAtlasJson(
            atlas_json: Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson,
            original: int,
            modified: int,
        ): Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson {
            atlas_json.res = modified.toString() as "1536" | "768" | "384" | "1200" | "640";
            atlas_json.subgroup = atlas_json.subgroup.replace(original.toString(), modified.toString());
            const groups: Array<string> = Object.keys(atlas_json.groups);
            for (const group of groups) {
                for (let i: number = 0; i < atlas_json.groups[group].path.length; ++i) {
                    if (atlas_json.groups[group].path[i] === original.toString()) {
                        atlas_json.groups[group].path[i] = modified.toString();
                    }
                }
            }
            return atlas_json;
        }

        /**
         *
         * @param directory_path - Pass dir ".sprite"
         * @param original - Pass original
         * @param modified - Pass modified
         * @param output_directory - Pass output dir
         * @returns Resized whole sprites
         */

        public static DoAllResizeBasedOnAtlasJson(
            directory_path: string,
            original: int,
            modified: int,
            output_directory: string,
        ): void {
            if (Fs.DirectoryExists(output_directory)) {
                Fs.DeleteDirectory([output_directory]);
            }
            Fs.CreateDirectory(output_directory);
            const new_media_path: string = Path.Resolve(`${output_directory}/media`);
            const new_atlas_json_path: string = Path.Resolve(`${output_directory}/atlas.json`);
            Fs.CreateDirectory(new_media_path);
            this.CheckWholeDirectory(directory_path);
            const atlas_json_path: string = Path.Resolve(`${directory_path}/atlas.json`);
            const media_path: string = Path.Resolve(`${directory_path}/media`);
            const atlas_json: Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson =
                Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson>(
                    atlas_json_path,
                ) satisfies Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson;
            this.CheckAtlasJsonStructure(atlas_json);
            const is_path: boolean = atlas_json.method === "path";
            const group_members: Array<string> = Object.keys(atlas_json.groups);
            const images_name: Array<string> = is_path
                ? group_members.map((member) => atlas_json.groups[member].path.at(-1) as string)
                : group_members;
            this.CheckWholeMemberIfExists(media_path, images_name);
            const packable_datas: (
                | Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.PackableData
                | Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.MaxRectsPackableData
            )[] = this.AutoConversionToPackableData(atlas_json, atlas_json_path);
            for (const data of packable_datas) {
                if (is_path) {
                    const dimension: BitMap.Constraints.ImageInfo<int> = DotNetBitmap.GetDimension<int>(
                        Path.Resolve(`${media_path}/${data.path.at(-1)}.png`),
                    );
                    (data as Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.MaxRectsPackableData).width =
                        dimension.width;
                    (data as Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.MaxRectsPackableData).height =
                        dimension.height;
                    (data as Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.MaxRectsPackableData).file_path =
                        Path.Resolve(dimension.file_path);
                } else {
                    const dimension: BitMap.Constraints.ImageInfo<int> = DotNetBitmap.GetDimension<int>(
                        Path.Resolve(`${media_path}/${data.id}.png`),
                    );
                    (data as Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.MaxRectsPackableData).width =
                        dimension.width;
                    (data as Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.MaxRectsPackableData).height =
                        dimension.height;
                    (data as Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.MaxRectsPackableData).file_path =
                        Path.Resolve(dimension.file_path);
                }
            }
            const calculate: float = Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Resize.DoCalculate(
                modified,
                original,
            );
            for (const data of packable_datas) {
                Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Resize.ResizeAutomatically(
                    (data as Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.MaxRectsPackableData).file_path,
                    calculate,
                    Path.Resolve(
                        `${new_media_path}/${
                            Path.Parse(
                                (data as Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.MaxRectsPackableData)
                                    .file_path,
                            ).name
                        }`,
                    ),
                    data as Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Pack.MaxRectsPackableData,
                );
            }
            Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.AtlasJson>(
                new_atlas_json_path,
                this.RenamePathForAtlasJson(atlas_json, original, modified),
            );
            return;
        }
    }
}
