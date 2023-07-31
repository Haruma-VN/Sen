namespace Sen.Script.Modules.Implement.XML {
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
