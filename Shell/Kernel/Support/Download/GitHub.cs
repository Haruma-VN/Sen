using Esprima.Ast;
using Sen.Shell.Kernel.Standards;
using Sen.Shell.Kernel.Standards.IOModule;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

[assembly: SuppressMessage ("Interoperability", "CA1416:Validate platform compatibility", Justification = "<Pending>", Scope = "member", Target = "~M:Sen.Shell.Kernel.Support.Download.DownloadUpdate.HasAdmin~System.Boolean")]

// Download script instantly

namespace Sen.Shell.Kernel.Support.Download
{
    
    using Compress = Standards.Compress;


    [JsonSerializable(typeof(Asset))]
    public class Asset
    {
        [JsonPropertyName ("url")]
        [JsonRequired]
        public required string Url { get; set; }

        [JsonPropertyName("id")]
        [JsonRequired]
        public required int Id { get; set; }

        [JsonPropertyName("node_id")]
        [JsonRequired]
        public required string Node_id { get; set; }

        [JsonPropertyName ("name")]
        [JsonRequired]
        public required string Name { get; set; }

        [JsonPropertyName ("label")]
        [JsonRequired]
        public required object Label { get; set; }

        [JsonPropertyName ("uploader")]
        [JsonRequired]
        public required Uploader Uploader { get; set; }

        [JsonPropertyName ("content_type")]
        [JsonRequired]
        public required string Content_type { get; set; }

        [JsonPropertyName ("state")]
        [JsonRequired]
        public required string State { get; set; }

        [JsonPropertyName ("size")]
        [JsonRequired]
        public required int Size { get; set; }

        [JsonPropertyName("download_count")]
        [JsonRequired]

        public required int Download_count { get; set; }

        [JsonPropertyName("created_at")]
        [JsonRequired]

        public required DateTime Created_at { get; set; }

        [JsonPropertyName ("updated_at")]
        [JsonRequired]
        public required DateTime Updated_at { get; set; }

        [JsonPropertyName ("browser_download_url")]
        [JsonRequired]
        public required string Browser_download_url { get; set; }
    }
    [JsonSerializable (typeof (Author))]

    public class Author
    {
        [JsonPropertyName("login")]
        [JsonRequired]
        public required string Login { get; set; }

        [JsonPropertyName ("id")]
        [JsonRequired]
        public required int Id { get; set; }

        [JsonPropertyName ("node_id")]
        [JsonRequired]

        public required string Node_id { get; set; }

        [JsonPropertyName ("avatar_url")]
        [JsonRequired]
        public required string Avatar_url { get; set; }

        [JsonPropertyName ("gravatar_id")]
        [JsonRequired]
        public required string Gravatar_id { get; set; }

        [JsonPropertyName ("url")]
        [JsonRequired]

        public required string Url { get; set; }

        [JsonPropertyName ("html_url")]
        [JsonRequired]
        public required string Html_url { get; set; }

        [JsonPropertyName ("followers_url")]
        [JsonRequired]
        public required string Followers_url { get; set; }

        [JsonPropertyName ("following_url")]
        [JsonRequired]

        public required string Following_url { get; set; }

        [JsonPropertyName ("gists_url")]
        [JsonRequired]
        public required string Gists_url { get; set; }

        [JsonPropertyName ("starred_url")]
        [JsonRequired]

        public required string Starred_url { get; set; }

        [JsonPropertyName ("subscriptions_url")]
        [JsonRequired]
        public required string Subscriptions_url { get; set; }

        [JsonPropertyName ("organizations_url")]
        [JsonRequired]
        public required string Organizations_url { get; set; }

        [JsonPropertyName ("repos_url")]
        [JsonRequired]

        public required string Repos_url { get; set; }

        [JsonPropertyName ("events_url")]
        [JsonRequired]

        public required string Events_url { get; set; }

        [JsonPropertyName ("received_events_url")]
        [JsonRequired]

        public required string Received_events_url { get; set; }

        [JsonPropertyName ("type")]
        [JsonRequired]

        public required string Type { get; set; }

        [JsonPropertyName ("site_admin")]
        [JsonRequired]

        public required bool Site_admin { get; set; }
    }
    [JsonSerializable (typeof (GitHubReleases))]

    public class GitHubReleases
    {

        [JsonPropertyName("url")]
        [JsonRequired]

        public required string Url { get; set; }

        [JsonPropertyName ("assets_url")]
        [JsonRequired]

        public required string Assets_url { get; set; }

        [JsonPropertyName ("upload_url")]
        [JsonRequired]

        public required string Upload_url { get; set; }

        [JsonPropertyName ("html_url")]
        [JsonRequired]

        public required string Html_url { get; set; }

        [JsonPropertyName ("id")]
        [JsonRequired]

        public required int Id { get; set; }

        [JsonPropertyName ("author")]
        [JsonRequired]

        public required Author Author { get; set; }

        [JsonPropertyName ("node_id")]
        [JsonRequired]

        public required string Node_id { get; set; }

        [JsonPropertyName ("tag_name")]
        [JsonRequired]

        public required string Tag_name { get; set; }

        [JsonPropertyName ("target_commitish")]
        [JsonRequired]

        public required string Target_commitish { get; set; }

        [JsonPropertyName ("name")]
        [JsonRequired]

        public required string Name { get; set; }

        [JsonPropertyName ("draft")]
        [JsonRequired]

        public required bool Draft { get; set; }

        [JsonPropertyName ("prerelease")]
        [JsonRequired]

        public required bool Prerelease { get; set; }

        [JsonPropertyName ("created_at")]
        [JsonRequired]

        public required DateTime Created_at { get; set; }

        [JsonPropertyName ("published_at")]
        [JsonRequired]

        public required DateTime Published_at { get; set; }

        [JsonPropertyName ("assets")]
        [JsonRequired]

        public required List<Asset> Assets { get; set; }

        [JsonPropertyName ("tarball_url")]
        [JsonRequired]

        public required string Tarball_url { get; set; }

        [JsonPropertyName ("zipball_url")]
        [JsonRequired]

        public required string Zipball_url { get; set; }

        [JsonPropertyName ("body")]
        [JsonRequired]

        public required string Body { get; set; }
    }
    [JsonSerializable (typeof (Uploader))]

    public class Uploader
    {
        [JsonPropertyName ("login")]
        [JsonRequired]

        public required string Login { get; set; }

        [JsonPropertyName ("id")]
        [JsonRequired]

        public required int Id { get; set; }

        [JsonPropertyName ("node_id")]
        [JsonRequired]

        public required string Node_id { get; set; }

        [JsonPropertyName ("avatar_url")]
        [JsonRequired]

        public required string Avatar_url { get; set; }

        [JsonPropertyName ("gravatar_id")]
        [JsonRequired]

        public required string Gravatar_id { get; set; }

        [JsonPropertyName ("url")]
        [JsonRequired]

        public required string Url { get; set; }

        [JsonPropertyName ("html_url")]
        [JsonRequired]

        public required string Html_url { get; set; }

        [JsonPropertyName ("followers_url")]
        [JsonRequired]

        public required string Followers_url { get; set; }

        [JsonPropertyName ("following_url")]
        [JsonRequired]

        public required string Following_url { get; set; }

        [JsonPropertyName ("gists_url")]
        [JsonRequired]

        public required string Gists_url { get; set; }

        [JsonPropertyName ("starred_url")]
        [JsonRequired]

        public required string Starred_url { get; set; }

        [JsonPropertyName ("subscriptions_url")]
        [JsonRequired]

        public required string Subscriptions_url { get; set; }

        [JsonPropertyName ("organizations_url")]
        [JsonRequired]

        public required string Organizations_url { get; set; }

        [JsonPropertyName ("repos_url")]
        [JsonRequired]

        public required string Repos_url { get; set; }

        [JsonPropertyName ("events_url")]
        [JsonRequired]

        public required string Events_url { get; set; }

        [JsonPropertyName ("received_events_url")]
        [JsonRequired]

        public required string Received_events_url { get; set; }

        [JsonPropertyName ("type")]
        [JsonRequired]

        public required string Type { get; set; }

        [JsonPropertyName ("site_admin")]
        [JsonRequired]

        public required bool Site_admin { get; set; }
    }

    public abstract class DownloadUpdateAbstract
    {
        public abstract void CallDownloadScriptAndWait(string script_dir, string link);
        public abstract bool HasAdmin();

        public abstract GitHubReleases SendGetRequest(string url, string user_agent);

        public abstract void DownloadShell(string save_dir, string link, int index, string shell_name);

        public abstract void DownloadFromServer(string fileUrl, string filePath, string user_agent);

        public abstract void DownloadFromMultipleThread(string[] fileUrls, string[] filePaths, string user_agent);

    }


    public class DownloadUpdate : DownloadUpdateAbstract
    {
        public override void CallDownloadScriptAndWait(string script_dir, string link)
        {
            Task downloadTask = GitHub.DownloadScript(script_dir, link);
            downloadTask.Wait();
            return;
        }


        public override void DownloadFromServer(string fileUrl, string filePath, string user_agent)
        {
            Task task = (GitHub.DownloadFileAsync(fileUrl, filePath, user_agent));
            task.Wait();    
            return;
        }

        public override void DownloadFromMultipleThread(string[] fileUrls, string[] filePaths, string user_agent)
        {
            if(filePaths.Length != fileUrls.Length)
            {
                throw new Exception("file_path_size_does_not_match_output_size");
            }
            for(var i = 0 ; i < fileUrls.Length; i++)
            {
                DownloadFromServer(fileUrls[i], filePaths[i], user_agent);
            }
            return;
        }



        public override bool HasAdmin()
        {
            if (Platform.CurrentPlatform() == UserPlatform.Windows)
            {
                    // Windows implementation
                    var identity = WindowsIdentity.GetCurrent();
                    var principal = new WindowsPrincipal(identity);
                    return principal.IsInRole(WindowsBuiltInRole.Administrator);
            }
            else if (Platform.CurrentPlatform() == UserPlatform.Macintosh || Platform.CurrentPlatform() == UserPlatform.Linux)
            {
                // Linux and macOS implementation
                return Environment.GetEnvironmentVariable("USER") == "root";
            }

            // Unknown platform
            return false;
        }

        public override GitHubReleases SendGetRequest(string url, string user_agent)
        {
            Task<string> task = GitHub.SendGetRequestAsync(url, user_agent);
            task.Wait();
            var json = new JsonImplement();

            return json.ParseJson<GitHubReleases>(task.Result);
        }

        protected static async Task DownloadShellAsync(string save_dir, string link, int index, string shell_name)
        {
            var json = new JsonImplement();
            var github_api_json = json.ParseJson<GitHubReleases>(await GitHub.SendGetRequestAsync(link, $"Sen"));
            var path = new ImplementPath();
            if (github_api_json.Assets is null)
            {
                throw new Exception($"assets not found from Github API");
            }
            var shell_save = path.Resolve($"{path.Dirname($"{save_dir}")}/{shell_name}");
            await GitHub.DownloadFileAsync(github_api_json.Assets[index].Browser_download_url, (shell_save), $"Sen");
            Sen.Shell.Kernel.Support.Download.InternalShell.CreateExecuable();
            Sen.Shell.Kernel.Support.Download.InternalShell.ExecuteBat();
            return;
        }

        public override void DownloadShell(string save_dir, string link, int index, string shell_name)
        {
            Task task = DownloadShellAsync(save_dir, link, index, shell_name);
            task.Wait();
            return;
        }


    }


    public class GitHub
    {
        // test: https://api.github.com/repos/Haruma-VN/Sen/releases/tags/scripts
        public static async Task DownloadScript(string script_dir, string link)
        {
            var fs = new FileSystem();
            if (fs.DirectoryExists(script_dir))
            {
                fs.DeleteDirectory(new string[] { script_dir });
            }
            var json = new JsonImplement();
            var github_api_json = json.ParseJson<GitHubReleases>(await GitHub.SendGetRequestAsync(link, $"Sen"));
            var path = new ImplementPath();
            if(github_api_json.Assets is null)
            {
                throw new Exception($"assets not found from Github API");
            }
            var script_save = path.Resolve($"{path.Dirname($"{script_dir}")}/scripts.zip");
            await DownloadFileAsync(github_api_json.Assets[0].Browser_download_url, (script_save), $"Sen");
            var compression = new Compress();
            compression.UncompressZip(script_save, script_dir);
            // delete zip
            fs.DeleteFile(script_save);
            var system = new Platform();
            system.SendNotification("Sen successfully downloaded all module", "Sen");
            return;
        }

        public static async Task DownloadInternal(string script_dir, string link)
        {
            var json = new JsonImplement();
            var github_api_json = json.ParseJson<GitHubReleases>(await GitHub.SendGetRequestAsync(link, $"Sen"));
            var path = new ImplementPath();
            if (github_api_json.Assets is null)
            {
                throw new Exception($"assets not found from Github API");
            }
            
            var internal_x = Platform.CurrentPlatform() switch { 
                UserPlatform.Windows => path.Resolve($"{path.Dirname($"{script_dir}")}/Internal.dll"),
                UserPlatform.Linux => path.Resolve($"{path.Dirname($"{script_dir}")}/Internal.so"),
                UserPlatform.Macintosh => path.Resolve($"{path.Dirname($"{script_dir}")}/Internal.dylib"),
                _ => throw new Exception("Unknown"),
            };
            await DownloadFileAsync(github_api_json.Assets.Find(e => e.Name == Platform.CurrentPlatform() switch
            {
                UserPlatform.Windows => "Internal.dll",
                UserPlatform.Linux => "Internal.so",
                UserPlatform.Macintosh => "Internal.dylib",
                _ => throw new Exception("Please compile the Internal yourself"),
            } )!.Browser_download_url, (internal_x), $"Sen");
            return;
        }




        public static async Task<string> SendGetRequestAsync(string url, string user_agent)
        {
            using var httpClient = new HttpClient();
            {
                httpClient.DefaultRequestHeaders.Add("User-Agent", user_agent);

                try
                {
                    HttpResponseMessage response = await httpClient.GetAsync(url);

                    if (response.IsSuccessStatusCode)
                    {
                        string content = await response.Content.ReadAsStringAsync();
                        return content;
                    }
                    else
                    {
                        throw new Exception($"API Request failed: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception($"{ex.Message}");
                }
            }
        }

        public static async Task DownloadFileAsync(string fileUrl, string filePath, string user_agent)
        {
            var fs = new FileSystem();
            using var client = new HttpClient();
            {
                client.DefaultRequestHeaders.Add("User-Agent", user_agent);
                byte[] fileBytes = await client.GetByteArrayAsync(fileUrl);
                await fs.WriteBytesAsync(filePath, fileBytes);
            };
            return;
        }

    }
}
