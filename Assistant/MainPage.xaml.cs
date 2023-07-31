using Newtonsoft.Json;
using System.ComponentModel;
using System.Windows.Input;
using CommunityToolkit.Maui.Alerts;

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

    private static readonly string[] value = new[] { "public.json" };
    private static readonly string[] valueArray = new[] { "application/json" };
    private static readonly string[] valueArray0 = new[] { ".json"};
    private static readonly string[] valueArray1 = new[] { "*/*" };
    private static readonly string[] valueArray2 = new[] { "json" };

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
                { DevicePlatform.iOS, value },
                { DevicePlatform.Android, valueArray },
                { DevicePlatform.WinUI, valueArray0 },
                { DevicePlatform.Tizen, valueArray1 },
                { DevicePlatform.macOS, valueArray2 }
                });

        PickOptions options = new()
        {
            PickerTitle = $"Select a json",
            FileTypes = customFileType,
        };
        var result = await FilePicker.PickAsync(options);
        if (result != null)
        {
            var stream = await result.OpenReadAsync();
            using var reader = new StreamReader(stream);
            var json_text = await reader.ReadToEndAsync();
            var worldmap_json = JsonConvert.DeserializeObject<WorldMapOfficial>(json_text);
        }
        return;
    }

}

public class WorldMapOfficial
{

}