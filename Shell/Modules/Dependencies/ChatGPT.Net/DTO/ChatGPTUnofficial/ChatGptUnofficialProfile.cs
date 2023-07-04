using System.Text.Json.Serialization;

namespace ChatGPT.Net.DTO.ChatGPTUnofficial;

public class ChatGptUnofficialProfile
{
    [JsonPropertyName("user")]
    public ChatGPTUnofficialUser User { get; set; }

    [JsonPropertyName("expires")]
    public DateTimeOffset Expires { get; set; }

    [JsonPropertyName("accessToken")]
    public string AccessToken { get; set; }
    [JsonPropertyName("error")]
    public string? Error { get; set; }
}

public class ChatGPTUnofficialUser
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("email")]
    public string Email { get; set; }

    [JsonPropertyName("image")]
    public Uri Image { get; set; }

    [JsonPropertyName("picture")]
    public Uri Picture { get; set; }

    [JsonPropertyName("groups")]
    public List<string> Groups { get; set; }
}