using System.Text.Json.Serialization;

namespace ChatGPT.Net.DTO.ChatGPT;

public class ChatGptMessage
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = "user";

    [JsonPropertyName("content")]
    public string Content { get; set; }
}