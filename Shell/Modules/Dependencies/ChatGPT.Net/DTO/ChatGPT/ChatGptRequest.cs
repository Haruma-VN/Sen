using System.Text.Json.Serialization;

namespace ChatGPT.Net.DTO.ChatGPT;

public partial class ChatGptRequest
{
    [JsonPropertyName("model")]
    public string Model { get; set; } = "gpt-3.5-turbo";

    [JsonPropertyName("temperature")]
    public double Temperature { get; set; } = 0.7;

    [JsonPropertyName("max_tokens")]
    public long MaxTokens { get; set; } = 256;

    [JsonPropertyName("n")]
    private long N { get; set; } = 1;

    [JsonPropertyName("stop")]
    public string[]? Stop { get; set; }

    [JsonPropertyName("top_p")]
    public double TopP { get; set; } = 0.9;
    [JsonPropertyName("presence_penalty")]
    public double PresencePenalty { get; set; } = 0.0;

    [JsonPropertyName("frequency_penalty")]
    public double FrequencyPenalty { get; set; } = 0.0;

    [JsonPropertyName("stream")]
    public bool Stream { get; set; } = false;

    [JsonPropertyName("messages")]
    public List<ChatGptMessage> Messages { get; set; } = new();
}