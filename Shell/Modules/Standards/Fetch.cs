using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Sen.Shell.Modules.Standards
{

    public abstract class Fetch_Abstract
    {
        public abstract Task<string> FetchApi(string link);
    }

    public class Fetch : Fetch_Abstract
    {
        public Fetch() { }

        public override async Task<string> FetchApi(string link)
        {
            using var client = new HttpClient();
            {
                try
                {
                    // Send a GET request to the API endpoint
                    var response = await client.GetAsync(link);

                    // Check if the response is successful (status code 200-299)
                    if (response.IsSuccessStatusCode)
                    {
                        // Read the response content as a string
                        var responseBody = await response.Content.ReadAsStringAsync();

                        // Process the response data
                        return (responseBody);
                    }
                    else
                    {
                        throw new Exception($"API request failed with status code: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception($"An error occurred: {ex.Message}");
                }
            }
        }
    }
}
