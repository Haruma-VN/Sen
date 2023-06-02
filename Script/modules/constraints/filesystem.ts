namespace Runtime.Script.Modules.FileSystem.Constraints {
    /**
     * @param -  Encoding for File Opening
     */

    export enum EncodingType {
        UTF8,
        ASCII,
        LATIN1,
        UNICODE,
    }

    /**
     * @param - Read Directory option
     */

    export enum ReadDirectory {
        OnlyCurrentDirectory,
        AllNestedDirectory,
    }
}
