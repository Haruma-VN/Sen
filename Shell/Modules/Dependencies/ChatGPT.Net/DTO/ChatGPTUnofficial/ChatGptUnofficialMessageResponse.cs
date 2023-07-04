using System.Text.Json.Serialization;

namespace ChatGPT.Net.DTO.ChatGPTUnofficial;


public class ChatGptUnofficialMessageResponse
{
    [JsonPropertyName("message")]
    public MessageClass Message { get; set; }

    [JsonPropertyName("conversation_id")]
    public string ConversationId { get; set; }

    [JsonPropertyName("error")]
    public object Error { get; set; }
}

public class MessageClass
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("author")]
    public ResponseAuthor Author { get; set; }

    [JsonPropertyName("create_time")]
    public double CreateTime { get; set; }

    [JsonPropertyName("update_time")]
    public object UpdateTime { get; set; }

    [JsonPropertyName("content")]
    public ResponseContent Content { get; set; }

    [JsonPropertyName("end_turn")]
    public object EndTurn { get; set; }

    [JsonPropertyName("weight")]
    public long Weight { get; set; }

    [JsonPropertyName("metadata")]
    public MessageMetadata Metadata { get; set; }

    [JsonPropertyName("recipient")]
    public string Recipient { get; set; }
}

public class ResponseAuthor
{
    [JsonPropertyName("role")]
    public string Role { get; set; }

    [JsonPropertyName("name")]
    public object Name { get; set; }

    [JsonPropertyName("metadata")]
    public AuthorMetadata Metadata { get; set; }
}

public class AuthorMetadata
{
}

public class ResponseContent
{
    [JsonPropertyName("content_type")]
    public string ContentType { get; set; }

    [JsonPropertyName("parts")]
    public List<string> Parts { get; set; }
}

public class MessageMetadata
{
    [JsonPropertyName("message_type")]
    public string MessageType { get; set; }

    [JsonPropertyName("model_slug")]
    public string ModelSlug { get; set; }
}