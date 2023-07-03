using System.Text.Json.Serialization;

namespace ChatGPT.Net.DTO.ChatGPT;

public class ChatGptStreamChunkResponse
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("object")]
    public string Object { get; set; }

    [JsonPropertyName("created")]
    public long Created { get; set; }

    [JsonPropertyName("model")]
    public string Model { get; set; }

    [JsonPropertyName("choices")]
    public List<ChunkChoice> Choices { get; set; }
}

public class ChunkChoice
{
    [JsonPropertyName("delta")]
    public Delta Delta { get; set; }

    [JsonPropertyName("index")]
    public long Index { get; set; }

    [JsonPropertyName("finish_reason")]
    public object FinishReason { get; set; }
}

public class Delta
{
    [JsonPropertyName("content")]
    public string Content { get; set; }
}