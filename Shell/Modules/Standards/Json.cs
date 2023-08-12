using Newtonsoft.Json.Linq;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Sen.Shell.Modules.Standards
{

    public abstract class Json_Abstract
    {
        public abstract Generic_T ParseJson<Generic_T>(string text_json);

        public abstract string StringifyJson<Generic_T>(Generic_T json_serialized, JsonSerializerOptions? SerializerOptions);

    }

    public abstract class Localization_Abstract
    {
        public abstract string Get(string property, string LanguageDirectory, string Language);

    }

    public class Entry
    {
        public required Default @default;
    }

    public class Default
    {
        public required string language;
    }

    public class Localization : Localization_Abstract
    {
        public Localization() { }
        public override string Get(string property, string ScriptDirectory, string Language)
        {
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            var path = new Sen.Shell.Modules.Standards.IOModule.ImplementPath();
            var file_path = path.Resolve($"{ScriptDirectory}/{Language}.json");
            if (!fs.FileExists(file_path))
            {
                return property;
            }
            var localeData = JsonDocument.Parse(fs.ReadText(file_path, IOModule.EncodingType.UTF8));

            if (!localeData.RootElement.TryGetProperty(property, out JsonElement value))
            {
                return property;
            }
            else
            {
                #pragma warning disable CS8603
                return value.GetString();
            }
        }

        public static string GetString(string json_key)
        {
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            var path = new Sen.Shell.Modules.Standards.IOModule.ImplementPath();
            var local = new Localization();
            return local.Get(json_key,path.Join(Sen.Shell.Program.Script_Directory, "Modules", "Customization", "Language"),
                (string)Newtonsoft.Json.JsonConvert.DeserializeObject<Entry>(fs.ReadText(path.Join(Sen.Shell.Program.Script_Directory, "Modules", "Customization", "entry.json"), IOModule.EncodingType.UTF8))!.@default!.language!
                );
        }

    }


    public abstract class SerializeExtends
    {
        public override string ToString()
        {
            var JsonImplementTest = new Sen.Shell.Modules.Standards.JsonImplement();
            return JsonImplementTest.StringifyJson(this, null);
        }
    }



    public class CustomIndentedJsonConverter<T> : JsonConverter<T>
    {
        public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return JsonSerializer.Deserialize<T>(ref reader, options);
        }

        public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
        {
            var json = JsonSerializer.Serialize(value, options);
            var indentedJson = json.Replace("\n", "\n\t");
            writer.WriteStringValue(indentedJson);
        }
    }


    public class JsonImplement : Json_Abstract
    {


        public JsonImplement() { }

        public override Generic_T ParseJson<Generic_T>(string text_json)
        {
            #pragma warning disable CS8603
            return JsonSerializer.Deserialize<Generic_T>(text_json);
        }


        public override string StringifyJson<Generic_T>(Generic_T json_serialized, JsonSerializerOptions? SerializerOptions)
        {
            SerializerOptions ??= new()
            {
                WriteIndented = true,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                Converters = { new CustomIndentedJsonConverter<Generic_T>() }
            };
;
            return JsonSerializer.Serialize<Generic_T>(json_serialized, SerializerOptions);
        }
    }




    public static class Object
    {

        public static string[] Keys<Generic_T>(Generic_T obj)
        {
            var type = obj.GetType();
            var propertyInfos = type.GetProperties();
            var keys = new List<string>();
            foreach (var propertyInfo in propertyInfos)
            {
                keys.Add(propertyInfo.Name);
            }
            return keys.ToArray();
        }

        public static object[] Values<Generic_T>(Generic_T obj)
        {
            var values = new List<object>();
            var type = obj.GetType();
            var propertyInfos = type.GetProperties();
            foreach (var propertyInfo in propertyInfos)
            {
                #pragma warning disable CS8604
                values.Add(propertyInfo.GetValue(obj));
            }
            return values.ToArray();
        }


        public static object[][] Entries<Generic_T>(Generic_T obj)
        {
            var entries = new List<object[]>();
            var keys = Object.Keys<Generic_T>(obj);
            var values = Object.Values<Generic_T>(obj);
            for(var i = 0; i < keys.Length; i++)
            {
                entries.Add(new object[2] { keys[i], values[i] });
            }
            return entries.ToArray();
        }

        public static Generic_T FromEntries<Generic_T>(object[][] obj_array)
        {
            #pragma warning disable CS8600
            dynamic obj = Activator.CreateInstance<Generic_T>();
            foreach (var item in obj_array)
            {
                var key = item[0].ToString();
                var value = item[1];

                var property = typeof(Generic_T).GetProperty(key);
                if (property is null)
                {
                    #pragma warning disable CS8602
                    property.SetValue(obj, value);
                }
            }
            return obj;
        }



    }
}
