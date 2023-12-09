namespace Sen.Script.Modules.Executable.PvZ2.SplitWorldMapData {
    /**
     * Bounding Rect
     */

    export interface MBoundingRect {
        mX: number;
        mY: number;
        mWidth: number;
        mHeight: number;
    }

    /**
     * Event List
     */

    export interface MEventList {
        m_position: MPosition;
        m_eventType: string;
        m_eventSubType: string;
        m_name: string;
        m_dataString: string;
        m_displayText: string;
        m_worldMapTutorialVisibleWhen: string;
        m_levelNodeType: string;
        m_eventId: string;
        m_parentEvent: string;
        m_unlockedFrom: string;
        m_completedNarrationID: string;
        m_isArtFlipped: string;
        m_visibleFrom: string;
        m_imageID?: number;
        m_scaleX?: number;
        m_scaleY?: number;
    }

    /**
     * Map Piece
     */

    export interface MMapPiece {
        m_position: MPosition;
        m_imageID: number;
        m_eventType: string;
        m_eventSubType: string;
        m_worldMapTutorialVisibleWhen: string;
        m_levelNodeType: string;
        m_drawLayer: number;
        m_scaleX?: number;
        m_scaleY?: number;
        m_displayText: string;
        m_parallaxLayer?: number;
        m_eventId: string;
        m_isArtFlipped: string;
        m_rotationAngle?: number;
    }

    /**
     * Position
     */

    export interface MPosition {
        x: number;
        y: number;
    }

    /**
     * Object data
     */

    export interface Objdata {
        m_mapPieces: Array<MMapPiece>;
        m_eventList: Array<MEventList>;
        m_worldName: string;
        m_creationTime: number;
        m_resGroupID: number;
        m_boundingRect: MBoundingRect;
        m_worldId: number;
        m_version: number;
    }

    /**
     * Object
     */

    export interface Object {
        uid: string;
        objclass: string;
        objdata: Objdata;
    }

    /**
     * World map data
     */

    export interface WorldMapData {
        version: number;
        objects: Array<Object>;
    }

    /**
     * Definition
     */

    export type Definition = {
        version: bigint;
        objects: Record<string, RecordData>;
    };

    export type RecordData = {
        m_worldId: number;
        m_resGroupID: number;
    };

    /**
     *
     * @param worldmap_data - world map data
     * @param output_directory - output directory
     * @returns splitted
     */

    export function split_fs(worldmap_data: WorldMapData, output_directory: string): void {
        const definition: Definition = {
            version: 1n,
            objects: {},
        };
        if (!("objects" in worldmap_data)) {
            throw new Error(`"objects" property cannot be null in worldmap data`);
        }
        const standard: Array<string> = Object.keys(worldmap_data.objects);
        const unique: Array<string> = [...new Set(standard)];
        if (standard.length > unique.length) {
            throw new Error("Map name is duplicated");
        }
        for (const worldmap of worldmap_data.objects) {
            const map_name: string = worldmap.objdata.m_worldName;
            const rec_data: RecordData = {
                m_worldId: worldmap.objdata.m_worldId,
                m_resGroupID: worldmap.objdata.m_resGroupID,
            };
            delete (worldmap as any).objdata.m_worldName;
            delete (worldmap as any).objdata.m_worldId;
            delete (worldmap as any).objdata.m_resGroupID;
            Sen.Script.Modules.FileSystem.Json.WriteJson<Object>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(output_directory, "worldmap", `${map_name}.json`)), worldmap, false, "\t");
            definition.objects[map_name] = rec_data;
        }
        Sen.Script.Modules.FileSystem.Json.WriteJson(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(output_directory, "map_list.json")), definition, true, "\t");
        return;
    }

    /**
     * Evaluate method
     * @returns
     */

    export function Evaluate(): void {
        Sen.Script.Modules.System.Implement.JavaScript.EvaluatePrint(Sen.Script.Modules.System.Default.Localization.GetString("evaluate_fs"), Sen.Script.Modules.System.Default.Localization.GetString("split_worldmap_data"));
        Sen.Shell.Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(/\{\}/g, Sen.Script.Modules.System.Default.Localization.GetString("input_worldmap_data"))
        );
        const file_source: string = Sen.Script.Modules.Interface.Arguments.InputPath("file");
        Sen.Script.Modules.Executable.PvZ2.SplitWorldMapData.split_fs(
            Sen.Script.Modules.FileSystem.Json.ReadJson<WorldMapData>(file_source),
            Sen.Shell.Path.Join(Sen.Shell.Path.Dirname(file_source), `${Sen.Shell.Path.Parse(file_source).name_without_extension}.map_list`)
        );
        return;
    }
}
Sen.Script.Modules.Executable.PvZ2.SplitWorldMapData.Evaluate();
