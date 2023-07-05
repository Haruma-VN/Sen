using Microsoft.Extensions.Logging;

namespace MauiShell
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });

            #if DEBUG
		            builder.Logging.AddDebug();
#endif
            // Test internet
            var internet = Connectivity.Current.NetworkAccess == NetworkAccess.Internet;


#if ANDROID
    Android.MaUIShell.Render.MainApplication();
#endif

#if IOS
    IOSurface.MaUIShell.Render.MainApplication();
#endif

#if WINDOWS
            builder.Build();
#endif

            return builder.Build();
        }
    }
}