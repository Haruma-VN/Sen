using System.Text.Encodings.Web;
using System.Text.Json;

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

    public class Localization : Localization_Abstract
    {
        public Localization() { }
        public override string Get(string property, string ScriptDirectory, string Language)
        {
            var fs = new Sen.Shell.Modules.Standards.IOModule.FileSystem();
            var path = new Sen.Shell.Modules.Standards.IOModule.Implement_Path();
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

    }


    public abstract class SerializeExtends
    {
        public override string ToString()
        {
            var JsonImplementTest = new Sen.Shell.Modules.Standards.JsonImplement();
            return JsonImplementTest.StringifyJson(this, null);
        }
    }


    public class JsonImplement : Json_Abstract
    {
        private readonly JsonSerializerOptions ConstraintJsonSerializerOptions = new()
        {
            WriteIndented = true,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        };

        public JsonImplement() { }

        public override Generic_T ParseJson<Generic_T>(string text_json)
        {
            #pragma warning disable CS8603
            return JsonSerializer.Deserialize<Generic_T>(text_json);
        }


        public override string StringifyJson<Generic_T>(Generic_T json_serialized, JsonSerializerOptions? SerializerOptions)
        {
            SerializerOptions ??= this.ConstraintJsonSerializerOptions;
            return JsonSerializer.Serialize<Generic_T>(json_serialized, SerializerOptions);
        }


    }
}
