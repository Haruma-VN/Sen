namespace Sen.Script.Modules.Support.PopCap.PvZ.Particles.Encode {
    /**
     * Structure
     */

    export interface Particles {
        Emitters?: Array<ParticlesEmitter>;
    }

    /**
     * Wrapper
     */

    export enum Version {
        PC = 1,
        Phone_32,
        Phone_64,
    }

    /**
     * Structure
     */

    export interface ParticlesEmitter {
        Name?: string; //<Name>
        Image?: any; //<Image>
        ImagePath?: string;
        ImageCol: bigint;
        ImageRow: bigint;
        ImageFrames: bigint; //1
        Animated: bigint;
        ParticleFlags: bigint;
        EmitterType: bigint; //1
        OnDuration?: string; //<OnDuration>
        SystemDuration?: Array<ParticlesTrackNode>; //<SystemDuration>
        CrossFadeDuration?: Array<ParticlesTrackNode>; //<CrossFadeDuration>
        SpawnRate?: Array<ParticlesTrackNode>; //<SpawnRate>
        SpawnMinActive?: Array<ParticlesTrackNode>; //<SpawnMinActive>
        SpawnMaxActive?: Array<ParticlesTrackNode>; //<SpawnMaxActive>
        SpawnMaxLaunched?: Array<ParticlesTrackNode>; //<SpawnMaxLaunched>
        EmitterRadius?: Array<ParticlesTrackNode>; //<EmitterRadius>
        EmitterOffsetX?: Array<ParticlesTrackNode>; //<EmitterOffsetX>
        EmitterOffsetY?: Array<ParticlesTrackNode>; //<EmitterOffsetY>
        EmitterBoxX?: Array<ParticlesTrackNode>; //<EmitterBoxX>
        EmitterBoxY?: Array<ParticlesTrackNode>; //<EmitterBoxY>
        EmitterPath?: Array<ParticlesTrackNode>; //<EmitterPath>
        EmitterSkewX?: Array<ParticlesTrackNode>; //<EmitterSkewX>
        EmitterSkewY?: Array<ParticlesTrackNode>; //<EmitterSkewY>
        ParticleDuration?: Array<ParticlesTrackNode>; //<ParticleDuration>
        SystemRed?: Array<ParticlesTrackNode>; //<SystemRed>
        SystemGreen?: Array<ParticlesTrackNode>; //<SystemGreen>
        SystemBlue?: Array<ParticlesTrackNode>; //<SystemBlue>
        SystemAlpha?: Array<ParticlesTrackNode>; //<SystemAlpha>
        SystemBrightness?: Array<ParticlesTrackNode>; //<SystemBrightness>
        LaunchSpeed?: Array<ParticlesTrackNode>; //<LaunchSpeed>
        LaunchAngle?: Array<ParticlesTrackNode>; //<LaunchAngle>
        Field?: Array<ParticlesField>; //<Field>
        ParticlesField: Array<ParticlesField>; //<SystemField>
        ParticleRed?: Array<ParticlesTrackNode>; //<ParticleRed>
        ParticleGreen?: Array<ParticlesTrackNode>; //<ParticleGreen>
        ParticleBlue?: Array<ParticlesTrackNode>; //<ParticleBlue>
        ParticleAlpha?: Array<ParticlesTrackNode>; //<ParticleAlpha>
        ParticleBrightness?: Array<ParticlesTrackNode>; //<ParticleBrightness>
        ParticleSpinAngle?: Array<ParticlesTrackNode>; //<ParticleSpinAngle>
        ParticleSpinSpeed?: Array<ParticlesTrackNode>; //<ParticleSpinSpeed>
        ParticleScale?: Array<ParticlesTrackNode>; //<ParticleScale>
        ParticleStretch?: Array<ParticlesTrackNode>; //<ParticleStretch>
        CollisionReflect?: Array<ParticlesTrackNode>; //<CollisionReflect>
        CollisionSpin?: Array<ParticlesTrackNode>; //<CollisionSpin>
        ClipTop?: Array<ParticlesTrackNode>; //<ClipTop>
        ClipBottom?: Array<ParticlesTrackNode>; //<ClipBottom>
        ClipLeft?: Array<ParticlesTrackNode>; //<ClipLeft>
        ClipRight?: Array<ParticlesTrackNode>; //<ClipRight>
        AnimationRate?: Array<ParticlesTrackNode>; //<AnimationRate>
    }

    /**
     * Structure
     */

    export interface ParticlesField {
        FieldType?: bigint;
        X?: Array<ParticlesTrackNode>;
        Y: Array<ParticlesTrackNode>;
    }
    /**
     * Structure
     */

    export interface ParticlesTrackNode {
        Time: float;
        LowValue?: float;
        HighValue?: float;
        CurveType?: bigint;
        Distribution?: bigint;
    }

    /**
     *
     * @param inFile - In file
     * @param outFile - Out file
     * @returns
     */

    export function Decode(inFile: string, outFile: string): void {
        Sen.Shell.FileSystem.WriteFile(outFile, Sen.Shell.LotusModule.SerializeJson<Sen.Script.Modules.Support.PopCap.PvZ.Particles.Encode.Particles>(Sen.Shell.LotusModule.ParticlesToJson(inFile), "\t", false));
        return;
    }

    /**
     *
     * @param inFile - In file
     * @param outFile - Out file
     * @param version - Version
     * @returns
     */

    export function Encode(inFile: string, outFile: string, version: Version): void {
        Sen.Shell.LotusModule.ParticlesFromJson(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ.Particles.Encode.Particles>(inFile), version, outFile);
        return;
    }

    /**
     *
     * @param inFile - Input file JSON
     * @param outFile - Output file
     * @returns
     */

    export function JSONToXML(inFile: string, outFile: string): void {
        Sen.Shell.LotusModule.ParticlesToXML(Sen.Script.Modules.FileSystem.Json.ReadJson<Sen.Script.Modules.Support.PopCap.PvZ.Particles.Encode.Particles>(inFile), outFile);
        return;
    }

    /**
     *
     * @param inFile - Input file JSON
     * @param outFile - Output file
     * @returns
     */

    export function XMLtoJSON(inFile: string, outFile: string): void {
        Sen.Shell.FileSystem.WriteFile(outFile, Sen.Shell.LotusModule.SerializeJson<Sen.Script.Modules.Support.PopCap.PvZ.Particles.Encode.Particles>(Sen.Shell.LotusModule.ParticlesFromXML(inFile), "\t", false));
        return;
    }
}
