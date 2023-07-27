using System.Text;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using Sen.Shell.Modules.Standards.IOModule;

namespace Sen.Modules.Support.PvZ2
{

    [JsonSerializable(typeof(JsonMap))]

    public class JsonMap
    {
        public required ObjectMap[] objects { get; set; }

        public required uint version = 1;
    }

    [JsonSerializable(typeof(ObjectMap))]

    public class ObjectMap
    {
        public required string[] aliases { get; set; }
        public required string objclass { get; set; }
        public required ObjdataMap objdata { get; set; }
    }

    [JsonSerializable(typeof(ObjdataMap))]

    public class ObjdataMap
    {
        public required Dictionary<string, string> LocStringValues { get; set; }
    }

    [JsonSerializable(typeof(JsonText))]
    public class JsonText
    {
        public required ObjectText[] objects { get; set; }

        public required uint version = 1;
    }

    [JsonSerializable(typeof(ObjectText))]
    public class ObjectText
    {
        public required string[] aliases { get; set; }
        public required string objclass { get; set; }
        public required ObjdataText objdata { get; set; }
    }

    [JsonSerializable(typeof(ObjdataText))]
    public class ObjdataText
    {
        public required List<string> LocStringValues { get; set; }
    }


    public abstract class LawnstringsRequestImplementation
    {
        public abstract string ReadUTF16Le(string filepath);

        public abstract void WriteUTF16Le(string filepath, string data);

        public abstract JsonMap ConvertJsonTextToJsonMap(string inpath);

        public abstract JsonText ConvertJsonMapToJsonText(string inpath);

    }


    public unsafe sealed class Lawnstrings : LawnstringsRequestImplementation
    {

        public unsafe sealed override JsonMap ConvertJsonTextToJsonMap(string inpath)
        {
            var fs = new FileSystem();
            var json_text = JsonConvert.DeserializeObject<JsonText>(fs.ReadText(inpath, EncodingType.UTF8));
            var json_map = new JsonMap() {
                version = 1,
                objects =  new ObjectMap[]
                {
                    new ObjectMap(){
                        aliases = new string[] { "LawnStringsData" },
                        objclass = "LawnStringsData",
                        objdata = new ObjdataMap()
                        {
                            LocStringValues = new Dictionary<string, string>() { },
                        }
                    }
                }

            };
            for(var i = 0; i < json_text!.objects[0].objdata.LocStringValues.Count; i++)
            {
                json_map.objects[0].objdata.LocStringValues[json_text.objects[0].objdata.LocStringValues[i]] = json_text.objects[0].objdata.LocStringValues[i + 1];
                i++;
            }
            return json_map;
        }

        public unsafe sealed override JsonText ConvertJsonMapToJsonText(string inpath)
        {
            var fs = new FileSystem();
            var json_map = JsonConvert.DeserializeObject<JsonMap>(fs.ReadText(inpath, EncodingType.UTF8));
            var json_text = new JsonText()
            {
                version = 1,
                objects = new ObjectText[] {
                new ObjectText()
                {
                    aliases = new string[] { "LawnStringsData" },
                        objclass = "LawnStringsData",
                        objdata = new ObjdataText()
                        {
                            LocStringValues = new List<string>() { },
                        }
                }
            }
            };
            var keys = json_map!.objects[0].objdata.LocStringValues.Keys.ToArray();
            var values = json_map!.objects[0].objdata.LocStringValues.Values.ToArray();
            for(var i = 0; i < keys.Length; i++)
            {
                json_text.objects[0].objdata.LocStringValues.Add(keys[i]);
                json_text.objects[0].objdata.LocStringValues.Add((string)values[i]);
            }
            return json_text;
        }

        public unsafe override sealed string ReadUTF16Le(string filepath)
        {
            using var reader = new StreamReader(filepath, Encoding.Unicode);
            var content = (string) reader.ReadToEnd();
            return content;
        }

        public sealed override unsafe void WriteUTF16Le(string filepath, string data)
        {
            using var writer = new StreamWriter(filepath, false, Encoding.Unicode);
            writer.Write(data);
            return;
        }
    }
}
