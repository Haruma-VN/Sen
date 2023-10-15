namespace Sen.Script.Modules.Support.Haruma.Package.Encode {
    // Header

    export interface Structure {
        version: number;
        createdTime: string;
        default: {
            extends_texture_information_for_pvz2c: number;
            version: number;
            ptx_info_size: number;
        };
        group: Array<Group>;
    }

    // Group

    export interface Group {
        group_name: string;
        is_composite: boolean;
        group_member: Array<GroupMember>;
    }

    // Group Member

    export interface GroupMember {
        subgroup_name: string;
        category: [number | null, number | null];
        version: number;
        compression_flags: number;
        res: Array<Res>;
    }

    // Res
    export interface Res {
        path: string;
        ptx_info?: {
            id: number;
            width: number;
            height: number;
        };
        ptx_property?: {
            format: number;
            pitch: number;
            alpha_size: null | number;
            alpha_format: number | null;
        };
        rsg: Sen.Shell.SenBuffer;
    }

    export function encode(manifest: Sen.Script.Modules.Support.PopCap.PvZ2.RSB.Unpack.RSBManifestInformationForSimple): Sen.Shell.SenBuffer {
        const struct: Structure = {
            version: 1,
            createdTime: Date.now().toString(),
            default: {
                extends_texture_information_for_pvz2c: Number(manifest.extends_texture_information_for_pvz2c),
                version: manifest.version,
                ptx_info_size: manifest.ptx_info_size,
            },
            group: [
                {
                    group_name: "s",
                    is_composite: true,
                    group_member: [
                        {
                            subgroup_name: "s",
                            category: [0, 0],
                            version: 1,
                            compression_flags: 1,
                            res: [
                                {
                                    ptx_info: {
                                        id: 0,
                                        width: 4096,
                                        height: 4096,
                                    },
                                    ptx_property: {
                                        pitch: 16384,
                                        alpha_format: null,
                                        alpha_size: null,
                                        format: 147,
                                    },
                                    path: "s",
                                    rsg: new Sen.Shell.SenBuffer([0x00n, 0x01n]),
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        const sen = new Sen.Shell.SenBuffer();
        // magic
        sen.writeString("sen");
        // version: u8
        sen.writeUInt8(struct.version);
        // date size: i32
        sen.writeInt32LE(struct.createdTime.length);
        // date: string
        sen.writeString(struct.createdTime);
        // extends for 2c: u8
        sen.writeUInt8(struct.default.extends_texture_information_for_pvz2c);
        // rsb version: u8
        sen.writeUInt8(struct.default.version);
        // ptx info size: u8
        sen.writeUInt8(struct.default.ptx_info_size);
        // group count: i32
        sen.writeInt32LE(struct.group.length);
        for (let i = 0; i < struct.group.length; i++) {
            const thix = struct.group[i];
            // group_size: i32
            sen.writeInt32LE(thix.group_name.length);
            // group_name: string
            sen.writeString(thix.group_name);
            // is_composite: boolean
            sen.writeBool(thix.is_composite);
            // group_member_count: i32
            sen.writeInt32LE(thix.group_member.length);
            for (let j = 0; j < thix.group_member.length; j++) {
                const thiz = thix.group_member[j];
                // subgroup size: i32
                sen.writeInt32LE(thiz.subgroup_name.length);
                // subgroup name: string
                sen.writeString(thiz.subgroup_name);
                if (thiz.category[0] !== null) {
                    // category[0] is not null: u8 boolean : 0x00 or 0x01
                    sen.writeUInt8(0x01);
                    // category[0]: i32
                    sen.writeInt32LE(thiz.category[0]);
                } else {
                    // category[0] is not null: u8 boolean : 0x00 or 0x01
                    sen.writeUInt8(0x00);
                    // category[0]: i32
                    sen.writeInt32LE(0x00);
                }
                if (thiz.category[1] !== null) {
                    // category[1] is not null: u8 boolean : 0x00 or 0x01
                    sen.writeUInt8(0x01);
                    // category[1]: i32
                    sen.writeInt32LE(thiz.category[1]);
                } else {
                    // category[1] is not null: u8 boolean : 0x00 or 0x01
                    sen.writeUInt8(0x01);
                    // category[1]: i32
                    sen.writeInt32LE(0x00);
                }
                // version: u8
                sen.writeUInt8(thiz.version);
                // compression_flags: u8
                sen.writeUInt8(thiz.compression_flags);
                // res count: i32
                sen.writeInt32LE(thiz.res.length);
                for (let k = 0; k < thiz.res.length; k++) {
                    // res member
                    const This = thiz.res[k];
                    // path size: i32
                    sen.writeInt32LE(This.path.length);
                    // path: string (joined by '\\' (Windows style)) ex: "ATLASES\\ALWAYSLOADED_1536_00.PTX"
                    sen.writeString(This.path);
                    const has_ptx_info: boolean = This.ptx_info !== null;
                    const has_ptx_property: boolean = This.ptx_property !== null;
                    // has ptx_info (ptx_info is not null): u8 boolean : 0x00 or 0x01
                    sen.writeBool(has_ptx_info);
                    // has ptx_property (ptx_property is not null): u8 boolean : 0x00 or 0x01
                    sen.writeBool(has_ptx_property);
                    if (has_ptx_info) {
                        // id is not null: u8 boolean
                        sen.writeUInt8(0x01);
                        // id: i32 or null
                        sen.writeInt32LE(This.ptx_info!.id);
                        // width is not null: u8 boolean
                        sen.writeUInt8(0x01);
                        // width: i32 or null
                        sen.writeInt32LE(This.ptx_info!.width);
                        // height is not null: u8 boolean
                        sen.writeUInt8(0x01);
                        // height: i32 or null
                        sen.writeInt32LE(This.ptx_info!.height);
                    } else {
                        // id is not null: u8 boolean
                        sen.writeUInt8(0x00);
                        // id: i32 or null
                        sen.writeInt32LE(0x00);
                        // width is not null: u8 boolean
                        sen.writeUInt8(0x00);
                        // width: i32 or null
                        sen.writeInt32LE(0x00);
                        // height is not null: u8 boolean
                        sen.writeUInt8(0x00);
                        // height: i32 or null
                        sen.writeInt32LE(0x00);
                    }
                    if (has_ptx_property) {
                        // format is not null: u8 boolean
                        sen.writeUInt8(0x01);
                        // format: i32 or null
                        sen.writeInt32LE(This.ptx_property!.format);
                        // pitch is not null: u8 boolean
                        sen.writeUInt8(0x01);
                        // pitch: i32 or null
                        sen.writeInt32LE(This.ptx_property!.pitch);
                        if (This.ptx_property!.alpha_size === null) {
                            // alpha_size is not null: u8 boolean
                            sen.writeUInt8(0x00);
                            // alpha_size: i32 or null
                            sen.writeInt32LE(0x00);
                        } else {
                            // alpha_size is not null: u8 boolean
                            sen.writeUInt8(0x01);
                            // alpha_size: i32 or null
                            sen.writeInt32LE(This.ptx_property!.alpha_size!);
                        }
                        if (This.ptx_property!.alpha_format === null) {
                            // alpha_size is not null: u8 boolean
                            sen.writeUInt8(0x00);
                            // alpha_size: i32 or null
                            sen.writeInt32LE(0x00);
                        } else {
                            // alpha_size is not null: u8 boolean
                            sen.writeUInt8(0x01);
                            // alpha_size: i32 or null
                            sen.writeInt32LE(This.ptx_property!.alpha_format!);
                        }
                    } else {
                        // format is not null: u8 boolean
                        sen.writeUInt8(0x00);
                        // format: i32 or null
                        sen.writeInt32LE(0x00);
                        // pitch is not null: u8 boolean
                        sen.writeUInt8(0x00);
                        // pitch: i32 or null
                        sen.writeInt32LE(0x00);
                        // alpha_size is not null: u8 boolean
                        sen.writeUInt8(0x00);
                        // alpha_size: i32 or null
                        sen.writeInt32LE(0x00);
                        // alpha_format is not null: u8 boolean
                        sen.writeUInt8(0x00);
                        // alpha_format: i32 or null
                        sen.writeInt32LE(0x00);
                    }
                    // rsg size: u32
                    sen.writeUInt32LE(This.rsg.size());
                    // rsg data: write
                    sen.writeBytes(This.rsg.toBytes());
                }
            }
        }
        return sen;
    }

    export function decode(sen: Sen.Shell.SenBuffer): Structure {
        const magic = sen.readString(0x03);
        if (magic !== "sen") {
            throw new Error(`Mismatch Sen package magic, must begins with "sen"`);
        }
        const struct: Structure = {
            version: sen.readUInt8() as unknown as number,
            createdTime: sen.readString(sen.readInt32LE()),
            default: {
                extends_texture_information_for_pvz2c: sen.readUInt8() as unknown as number,
                version: sen.readUInt8() as unknown as number,
                ptx_info_size: sen.readUInt8() as unknown as number,
            },
            group: [],
        };
        const group_size: number = sen.readInt32LE() as unknown as number;
        for (let i = 0; i < group_size; i++) {
            const group: Group = {
                group_name: sen.readString(sen.readInt32LE()),
                is_composite: (sen.readUInt8() as unknown as number) === 0x01,
                group_member: [],
            };
            const group_member_size: number = sen.readInt32LE() as unknown as number;
            for (let j = 0; j < group_member_size; j++) {
                // subgroup size: i32
                // subgroup name: string
                group.group_member[j].subgroup_name = sen.readString(sen.readInt32LE());
                // category[0] is not null: u8 boolean : 0x00 or 0x01
                // category[0]: i32
                const first_category_is_not_null: boolean = (sen.readUInt8() as unknown as number) === 0x01;
                if (first_category_is_not_null) {
                    group.group_member[j].category[0] = sen.readInt32LE() as unknown as number;
                } else {
                    group.group_member[j].category[0] = null;
                    sen.readInt32LE();
                }
                // category[1] is not null: u8 boolean : 0x00 or 0x01
                // category[1]: i32
                const second_category_is_not_null: boolean = (sen.readUInt8() as unknown as number) === 0x01;
                if (second_category_is_not_null) {
                    group.group_member[j].category[1] = sen.readInt32LE() as unknown as number;
                } else {
                    group.group_member[j].category[1] = null;
                    sen.readInt32LE();
                }
                // version: u8
                group.group_member[j].version = sen.readUInt8() as unknown as number;
                // compression_flags: u8
                group.group_member[j].compression_flags = sen.readUInt8() as unknown as number;
                // res count: i32
                const resource_count: number = sen.readInt32LE() as unknown as number;
                // res member
                group.group_member[j].res = [];
                for (let k = 0; k < resource_count; k++) {
                    // this
                    const This = group.group_member[j].res[k];
                    // path size: i32
                    // path: string (joined by '\\' (Windows style)) ex: "ATLASES\\ALWAYSLOADED_1536_00.PTX"
                    This.path = sen.readString(sen.readInt32LE());
                    // has ptx_info (ptx_info is not null): u8 boolean : 0x00 or 0x01
                    const resource_has_ptx_info: boolean = (sen.readUInt8() as unknown as number) === 0x01;
                    // has ptx_property (ptx_property is not null): u8 boolean : 0x00 or 0x01
                    const resource_has_ptx_property: boolean = (sen.readUInt8() as unknown as number) === 0x01;
                    if (resource_has_ptx_info) {
                        // id is not null: u8 boolean
                        const id_must_not_be_null: boolean = (sen.readUInt8() as unknown as number) === 0x01;
                        if (!id_must_not_be_null) {
                            throw new Error("id is null");
                        }
                        // id: i32 or null
                        const id: number = sen.readInt32LE() as unknown as number;
                        // width is not null: u8 boolean
                        const width_must_not_be_null: boolean = (sen.readUInt8() as unknown as number) === 0x01;
                        if (!width_must_not_be_null) {
                            throw new Error("width is null");
                        }
                        // width: i32 or null
                        const width: number = sen.readInt32LE() as unknown as number;
                        // height is not null: u8 boolean
                        const height_must_not_be_null: boolean = (sen.readUInt8() as unknown as number) === 0x01;
                        if (!height_must_not_be_null) {
                            throw new Error("height is null");
                        }
                        // height: i32 or null
                        const height: number = sen.readInt32LE() as unknown as number;
                        This.ptx_info = {
                            id: id,
                            width: width,
                            height: height,
                        };
                    } else {
                        // id is not null: u8 boolean
                        sen.readUInt8();
                        // id: i32 or null
                        sen.readInt32LE();
                        // width is not null: u8 boolean
                        sen.readUInt8();
                        // width: i32 or null
                        sen.readInt32LE();
                        // height is not null: u8 boolean
                        sen.readUInt8();
                        // height: i32 or null
                        sen.readInt32LE();
                    }
                    if (resource_has_ptx_property) {
                        // format is not null: u8 boolean
                        const format_must_not_be_null: boolean = (sen.readUInt8() as unknown as number) === 0x01;
                        // format: i32 or null
                        const format: number = sen.readInt32LE() as unknown as number;
                        // pitch is not null: u8 boolean
                        const pitch_must_not_be_null: boolean = (sen.readUInt8() as unknown as number) === 0x01;
                        // pitch: i32 or null
                        const pitch: number = sen.readInt32LE() as unknown as number;
                        // alpha_size is not null: u8 boolean
                        const alpha_size_might_not_be_null: boolean = (sen.readUInt8() as unknown as number) === 0x01;
                        // alpha_size: i32 or null
                        const alpha_size: number | null = sen.readInt32LE() as unknown as number;
                        // alpha_format is not null: u8 boolean
                        const alpha_format_might_not_be_null: boolean = (sen.readUInt8() as unknown as number) === 0x01;
                        // alpha_format: i32 or null
                        const alpha_format: number | null = sen.readInt32LE() as unknown as number;
                        This.ptx_property = {
                            format: format,
                            pitch: pitch,
                            alpha_size: alpha_size_might_not_be_null ? alpha_size : null,
                            alpha_format: alpha_format_might_not_be_null ? alpha_format : null,
                        };
                    } else {
                        // format is not null: u8 boolean
                        sen.readUInt8();
                        // format: i32 or null
                        sen.readInt32LE();
                        // pitch is not null: u8 boolean
                        sen.readUInt8();
                        // pitch: i32 or null
                        sen.readInt32LE();
                        // alpha_size is not null: u8 boolean
                        sen.readUInt8();
                        // alpha_size: i32 or null
                        sen.readInt32LE();
                        // alpha_format is not null: u8 boolean
                        sen.readUInt8();
                        // alpha_format: i32 or null
                        sen.readInt32LE();
                    }
                    // rsg size: u32
                    const rsg_size = sen.readUInt32LE();
                    // rsg
                    This.rsg = new Sen.Shell.SenBuffer(sen.readBytes(rsg_size));
                }
            }
            struct.group.push(group);
        }
        return struct;
    }

    export function decode_fs(sen: Sen.Shell.SenBuffer): void {
        const struct = decode(sen);
        return;
    }

    export function execute() {
        const sen = encode({ extends_texture_information_for_pvz2c: 0n, group: {}, version: 4, ptx_info_size: 16 });
        sen.OutFile("D:/Workspace/test/New Folder/ipad3_fs.rsb.bundle/test.sen");
        return;
    }
}
Sen.Script.Modules.Support.Haruma.Package.Encode.execute();
