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

public unsafe sealed class MainPageViewModel : INotifyPropertyChanged
{
    public unsafe event PropertyChangedEventHandler PropertyChanged;

    public unsafe ICommand ExitCommand { get; }

    public unsafe MainPageViewModel()
    {
        ExitCommand = new Command(OnExit);
    }

    private unsafe void OnExit()
    {
        Application.Current.Quit();
    }
}
