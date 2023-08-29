namespace Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode {
    /**
     * Version
     */

    export enum Version {
        PC = 1,
        Phone_32,
        Phone_64,
    }

    /**
     * Structure
     */

    export interface Reanim {
        do_scale: bigint;
        fps: float;
        tracks?: Array<ReanimTrack>;
    }

    /**
     * Structure
     */

    export interface ReanimTrack {
        name?: string;
        transforms?: Array<ReanimTransform>;
    }

    /**
     * Structure
     */

    export interface ReanimTransform {
        x?: float;
        y?: float;
        kx?: float;
        ky?: float;
        sx?: float;
        sy?: float;
        f?: float;
        a?: float;
        i?: any;
        resource?: string;
        i2?: string;
        resource2?: string;
        font?: string;
        text?: string;
    }

    /**
     *
     * @param inFile - REANIM
     * @param outFile - JSON
     * @returns
     */

    export function Decode(inFile: string, outFile: string): void {
        Sen.Shell.FileSystem.WriteFile(outFile, Sen.Shell.LotusModule.SerializeJson<Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Reanim>(Sen.Shell.LotusModule.ReanimToReanimJson(inFile), "\t", false));
        return;
    }

    /**
     *
     * @param inFile - REANIM
     * @param outFile - JSON
     * @returns
     */

    export function Encode(inFile: string, version: Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Version, outFile: string): void {
        Sen.Shell.LotusModule.ReanimFromReanimJson(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Reanim>(inFile), version, outFile);
        return;
    }

    /**
     *
     * @param inFile - In REANIM
     * @param outDir - Out XFL
     * @returns
     */

    export function ToFlash(inFile: string, outDir: string): void {
        Sen.Shell.LotusModule.ReanimToFlashXfl(inFile, outDir);
        return;
    }

    /**
     *
     * @param inDir - In XFL
     * @param outFile - Out File
     * @returns
     */

    export function FromFlash(inDir: string, outFile: string): void {
        Sen.Shell.LotusModule.ReanimFromFlashXfl(inDir, outFile);
        return;
    }

    /**
     *
     * @param inFile - In REANIM
     * @param outDir - Out XFL
     * @returns
     */

    export function JSONToFlash(inFile: string, outDir: string): void {
        Sen.Shell.LotusModule.ReanimJsonToFlashXfl(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Reanim>(inFile), outDir);
        return;
    }

    /**
     *
     * @param inDir - In XFL
     * @param outFile - Out File
     * @returns
     */

    export function JSONFromFlash(inDir: string, outFile: string): void {
        Sen.Shell.FileSystem.WriteFile(outFile, Sen.Shell.LotusModule.SerializeJson<Sen.Script.Modules.Support.PopCap.PvZ.ReAnimation.Encode.Reanim>(Sen.Shell.LotusModule.ReaimJsonFromFlashXfl(inDir), "\t", false));
        return;
    }
}
