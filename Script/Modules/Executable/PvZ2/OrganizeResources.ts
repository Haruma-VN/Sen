namespace Sen.Script.Modules.Executable.PvZ2.OrganizeResources {
    /**
     * Structure
     */
    export interface OrganizeOrder {
        slot: bigint;
        id: bigint;
        path: bigint;
        type: bigint;
        atlas: bigint;
        width: bigint;
        height: bigint;
        parent: bigint;
        ah: bigint;
        aw: bigint;
        ax: bigint;
        ay: bigint;
        cols: bigint;
        x: bigint;
        y: bigint;
        srcpath: bigint;
        runtime: bigint;
        forceOriginalVectorSymbolSize: bigint;
    }

    export class OrganizeResources {
        public constructor(private resource: Resources_Group_Structure_Template) {
            return;
        }

        // private Organize
    }
}
