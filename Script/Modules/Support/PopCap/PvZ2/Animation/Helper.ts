namespace Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper {
    /**
     * PopCap Standard
     */
    export const k_standard_resolution = 1200;

    /**
     *
     * @param resolution - Pass resolution
     * @returns Scale matrix
     */
    export function ScaleMatrix(resolution: int): string {
        return (Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.k_standard_resolution / resolution).toFixed(6);
    }

    // Deprecated, adapted from project Tre only for view, should not be used

    export function ImageTemplate(
        image_number: int,
        position: {
            a?: double;
            b?: double;
            c?: double;
            d?: double;
            tx: double;
            ty: double;
        },
        transformationPoint: {
            point_x: double;
            point_y: double;
        } = {
            point_x: -position.tx,
            point_y: -position.ty,
        }
    ): string {
        if (!position.a) {
            position.a = 1;
        }
        if (!position.b) {
            position.b = 0;
        }
        if (!position.c) {
            position.c = 0;
        }
        if (!position.d) {
            position.d = 1;
        }
        const [pos_a, pos_b, pos_c, pos_d, tx, ty, transform_x, transform_y]: [string, string, string, string, string, string, string, string] = [
            position.a.toFixed(6),
            position.b.toFixed(6),
            position.c.toFixed(6),
            position.d.toFixed(6),
            position.tx.toFixed(6),
            position.ty.toFixed(6),
            transformationPoint.point_x.toFixed(6),
            transformationPoint.point_y.toFixed(6),
        ];
        return `<DOMSymbolItem xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" name="image/image_${image_number}" symbolType="graphic" xmlns="http://ns.adobe.com/xfl/2008/">
		<timeline>
			<DOMTimeline name="image_${image_number}">
				<layers>
					<DOMLayer>
						<frames>
							<DOMFrame index="0">
								<elements>
									<DOMSymbolInstance libraryItemName="source/source_${image_number}" symbolType="graphic" loop="loop">
										<matrix>
											<Matrix a="${pos_a}" b="${pos_b}" c="${pos_c}" d="${pos_d}" tx="${tx}" ty="${ty}"/>
										</matrix>
										<transformationPoint>
											<Point x="${transform_x}" y="${transform_y}"/>
										</transformationPoint>
									</DOMSymbolInstance>
								</elements>
							</DOMFrame>
						</frames>
					</DOMLayer>
				</layers>
			</DOMTimeline>
		</timeline>
	</DOMSymbolItem>`;
    }

    /**
     *
     * @param source_number - Pass an number as index
     * @param library_name - Sprite name
     * @param matrix - Animation resize
     * @returns source
     */
    // Deprecated, do not use
    export function SourceTemplate(source_number: number, library_name: string, matrix: number): string {
        return `<DOMSymbolItem xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" name="source/source_${source_number}" symbolType="graphic" xmlns="http://ns.adobe.com/xfl/2008/">
    <timeline>
        <DOMTimeline name="source_${source_number}">
            <layers>
                <DOMLayer>
                    <frames>
                        <DOMFrame index="0">
                            <elements>
                                <DOMBitmapInstance libraryItemName="media/${library_name}">
                                    <matrix>
                                        <Matrix a="${matrix}" d="${matrix}"/>
                                    </matrix>
                                </DOMBitmapInstance>
                            </elements>
                        </DOMFrame>
                    </frames>
                </DOMLayer>
            </layers>
        </DOMTimeline>
    </timeline>
</DOMSymbolItem>`;
    }

    // Animation helper
    export interface PopCapAnimationHelperMethodJson {
        id_replacer: string;
    }

    /**
     * Structure
     */

    export interface Option {
        generate_sprite: "none" | "old" | "new";
    }

    /**
     * @param resolution - Pass resolution here
     * @returns Calculated
     */

    export function CalculateResolution(resolution: int): double {
        return Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.k_standard_resolution / resolution;
    }

    /**
     *
     * @param argument - Pass pngs array
     * @param xfl_path - Pass xfl path
     * @param resolution - Pass resolution
     * @param option - Pass option
     * @returns
     */

    export function AddImageToAnimationAdobeFlash(argument: Array<string>, xfl_path: string, resolution: int, option: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.Option): void {
        const resource_element_addon_dom_document: Sen.Shell.PvZ2XML.DOMDocumentAddon = {
            media: [],
            source: [],
            sprite: [],
            image: [],
        };
        const extra_info: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser = Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser>(
            Sen.Shell.Path.Join(`${xfl_path}`, `struct.json`)
        );
        const image: Array<string> = Object.keys(extra_info.image);
        const calculate_resolution: double = CalculateResolution(resolution);
        const animation_helper: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.PopCapAnimationHelperMethodJson =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.PopCapAnimationHelperMethodJson>(
                Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_animation_helper.json`))
            );
        argument
            .map((element: string) => Sen.Shell.DotNetBitmap.GetDimension<int>(element) satisfies Sen.Script.Modules.BitMap.Constraints.ImageInfo<int>)
            .forEach((element: Sen.Script.Modules.BitMap.Constraints.ImageInfo<int>, index: int) => {
                const resource_dom_document_name: string = Sen.Shell.Path.Parse(element.file_path).name_without_extension;
                const resource_dom_document_index: int = image.length + index + 0x01;
                const dimension_x: [double, double] = [element.width * calculate_resolution, element.height * calculate_resolution];
                const sprite_index: int = Object.keys(extra_info.sprite).length + 0x01;
                const typename: string = `${resource_dom_document_name}|${animation_helper.id_replacer}${Sen.Shell.Path.Parse(element.file_path).name_without_extension.toUpperCase()}`;
                resource_element_addon_dom_document.media.push(resource_dom_document_name);
                Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("name_set_as_default"));
                Sen.Shell.Console.Printf(null, `        ${typename}`);
                extra_info.image[`image_${resource_dom_document_index}`] = {
                    name: typename,
                    width: dimension_x[0x00] - Math.ceil(dimension_x[0x00]) < 0.5 ? Math.ceil(dimension_x[0x00]) : Math.floor(dimension_x[0x00]),
                    height: dimension_x[0x01] - Math.ceil(dimension_x[0x01]) < 0.5 ? Math.ceil(dimension_x[0x01]) : Math.floor(dimension_x[0x01]),
                };
                const dimension: [int, int] = [element.width, element.height];
                const transform: [double, double, double, double, double, double] = [0x01, 0x00, 0x00, 0x01, 0x00, ~0x01 + 0x01];
                resource_element_addon_dom_document.image.push(`image_${resource_dom_document_index}`);
                resource_element_addon_dom_document.source.push(`source_${resource_dom_document_index}`);
                Sen.Shell.PvZ2XML.WriteImageDocument(
                    resource_dom_document_index,
                    resource_dom_document_name,
                    dimension,
                    transform,
                    Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${xfl_path}`, `LIBRARY`, `image`, `image_${resource_dom_document_index}.xml`))
                );
                Sen.Shell.PvZ2XML.WriteSourceDocument(
                    resource_dom_document_index,
                    resource_dom_document_name,
                    dimension,
                    transform,
                    resolution,
                    Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${xfl_path}`, `LIBRARY`, `source`, `source_${resource_dom_document_index}.xml`))
                );
                Sen.Shell.FileSystem.CopyFile(element.file_path, Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${xfl_path}`, `LIBRARY`, `media`, `${Sen.Shell.Path.Parse(element.file_path).name}`)));
                switch (option.generate_sprite) {
                    case "new": {
                        const sprite_destination: string = `sprite_${sprite_index}`;
                        Sen.Shell.Console.Print(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Green, Sen.Script.Modules.System.Default.Localization.GetString("generated").replace(/\{\}/g, `${sprite_destination}`));
                        Sen.Shell.PvZ2XML.WriteSpriteDocument(
                            sprite_index,
                            1,
                            resource_dom_document_index,
                            [0x01, 0x00, 0x00, 0x01, 0x00, 0x00],
                            [0x01, 0x01, 0x01, 0x01],
                            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${xfl_path}`, `LIBRARY`, `sprite`, `sprite_${sprite_index}.xml`))
                        );
                        Sen.Shell.Console.Print(
                            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_sprite_name"))
                        );
                        const sprite_name: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
                        extra_info.sprite[`sprite_${sprite_index}`] = sprite_name;
                        resource_element_addon_dom_document.sprite.push(sprite_destination);
                        break;
                    }
                    case "old": {
                        const available: Array<int> = [];
                        Sen.Shell.Console.Print(
                            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
                            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("choose_one").replace(/\{\}/g, `sprite`))
                        );
                        Object.keys(extra_info.sprite).forEach((sprite: string, index: int) => {
                            const k_index: int = index + 0x01;
                            available.push(k_index);
                            Sen.Shell.Console.Printf(null, `     ${k_index}. ${sprite} | ${extra_info.sprite[sprite]}`);
                        });
                        let input: string = Sen.Shell.Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
                        while (!available.includes(parseInt(input))) {
                            Sen.Shell.Console.Print(
                                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                                Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("please_choose_correct_input"))
                            );
                            input = Sen.Shell.Console.Input(2 as Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
                        }
                        Sen.Shell.PvZ2XML.AddImageToSpriteDocument(
                            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${xfl_path}`, `LIBRARY`, `sprite`, `sprite_${input}.xml`)),
                            [0x01, 0x00, 0x00, 0x01, 0x00, 0x00],
                            [0x01, 0x01, 0x01, 0x01],
                            resource_dom_document_index
                        );
                        break;
                    }
                    case "none": {
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
        Sen.Shell.PvZ2XML.InsertDOMDocumentData(
            resource_element_addon_dom_document,
            Sen.Shell.FileSystem.ReadText(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${xfl_path}`, `DOMDocument.xml`)), Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
            Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${xfl_path}`, `DOMDocument.xml`))
        );
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${xfl_path}`, `struct.json`)), extra_info, false);
        return;
    }
}
