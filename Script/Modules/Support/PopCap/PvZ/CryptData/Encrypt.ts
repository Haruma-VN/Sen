namespace Sen.Script.Modules.Support.PopCap.PvZ.CryptData.Encrypt {
    /**
     * Structure
     */

    export interface Struct {
        encryptionKey: string;
        limit: number;
    }

    /**
     * M Data
     */

    export const data: Struct = Sen.Script.Modules.FileSystem.Json.ReadJson<Struct>(Sen.Shell.Path.Resolve(Sen.Shell.Path.Join(`${Sen.Shell.MainScriptDirectory}`, `Modules`, `Customization`, `Methods`, `popcap_crypt_data.json`)));
    /**
     * Key
     */

    export const limit: number = data.limit;

    /**
     * Key
     */

    export const encryptionKey: string = data.encryptionKey;
}
