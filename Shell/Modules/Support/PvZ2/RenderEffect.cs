using System.Text.Json;
using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Support.PvZ2.RSB;
namespace Sen.Shell.Modules.Support.PvZ2.RenderEffect
{
    public class PopcapRenderEffect
    {

        public class PopcapRenderEffectObject
        {
            public required Block1[] block_1 { get; set; }
            public required Block2[] block_2 { get; set; }
            public required Block3[] block_3 { get; set; }
            public required Block4[] block_4 { get; set; }
            public required Block5[] block_5 { get; set; }
            public required Block6[] block_6 { get; set; }
            public required Block7[] block_7 { get; set; }
            public required Block8[] block_8 { get; set; }
        }

        public class Block1
        {
            public required uint unknown_1 { get; set; }
            public required uint unknown_2 { get; set; }
            public required uint unknown_3 { get; set; }
            public required uint unknown_4 { get; set; }
            public required uint unknown_5 { get; set; }
            public required uint unknown_6 { get; set; }
        }

        public class Block2
        {
            public required uint unknown_1 { get; set; }
            public required uint unknown_2 { get; set; }
        }

        public class Block3
        {
            public required uint unknown_2 { get; set; }
            public required string @string { get; set; }
        }

        public class Block4
        {
            public required uint unknown_1 { get; set; }
            public required uint unknown_2 { get; set; }
            public required uint unknown_3 { get; set; }
            public required uint unknown_4 { get; set; }
            public required uint unknown_5 { get; set; }
        }

        public class Block5
        {
            public required uint unknown_1 { get; set; }
            public required uint unknown_2 { get; set; }
            public required uint unknown_3 { get; set; }
            public required uint unknown_4 { get; set; }
            public required uint unknown_5 { get; set; }
            public required uint unknown_6 { get; set; }
            public required uint unknown_7 { get; set; }
        }

        public class Block6
        {
            public required uint unknown_1 { get; set; }
            public required uint unknown_2 { get; set; }
            public required uint unknown_3 { get; set; }
            public required uint unknown_4 { get; set; }
            public required uint unknown_5 { get; set; }
        }

        public class Block7
        {
            public required uint unknown_1 { get; set; }
            public required uint unknown_2 { get; set; }
        }

        public class Block8
        {
            public required uint unknown_1 { get; set; }
            public required uint unknown_2 { get; set; }
            public required uint unknown_3 { get; set; }
            public required uint unknown_4 { get; set; }
            public required uint unknown_5 { get; set; }
        }

        public class PopcapRenderEffectHead
        {
            public static readonly string magic = "xfcp";
            public static readonly uint version = 1;

            public uint Block1Count { get; set; }
            public uint Block1SectionOffset { get; set; }
            public static readonly uint Block1SectionHeadOffset = 0x08;
            public static readonly uint Block1SectionSize = 0x18;

            public uint Block2Count { get; set; }
            public uint Block2SectionOffset { get; set; }
            public static readonly uint Block2SectionHeadOffset = 0x14;
            public static readonly uint Block2SectionSize = 0x08; // 0x08 && 0x0C

            public uint Block3Count { get; set; }
            public uint Block3SectionOffset { get; set; }
            public static readonly uint Block3SectionHeadOffset = 0x20;
            public static readonly uint Block3SectionSize = 0x0C;

            public uint Block4Count { get; set; }
            public uint Block4SectionOffset { get; set; }
            public static readonly uint Block4SectionHeadOffset = 0x2C;
            public static readonly uint Block4SectionSize = 0x14;

            public uint Block5Count { get; set; }
            public uint Block5SectionOffset { get; set; }
            public static readonly uint Block5SectionHeadOffset = 0x38;
            public static readonly uint Block5SectionSize = 0x1C;

            public uint Block6Count { get; set; }
            public uint Block6SectionOffset { get; set; }
            public static readonly uint Block6SectionHeadOffset = 0x44;
            public static readonly uint Block6SectionSize = 0x14;

            public uint Block7Count { get; set; }
            public uint Block7SectionOffset { get; set; }
            public static readonly uint Block7SectionHeadOffset = 0x50;
            public static readonly uint Block7SectionSize = 0x08;

            public uint Block8Count { get; set; }
            public uint Block8SectionOffset { get; set; }
            public static readonly uint Block8SectionHeadOffset = 0x5C;
            public static readonly uint Block8SectionSize = 0x14; // 0x0C && 0x14

            public uint StringSectionOffset { get; set; }
        }

        public static void Decode(SenBuffer POPFXReader, string fileOut)
        {
            var POPFXHeadInfo = new PopcapRenderEffectHead();
            if (POPFXReader.readString(4) != PopcapRenderEffectHead.magic)
            {
                throw new Exception("Invaild popfx magic");
            }
            if (POPFXReader.readUInt32LE() != PopcapRenderEffectHead.version)
            {
                throw new Exception("Invaild popfx version");
            }
            {
                POPFXHeadInfo.Block1Count = POPFXReader.readUInt32LE();
                POPFXHeadInfo.Block1SectionOffset = POPFXReader.readUInt32LE();
                if (POPFXReader.readUInt32LE() != PopcapRenderEffectHead.Block1SectionSize) {
                    throw new Exception("Invaild block1 size");
                }
                POPFXHeadInfo.Block2Count = POPFXReader.readUInt32LE();
                POPFXHeadInfo.Block2SectionOffset = POPFXReader.readUInt32LE();
                if (POPFXReader.readUInt32LE() != PopcapRenderEffectHead.Block2SectionSize) {
                    throw new Exception("Invaild block2 size");
                }
                POPFXHeadInfo.Block3Count = POPFXReader.readUInt32LE();
                POPFXHeadInfo.Block3SectionOffset = POPFXReader.readUInt32LE();
                if (POPFXReader.readUInt32LE() != PopcapRenderEffectHead.Block3SectionSize) {
                    throw new Exception("Invaild block3 size");
                }
                POPFXHeadInfo.Block4Count = POPFXReader.readUInt32LE();
                POPFXHeadInfo.Block4SectionOffset = POPFXReader.readUInt32LE();
                if (POPFXReader.readUInt32LE() != PopcapRenderEffectHead.Block4SectionSize) {
                    throw new Exception("Invaild block4 size");
                }
                POPFXHeadInfo.Block5Count = POPFXReader.readUInt32LE();
                POPFXHeadInfo.Block5SectionOffset = POPFXReader.readUInt32LE();
                if (POPFXReader.readUInt32LE() != PopcapRenderEffectHead.Block5SectionSize) {
                    throw new Exception("Invaild block5 size");
                }
                POPFXHeadInfo.Block6Count = POPFXReader.readUInt32LE();
                POPFXHeadInfo.Block6SectionOffset = POPFXReader.readUInt32LE();
                if (POPFXReader.readUInt32LE() != PopcapRenderEffectHead.Block6SectionSize) {
                    throw new Exception("Invaild block6 size");
                }
                POPFXHeadInfo.Block7Count = POPFXReader.readUInt32LE();
                POPFXHeadInfo.Block7SectionOffset = POPFXReader.readUInt32LE();
                if (POPFXReader.readUInt32LE() != PopcapRenderEffectHead.Block7SectionSize) {
                    throw new Exception("Invaild block7 size");
                }
                POPFXHeadInfo.Block8Count = POPFXReader.readUInt32LE();
                POPFXHeadInfo.Block8SectionOffset = POPFXReader.readUInt32LE();
                if (POPFXReader.readUInt32LE() != PopcapRenderEffectHead.Block8SectionSize) {
                    throw new Exception("Invaild block8 size");
                }
                POPFXHeadInfo.StringSectionOffset = POPFXReader.readUInt32LE();
            }
            var block1 = new Block1[POPFXHeadInfo.Block1Count];
            POPFXReader.readOffset = POPFXHeadInfo.Block1SectionOffset;
            for (var i = 0; i < POPFXHeadInfo.Block1Count; i++) {
                block1[i] = new Block1 {
                    unknown_1 = POPFXReader.readUInt32LE(),
                    unknown_2 = POPFXReader.readUInt32LE(),
                    unknown_3 = POPFXReader.readUInt32LE(),
                    unknown_4 = POPFXReader.readUInt32LE(),
                    unknown_5 = POPFXReader.readUInt32LE(),
                    unknown_6 = POPFXReader.readUInt32LE()
                };
            }
            var block2 = new Block2[POPFXHeadInfo.Block2Count];
            POPFXReader.readOffset = POPFXHeadInfo.Block2SectionOffset;
            for (var i = 0; i < POPFXHeadInfo.Block2Count; i++) {
                block2[i] = new Block2 {
                    unknown_1 = POPFXReader.readUInt32LE(),
                    unknown_2 = POPFXReader.readUInt32LE()
                };
            }
            var StringSection = new SenBuffer(POPFXReader.getBytes((int)(POPFXReader.length - POPFXHeadInfo.StringSectionOffset), POPFXHeadInfo.StringSectionOffset));
            var block3 = new Block3[POPFXHeadInfo.Block3Count];
            POPFXReader.readOffset = POPFXHeadInfo.Block3SectionOffset;
            for (var i = 0; i < POPFXHeadInfo.Block3Count; i++) {
                POPFXReader.readUInt32LE();
                block3[i] = new Block3 {
                    unknown_2 = POPFXReader.readUInt32LE(),
                    @string = StringSection.readStringByEmpty(POPFXReader.readUInt32LE())
                };
            }
            var block4 = new Block4[POPFXHeadInfo.Block4Count];
            POPFXReader.readOffset = POPFXHeadInfo.Block4SectionOffset;
            for (var i = 0; i < POPFXHeadInfo.Block4Count; i++) {
                block4[i] = new Block4 {
                    unknown_1 = POPFXReader.readUInt32LE(),
                    unknown_2 = POPFXReader.readUInt32LE(),
                    unknown_3 = POPFXReader.readUInt32LE(),
                    unknown_4 = POPFXReader.readUInt32LE(),
                    unknown_5 = POPFXReader.readUInt32LE()
                };
            }
            var block5 = new Block5[POPFXHeadInfo.Block5Count];
            POPFXReader.readOffset = POPFXHeadInfo.Block5SectionOffset;
            for (var i = 0; i < POPFXHeadInfo.Block5Count; i++) {
                block5[i] = new Block5 {
                    unknown_1 = POPFXReader.readUInt32LE(),
                    unknown_2 = POPFXReader.readUInt32LE(),
                    unknown_3 = POPFXReader.readUInt32LE(),
                    unknown_4 = POPFXReader.readUInt32LE(),
                    unknown_5 = POPFXReader.readUInt32LE(),
                    unknown_6 = POPFXReader.readUInt32LE(),
                    unknown_7 = POPFXReader.readUInt32LE()
                };
            }
            var block6 = new Block6[POPFXHeadInfo.Block6Count];
            POPFXReader.readOffset = POPFXHeadInfo.Block6SectionOffset;
            for (var i = 0; i < POPFXHeadInfo.Block6Count; i++) {
                block6[i] = new Block6 {
                    unknown_1 = POPFXReader.readUInt32LE(),
                    unknown_2 = POPFXReader.readUInt32LE(),
                    unknown_3 = POPFXReader.readUInt32LE(),
                    unknown_4 = POPFXReader.readUInt32LE(),
                    unknown_5 = POPFXReader.readUInt32LE()
                };
            }
            var block7 = new Block7[POPFXHeadInfo.Block7Count];
            POPFXReader.readOffset = POPFXHeadInfo.Block7SectionOffset;
            for (var i = 0; i < POPFXHeadInfo.Block7Count; i++) {
                block7[i] = new Block7 {
                    unknown_1 = POPFXReader.readUInt32LE(),
                    unknown_2 = POPFXReader.readUInt32LE()
                };
            }
            var block8 = new Block8[POPFXHeadInfo.Block8Count];
            POPFXReader.readOffset = POPFXHeadInfo.Block8SectionOffset;
            for (var i = 0; i < POPFXHeadInfo.Block8Count; i++) {
                block8[i] = new Block8 {
                    unknown_1 = POPFXReader.readUInt32LE(),
                    unknown_2 = POPFXReader.readUInt32LE(),
                    unknown_4 = POPFXReader.readUInt32LE(),
                    unknown_5 = POPFXReader.readUInt32LE(),
                    unknown_3 = POPFXReader.readUInt32LE()
                };
            }
            {
                var POPFXObject = new PopcapRenderEffectObject() {
                    block_1 = block1,
                    block_2 = block2,
                    block_3 = block3,
                    block_4 = block4,
                    block_5 = block5,
                    block_6 = block6,
                    block_7 = block7,
                    block_8 = block8
                };
                var jsonString = JsonSerializer.Serialize(POPFXObject);
                File.WriteAllText(fileOut, RSBFunction.JsonPrettify(jsonString));
            }
        }

        public static void Encode(PopcapRenderEffectObject POPFXObject, string fileOut)
        {
            var POPFXWriter = new SenBuffer();
            var DataWriter = new SenBuffer();
            DataWriter.writeNull(0x6C);
            POPFXWriter.writeString("xfcp");
            POPFXWriter.writeUInt32LE(1);
            long blockSectionOffset = 0x6C;
            POPFXWriter.writeOffset = PopcapRenderEffectHead.Block1SectionHeadOffset;
            if (POPFXObject.block_1!.Length > 0)
            {
                POPFXWriter.writeUInt32LE((uint)POPFXObject.block_1!.Length);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x18);
                for (var i = 0; i < POPFXObject.block_1!.Length; i++)
                {
                    DataWriter.writeUInt32LE(POPFXObject.block_1![i].unknown_1);
                    DataWriter.writeUInt32LE(POPFXObject.block_1![i].unknown_2);
                    DataWriter.writeUInt32LE(POPFXObject.block_1![i].unknown_3);
                    DataWriter.writeUInt32LE(POPFXObject.block_1![i].unknown_4);
                    DataWriter.writeUInt32LE(POPFXObject.block_1![i].unknown_5);
                    DataWriter.writeUInt32LE(POPFXObject.block_1![i].unknown_6);
                }
            }
            else
            {
                POPFXWriter.writeUInt32LE(0);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x18);
            }
            POPFXWriter.writeOffset = PopcapRenderEffectHead.Block5SectionHeadOffset;
            blockSectionOffset = DataWriter.writeOffset;
            if (POPFXObject.block_5!.Length > 0)
            {
                POPFXWriter.writeUInt32LE((uint)POPFXObject.block_5!.Length);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x1C);
                for (var i = 0; i < POPFXObject.block_5!.Length; i++)
                {
                    DataWriter.writeUInt32LE(POPFXObject.block_5![i].unknown_1);
                    DataWriter.writeUInt32LE(POPFXObject.block_5![i].unknown_2);
                    DataWriter.writeUInt32LE(POPFXObject.block_5![i].unknown_3);
                    DataWriter.writeUInt32LE(POPFXObject.block_5![i].unknown_4);
                    DataWriter.writeUInt32LE(POPFXObject.block_5![i].unknown_5);
                    DataWriter.writeUInt32LE(POPFXObject.block_5![i].unknown_6);
                    DataWriter.writeUInt32LE(POPFXObject.block_5![i].unknown_7);
                }
            }
            else
            {
                POPFXWriter.writeUInt32LE(0);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x1C);
            }
            POPFXWriter.writeOffset = PopcapRenderEffectHead.Block6SectionHeadOffset;
            blockSectionOffset = DataWriter.writeOffset;
            if (POPFXObject.block_6!.Length > 0)
            {
                POPFXWriter.writeUInt32LE((uint)POPFXObject.block_6!.Length);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x14);
                for (var i = 0; i < POPFXObject.block_6!.Length; i++)
                {
                    DataWriter.writeUInt32LE(POPFXObject.block_6![i].unknown_1);
                    DataWriter.writeUInt32LE(POPFXObject.block_6![i].unknown_2);
                    DataWriter.writeUInt32LE(POPFXObject.block_6![i].unknown_3);
                    DataWriter.writeUInt32LE(POPFXObject.block_6![i].unknown_4);
                    DataWriter.writeUInt32LE(POPFXObject.block_6![i].unknown_5);
                }
            }
            else
            {
                POPFXWriter.writeUInt32LE(0);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x14);
            }
            POPFXWriter.writeOffset = PopcapRenderEffectHead.Block2SectionHeadOffset;
            blockSectionOffset = DataWriter.writeOffset;
            if (POPFXObject.block_2!.Length > 0)
            {
                POPFXWriter.writeUInt32LE((uint)POPFXObject.block_2!.Length);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x08);
                for (var i = 0; i < POPFXObject.block_2!.Length; i++)
                {
                    DataWriter.writeUInt32LE(POPFXObject.block_2![i].unknown_1);
                    DataWriter.writeUInt32LE(POPFXObject.block_2![i].unknown_2);
                }
            }
            else
            {
                POPFXWriter.writeUInt32LE(0);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x08);
            }
            var StringSection = new SenBuffer();
            POPFXWriter.writeOffset = PopcapRenderEffectHead.Block3SectionHeadOffset;
            blockSectionOffset = DataWriter.writeOffset;
            if (POPFXObject.block_3!.Length > 0)
            {
                POPFXWriter.writeUInt32LE((uint)POPFXObject.block_3!.Length);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x0C);
                for (var i = 0; i < POPFXObject.block_3!.Length; i++)
                {
                    DataWriter.writeUInt32LE((uint)POPFXObject.block_3![i].@string!.Length);
                    DataWriter.writeUInt32LE(POPFXObject.block_3![i].unknown_2);
                    DataWriter.writeUInt32LE((uint)StringSection.writeOffset);
                    StringSection.writeStringByEmpty(POPFXObject.block_3![i].@string!);
                }
            }
            else
            {
                POPFXWriter.writeUInt32LE(0);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x0C);
            }
            POPFXWriter.writeOffset = PopcapRenderEffectHead.Block4SectionHeadOffset;
            blockSectionOffset = DataWriter.writeOffset;
            if (POPFXObject.block_4!.Length > 0)
            {
                POPFXWriter.writeUInt32LE((uint)POPFXObject.block_4!.Length);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x14);
                for (var i = 0; i < POPFXObject.block_4!.Length; i++)
                {
                    DataWriter.writeUInt32LE(POPFXObject.block_4![i].unknown_1);
                    DataWriter.writeUInt32LE(POPFXObject.block_4![i].unknown_2);
                    DataWriter.writeUInt32LE(POPFXObject.block_4![i].unknown_3);
                    DataWriter.writeUInt32LE(POPFXObject.block_4![i].unknown_4);
                    DataWriter.writeUInt32LE(POPFXObject.block_4![i].unknown_5);
                }
            }
            else
            {
                POPFXWriter.writeUInt32LE(0);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x14);
            }
            POPFXWriter.writeOffset = PopcapRenderEffectHead.Block7SectionHeadOffset;
            blockSectionOffset = DataWriter.writeOffset;
            if (POPFXObject.block_7!.Length > 0)
            {
                POPFXWriter.writeUInt32LE((uint)POPFXObject.block_7!.Length);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x08);
                for (var i = 0; i < POPFXObject.block_7!.Length; i++)
                {
                    DataWriter.writeUInt32LE(POPFXObject.block_7![i].unknown_1);
                    DataWriter.writeUInt32LE(POPFXObject.block_7![i].unknown_2);
                }
            }
            else
            {
                POPFXWriter.writeUInt32LE(0);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x08);
            }
            POPFXWriter.writeOffset = PopcapRenderEffectHead.Block8SectionHeadOffset;
            blockSectionOffset = DataWriter.writeOffset;
            if (POPFXObject.block_8!.Length > 0)
            {
                POPFXWriter.writeUInt32LE((uint)POPFXObject.block_8!.Length);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x14);
                for (var i = 0; i < POPFXObject.block_8!.Length; i++)
                {
                    DataWriter.writeUInt32LE(POPFXObject.block_8![i].unknown_1);
                    DataWriter.writeUInt32LE(POPFXObject.block_8![i].unknown_2);
                    DataWriter.writeUInt32LE(POPFXObject.block_8![i].unknown_4);
                    DataWriter.writeUInt32LE(POPFXObject.block_8![i].unknown_5);
                    DataWriter.writeUInt32LE(POPFXObject.block_8![i].unknown_3);
                }
            }
            else
            {
                POPFXWriter.writeUInt32LE(0);
                POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
                POPFXWriter.writeUInt32LE(0x14);
            }
            blockSectionOffset = DataWriter.writeOffset;
            POPFXWriter.writeUInt32LE((uint)blockSectionOffset);
            POPFXWriter.writeBytes(DataWriter.getBytes((int)DataWriter.length - 0x6C, 0x6C));
            POPFXWriter.writeBytes(StringSection.toBytes());
            DataWriter.Close();
            StringSection.Close();
            {
                POPFXWriter.OutFile(fileOut);
            }
        }
    }
}