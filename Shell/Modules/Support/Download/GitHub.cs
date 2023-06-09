using Sen.Shell.Modules.Standards;
using Sen.Shell.Modules.Standards.IOModule;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

// Download script instantly

namespace Sen.Shell.Modules.Support.Download
{
    #pragma warning disable CS8618
    #pragma warning disable IDE1006
    public class Asset
    {
        public string url { get; set; }
        public int id { get; set; }
        public string node_id { get; set; }
        public string name { get; set; }
        public object label { get; set; }
        public Uploader uploader { get; set; }
        public string content_type { get; set; }
        public string state { get; set; }
        public int size { get; set; }
        public int download_count { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string browser_download_url { get; set; }
    }

    public class Author
    {
        public string login { get; set; }
        public int id { get; set; }
        public string node_id { get; set; }
        public string avatar_url { get; set; }
        public string gravatar_id { get; set; }
        public string url { get; set; }
        public string html_url { get; set; }
        public string followers_url { get; set; }
        public string following_url { get; set; }
        public string gists_url { get; set; }
        public string starred_url { get; set; }
        public string subscriptions_url { get; set; }
        public string organizations_url { get; set; }
        public string repos_url { get; set; }
        public string events_url { get; set; }
        public string received_events_url { get; set; }
        public string type { get; set; }
        public bool site_admin { get; set; }
    }

    public class GitHubReleases
    {
        public string url { get; set; }
        public string assets_url { get; set; }
        public string upload_url { get; set; }
        public string html_url { get; set; }
        public int id { get; set; }
        public Author author { get; set; }
        public string node_id { get; set; }
        public string tag_name { get; set; }
        public string target_commitish { get; set; }
        public string name { get; set; }
        public bool draft { get; set; }
        public bool prerelease { get; set; }
        public DateTime created_at { get; set; }
        public DateTime published_at { get; set; }
        public List<Asset> assets { get; set; }
        public string tarball_url { get; set; }
        public string zipball_url { get; set; }
        public string body { get; set; }
    }

    public class Uploader
    {
        public string login { get; set; }
        public int id { get; set; }
        public string node_id { get; set; }
        public string avatar_url { get; set; }
        public string gravatar_id { get; set; }
        public string url { get; set; }
        public string html_url { get; set; }
        public string followers_url { get; set; }
        public string following_url { get; set; }
        public string gists_url { get; set; }
        public string starred_url { get; set; }
        public string subscriptions_url { get; set; }
        public string organizations_url { get; set; }
        public string repos_url { get; set; }
        public string events_url { get; set; }
        public string received_events_url { get; set; }
        public string type { get; set; }
        public bool site_admin { get; set; }
    }

    public abstract class DownloadUpdateAbstract
    {
        public abstract void CallDownloadScriptAndWait(string script_dir, string link);
        public abstract bool HasAdmin();

        public abstract GitHubReleases SendGetRequest(string url, string user_agent);

        public abstract void DownloadShell(string save_dir, string link, int index, string shell_name);
    }


    public class DownloadUpdate : DownloadUpdateAbstract
    {
        public override void CallDownloadScriptAndWait(string script_dir, string link)
        {
            Task downloadTask = GitHub.DownloadScript(script_dir, link);
            downloadTask.Wait();
            return;
        }



        public override bool HasAdmin()
        {
            if (Platform.CurrentPlatform() == UserPlatform.Windows)
            {
                // Windows implementation
                #pragma warning disable CA1416 // Validate platform compatibility
                var identity = WindowsIdentity.GetCurrent();
                var principal = new WindowsPrincipal(identity);
                var path = new ImplementPath();
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
            if (github_api_json.assets == null)
            {
                throw new Exception($"assets not found from github api");
            }
            var shell_save = path.Resolve($"{path.Dirname($"{save_dir}")}/{shell_name}");
            await GitHub.DownloadFileAsync(github_api_json.assets[index].browser_download_url, (shell_save), $"Sen");
            Sen.Shell.Modules.Support.Download.InternalShell.CreateExecuable($"{path.Dirname(Program.Script_Directory)}/shell.exe", $"{path.Dirname(Sen.Shell.Program.Script_Directory)}/new_shell.exe");
            return;
        }

        public override void DownloadShell(string save_dir, string link, int index, string shell_name)
        {
            Task task = DownloadUpdate.DownloadShellAsync(save_dir, link, index, shell_name);
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
            if(github_api_json.assets == null)
            {
                throw new Exception($"assets not found from github api");
            }
            var script_save = path.Resolve($"{path.Dirname($"{script_dir}")}/scripts.zip");
            await GitHub.DownloadFileAsync(github_api_json.assets[0].browser_download_url, (script_save), $"Sen");
            var compression = new Compress();
            compression.UncompressZip(script_save, script_dir);
            // delete zip
            fs.DeleteFile(script_save);
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
                        throw new Exception($"API request failed with status code: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception($"An error occurred: {ex.Message}");
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
