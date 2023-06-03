// // Sen.Script.Test.ResourceConversion.CreateConversion("./src/RESOURCES.json", "./src/res.json");
// Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Official.PopCapResourcesPathConversion.ConvertResourcesOfficialPathToString(
//     "./Scripts/resources.beta.json",
//     "./Scripts/resources.beta2.json",
// );
// const options: Sen.Script.Modules.Third.JavaScript.MaxRectsAlgorithm.IOption = {
//     smart: true,
//     pot: true,
//     square: false,
//     allowRotation: true,
//     tag: false,
//     border: 5,
// }; // Set packing options
// let packer = new Sen.Script.Modules.Third.JavaScript.MaxRectsAlgorithm.MaxRectsPacker(
//     1024,
//     1024,
//     2,
//     options,
// ); // width, height, padding, options
// let input = [
//     // any object with width & height is OK since v2.1.0
//     { width: 600, height: 20, name: "tree", foo: "bar" },
//     { width: 600, height: 20, name: "flower" },
//     { width: 2000, height: 2000, name: "oversized background" },
//     { width: 1000, height: 1000, name: "background", color: 0x000000ff },
//     { width: 1000, height: 1000, name: "overlay", allowRotation: true },
// ];
// packer.addArray(input as any); // Start packing with input array
// // packer.next(); // Start a new packer bin
// packer.bins.forEach((bin) => {
//     Console.Print(null, JSON.stringify(bin.rects, null, "\t"));
// });
// DotNetBitmap.CompositeImages(
//     [
//         {
//             x: 0,
//             y: 0,
//             file_path: "./Scripts/R.png",
//             width: 485,
//             height: 768,
//         },
//     ],
//     "test.png",
//     "./Scripts",
//     1200,
//     1200,
// );
// // Reuse packer
// let bins = packer.save();
// packer.load(bins);
// packer.addArray(input as any);
// Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.ExtractAtlas.ExtractPvZ2AtlasOfficialStructure(
//     [
//         "D:/Res/Tre's Temp File/ZombieSkycityZombossGroup_1536.json",
//         "D:/Res/Tre's Temp File/ZOMBIESKYCITYZOMBOSSGROUP_1536_00.png",
//         "D:/Res/Tre's Temp File/ZOMBIESKYCITYZOMBOSSGROUP_1536_01.png",
//     ],
//     "id",
// // );
// Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.merge_res_json.do_process_whole(
//     "D:/CML/Sen/Shell/bin/Debug/net7.0/win-x64/Scripts/res_split",
//     "D:/CML/Sen/Shell/bin/Debug/net7.0/win-x64/Scripts/resx.json",
// );
// TextureHandler.CreateRGBA8888Decode(
//     "D:/Res/test/ZOMBIESKYCITYZOMBOSSGROUP_1536_00.ptx",
//     "D:/Res/test/ZOMBIESKYCITYZOMBOSSGROUP_1536_02.png",
//     4096,
//     4096,
// );
// TextureHandlerPromise.EncodeAsyncImages(
//     [
//         {
//             source: "D:/Res/test/ZOMBIESKYCITYZOMBOSSGROUP_1536_00.png",
//             output: "D:/Res/test/ZOMBIESKYCITYZOMBOSSGROUP_1536_00.ptx",
//         },
//         {
//             source: "D:/Res/test/ZOMBIESKYCITYZOMBOSSGROUP_1536_01.png",
//             output: "D:/Res/test/ZOMBIESKYCITYZOMBOSSGROUP_1536_01.ptx",
//         },
//     ],
//     Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA8888,
// );

// Sen.Script.Modules.Support.PopCap.PvZ2.Atlas.Split.ExtractUnofficialPvZ2Atlas.ExtractPvZ2AtlasUnofficialStructure(
//     [
//         "D:/Res/Tre's Temp File/ZombieSkycityZombossGroup_1536.json",
//         "D:/Res/Tre's Temp File/ZOMBIESKYCITYZOMBOSSGROUP_1536_00.png",
//         "D:/Res/Tre's Temp File/ZOMBIESKYCITYZOMBOSSGROUP_1536_01.png",
//     ],
//     "id",
// );
// Sen.Script.Modules.Support.PopCap.PvZ2.Resources.Conversion.SplitUnofficialResources.CreateConversion(
//     "D:/Res/Tre's Temp File/res.json",
//     "D:/Res/Tre's Temp File/res.test",
// );
