using Newtonsoft.Json;
using System.ComponentModel;
using System.Windows.Input;

namespace Sen.Assistant
{
    public partial class MainPage : ContentPage
    {

        public MainPage()
        {
            InitializeComponent();
            BindingContext = new MainPageViewModel();
        }

    }
}

public sealed class MainPageViewModel : INotifyPropertyChanged
{
    public unsafe event PropertyChangedEventHandler PropertyChanged;

    public unsafe ICommand ExitCommand { get; }
    public unsafe ICommand LoadWorldMapCommand { get; }

    public unsafe MainPageViewModel()
    {
        LoadWorldMapCommand = new Command(OnLoadWorldMap);
        ExitCommand = new Command(OnExit);
    }

    public async Task<string> PickJson(PickOptions options)
    {
        try
        {
            var result = await FilePicker.Default.PickAsync(options);
            if (result != null)
            {
                if (result.FileName.EndsWith("json", StringComparison.OrdinalIgnoreCase))
                {
                    using var stream = await result.OpenReadAsync();
                    var image = ImageSource.FromStream(() => stream);
                }
            }

            return result.ToString();
        }
        finally { }
    }

    private unsafe void OnExit()
    {
        Application.Current.Quit();
    }

    private async void OnLoadWorldMap()
    {
        var customFileType = new FilePickerFileType(
                new Dictionary<DevicePlatform, IEnumerable<string>>
                {
                    { DevicePlatform.iOS, new[] { "public.json" } },
                    { DevicePlatform.Android, new[] { "application/json" } }, 
                    { DevicePlatform.WinUI, new[] { ".json"} },
                    { DevicePlatform.Tizen, new[] { "*/*" } },
                    { DevicePlatform.macOS, new[] { "json" } }
                });

        PickOptions options = new()
        {
            PickerTitle = $"Select a json",
            FileTypes = customFileType,
        };
        var json_text = await PickJson(options);
        System.Console.WriteLine(json_text);
        var worldmap_json = JsonConvert.DeserializeObject<WorldMapOfficial>(json_text);
        return;
    }
}

public class WorldMapOfficial
{

}