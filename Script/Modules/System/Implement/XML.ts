namespace Sen.Script.Modules.Implement.XML {
    /**
     * Structure
     */

    export interface DOMDocument {
        DOMDocument: {
            "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance";
            "@frameRate": "30";
            "@width": string;
            "@height": string;
            "@xflVersion": "2.971";
            "@xmlns": "http://ns.adobe.com/xfl/2008/";
            folders: {
                DOMFolderItem: [
                    {
                        "@name": "media";
                        "@isExpanded": "true";
                    },
                    {
                        "@name": "source";
                        "@isExpanded": "true";
                    },
                    {
                        "@name": "image";
                        "@isExpanded": "true";
                    },
                    {
                        "@name": "sprite";
                        "@isExpanded": "true";
                    }
                ];
            };
            media: {
                DOMBitmapItem: Array<{
                    "@name": string;
                    "@href": string;
                }>;
            };
            symbols: {
                Include: Array<{
                    "@href": string;
                }>;
            };
            timelines: DOMTimeline;
        };
    }

    /**
     * Structure
     */

    export interface DOMFrame {
        "@index": string;
        "@name"?: string;
        "@duration"?: string;
        "@labelType"?: string;
        Actionscript?: {
            script: {
                "#cdata-section": string;
            };
        };
        elements: null | DOMSymbolInstance[];
    }

    /**
     * Structure
     */

    export interface DOMLayer {
        "@name": string;
        frames: {
            DOMFrame: DOMFrame[];
        };
    }

    /**
     * Structure
     */

    export interface DOMSymbolInstance {
        "@libraryItemName": string;
        "@symbolType": string;
        "@loop"?: string;
    }

    /**
     * Structure
     */

    export interface DOMTimeline {
        "@name": string;
        layers: {
            DOMLayer: DOMLayer[];
        };
    }

    /**
     * Structure
     */

    export interface Sprite {
        DOMSymbolItem: {
            "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance";
            "@name": string;
            "@symbolType": "graphic";
            "@xmlns": "http://ns.adobe.com/xfl/2008/";
            timeline: {
                DOMTimeline: {
                    "@name": string;
                    layers: {
                        DOMLayer: Array<{
                            "@name": string;
                            frames: {
                                DOMFrame: {
                                    "@index": "0";
                                    "@duration": "1";
                                    elements: null | {
                                        DOMSymbolInstance: {
                                            "@libraryItemName": string;
                                            "@symbolType": "graphic";
                                            "@loop": "loop";
                                            "@firstFrame": "0";
                                            matrix: {
                                                Matrix: {
                                                    "@a": "1.000000";
                                                    "@b": "0.000000";
                                                    "@c": "0.000000";
                                                    "@d": "1.000000";
                                                    "@tx": string;
                                                    "@ty": string;
                                                };
                                            };
                                            color: {
                                                Color: {
                                                    "@redMultiplier": "1.000000";
                                                    "@greenMultiplier": "1.000000";
                                                    "@blueMultiplier": "1.000000";
                                                    "@alphaMultiplier": "1.000000";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        }>;
                    };
                };
            };
        };
    }

    /**
     *
     * @param g_object - JS Object
     * @param handle_bigint - Handle BigInt?
     * @returns Output XML String
     */
    export function SerializeXML<Generic_T>(g_object: Generic_T, handle_bigint: boolean): string {
        return Sen.Shell.PvZ2XML.SerializeXML({
            json: Sen.Script.Modules.FileSystem.Implement.JsonLibrary.StringifyJson(g_object, handle_bigint, undefined, false),
        });
    }
    /**
     *
     * @param output - Output argument
     * @param g_object - JS Object
     * @param handle_bigint - Handle BigInt?
     * @returns Output XML
     */
    export function WriteXML<Generic_T>(output: string, g_object: Generic_T, handle_bigint: boolean): void {
        Sen.Shell.FileSystem.WriteFile<string>(output, Sen.Script.Modules.Implement.XML.SerializeXML<Generic_T>(g_object, handle_bigint));
        return;
    }

    /**
     *
     * @param filepath - Pass file path
     * @returns
     */

    export function ReadXML<Generic_T>(filepath: string): Generic_T {
        const xml = Sen.Script.Modules.FileSystem.Implement.JsonLibrary.ParseJson<Generic_T>(
            Sen.Shell.PvZ2XML.DeserializeXML({
                xml: Sen.Shell.FileSystem.ReadText(filepath, Sen.Script.Modules.FileSystem.Constraints.EncodingType.UTF8),
            }),
            false,
            filepath
        );
        return xml;
    }
}
