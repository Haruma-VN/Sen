using ChatGPT.Net;

namespace Sen.Modules.Support.Misc
{
    public abstract class AbstractGPT
    {
        public abstract string AskChatGPT(string api, string question);
    }

    public class ChatGPT : AbstractGPT
    {
        private async static Task<string> AskChatGPT_C(string api, string question)
        {
            var bot = new ChatGpt(api);

            var response = await bot.Ask(question);
            return response;

        }

        public unsafe sealed override string AskChatGPT(string api, string question)
        {
            try
            {

                Task<string> chatgpt = ChatGPT.AskChatGPT_C(api, question);
                chatgpt.Wait();
                return chatgpt.Result;
            }
            catch (Exception e) {
                throw new Exception(e.ToString());
             }
        }
    }
}
