using System.Text.Json.Serialization;

namespace ChatGPT.Net.DTO.ChatGPTUnofficial;

public class ChatGptUnofficialMessageRequest
{
    [JsonPropertyName("action")]
    public string Action { get; set; } = "next";

    [JsonPropertyName("messages")]
    public List<MessageElement> Messages { get; set; } = new();

    [JsonPropertyName("parent_message_id")]
    public string ParentMessageId { get; set; } = Guid.NewGuid().ToString();
    [JsonPropertyName("conversation_id")]
    public string ConversationId { get; set; }

    [JsonPropertyName("model")]
    public string Model { get; set; } = "text-davinci-002-render-sha";

    [JsonPropertyName("timezone_offset_min")]
    public long TimezoneOffsetMin { get; set; } = -180;
}

public class MessageElement
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [JsonPropertyName("author")]
    public Author Author { get; set; } = new();

    [JsonPropertyName("content")]
    public Content Content { get; set; } = new();
}

public class Author
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = "user";
}

public class Content
{
    [JsonPropertyName("content_type")]
    public string ContentType { get; set; } = "text";

    [JsonPropertyName("parts")]
    public List<string> Parts { get; set; } = new();
}