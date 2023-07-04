using System.Text.Json.Serialization;

namespace ChatGPT.Net.DTO.ChatGPT;

public class ChatGptResponse
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("object")]
    public string Object { get; set; }

    [JsonPropertyName("created")]
    public long Created { get; set; }

    [JsonPropertyName("model")]
    public string Model { get; set; }

    [JsonPropertyName("usage")]
    public Usage Usage { get; set; }

    [JsonPropertyName("choices")]
    public List<Choice> Choices { get; set; }

    [JsonPropertyName("error")]
    public Error? Error { get; set; }
}

public class Choice
{
    [JsonPropertyName("message")]
    public ChatGptMessage Message { get; set; }

    [JsonPropertyName("finish_reason")]
    public string FinishReason { get; set; }

    [JsonPropertyName("index")]
    public long Index { get; set; }
}

public class Usage
{
    [JsonPropertyName("prompt_tokens")]
    public long PromptTokens { get; set; }

    [JsonPropertyName("completion_tokens")]
    public long CompletionTokens { get; set; }

    [JsonPropertyName("total_tokens")]
    public long TotalTokens { get; set; }
}

public class Error
{
    [JsonPropertyName("message")]
    public string Message { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("param")]
    public object Param { get; set; }

    [JsonPropertyName("code")]
    public string Code { get; set; }
}