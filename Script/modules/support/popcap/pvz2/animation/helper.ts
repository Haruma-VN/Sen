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

    // animation helper
    export interface PopCapAnimationHelperMethodJson {
        id_replacer: string;
    }

    /**
     *
     * @param argument - Pass pngs array
     * @param xfl_path - Pass xfl path
     * @param resolution - Pass resolution
     * @returns
     */

    export function AddImageToAnimationAdobeFlash(argument: Array<string>, xfl_path: string, resolution: int): void {
        const resource_element_addon_dom_document: PvZ2XML.DOMDocumentAddon = {
            media: [],
            source: [],
            sprite: [],
            image: [],
        };
        const extra_info: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser>(`${xfl_path}/extra.json`);
        const image: Array<string> = Object.keys(extra_info.image);
        const animation_helper: Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.PopCapAnimationHelperMethodJson =
            Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.Helper.PopCapAnimationHelperMethodJson>(
                `${MainScriptDirectory}/modules/customization/methods/popcap_animation_helper.json`
            );
        argument
            .map((element: string) => DotNetBitmap.GetDimension<int>(element) satisfies Sen.Script.Modules.BitMap.Constraints.ImageInfo<int>)
            .forEach((element: Sen.Script.Modules.BitMap.Constraints.ImageInfo<int>, index: int) => {
                const resource_dom_document_name: string = Path.Parse(element.file_path).name_without_extension;
                const resource_dom_document_index: int = image.length + index + 0x01;
                const dimension_x: [double, double] = [element.width * 0.78125, element.height * 0.78125];
                resource_element_addon_dom_document.media.push(resource_dom_document_name);
                extra_info.image[`image_${resource_dom_document_index}`] = {
                    name: `${resource_dom_document_name}|${animation_helper.id_replacer}${Path.Parse(element.file_path).name_without_extension.toUpperCase()}`,
                    width: dimension_x[0x00] - Math.ceil(dimension_x[0x00]) < 0.5 ? Math.ceil(dimension_x[0x00]) : Math.floor(dimension_x[0x00]),
                    height: dimension_x[0x01] - Math.ceil(dimension_x[0x01]) < 0.5 ? Math.ceil(dimension_x[0x01]) : Math.floor(dimension_x[0x01]),
                };
                const dimension: [int, int] = [element.width, element.height];
                const transform: [double, double, double, double, double, double] = [0x01, 0x00, 0x00, 0x01, 0x00, ~0x01 + 0x01];
                resource_element_addon_dom_document.image.push(`image_${resource_dom_document_index}`);
                resource_element_addon_dom_document.source.push(`source_${resource_dom_document_index}`);
                PvZ2XML.WriteImageDocument(
                    resource_dom_document_index,
                    resource_dom_document_name,
                    dimension,
                    transform,
                    `${xfl_path}/LIBRARY/image/image_${resource_dom_document_index}.xml`
                );
                PvZ2XML.WriteSourceDocument(
                    resource_dom_document_index,
                    resource_dom_document_name,
                    dimension,
                    transform,
                    resolution,
                    `${xfl_path}/LIBRARY/source/source_${resource_dom_document_index}.xml`
                );
                Fs.CopyFile(element.file_path, `${xfl_path}/LIBRARY/media/${Path.Parse(element.file_path).name}`);
            });
        PvZ2XML.InsertDOMDocumentData(
            resource_element_addon_dom_document,
            Fs.ReadText(`${xfl_path}/DOMDocument.xml`, Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
            `${xfl_path}/DOMDocument.xml`
        );
        Sen.Script.Modules.FileSystem.Json.WriteJson<Sen.Script.Modules.Support.PopCap.PvZ2.Animation.ExtraJsonForUser>(`${xfl_path}/extra.json`, extra_info);
        return;
    }
}
