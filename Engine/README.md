# Sen: Lotus Engine

`Lotus Engine` is Sen with Graphic User Interface.

## Project development

-   [Flutter 3.13](https://docs.flutter.dev/get-started/install)

-   Exploration:

    > See Flutter official documentation for more details: [Flutter Document](https://docs.flutter.dev/get-started/editor)

-   Dependencies: See `pubspec.yaml` for more details.

-   Build lotus engine command lines:

    -   Android: `flutter build apk`
    -   Windows: `flutter build windows`
    -   Linux: `flutter build linux`
    -   MacOS: `flutter build macos`
    -   iOS: `flutter build ios`

-   Android Development Special:

    -   For android, you need to compile [Internal](https://github.com/Haruma-VN/Sen/tree/master/Internal) yourself, put it in `android/app/src/main/jniLibs/<your-support>/` as `libInternal.so` along with `libc++_shared.so` from Android Studio NDK.

        > The version libc++\_shared.so included in the current project is NDK r25c.

        > See the [Android documentation](https://source.android.com/docs/core/architecture/vndk/linker-namespace) for details.

    -   CMake Project Setup:
        -   Generator: Ninja
        -   ANDROID_PLATFORM: [Android-version-you-support]
        -   ANDROID_ABI: armeabi-v7a, arm64-v8a or x86_x64
        -   ANDROID_STL: c++\_shared
        -   Compiler: [Clang 14.0 for Android (NDK 25.2)](https://developer.android.com/ndk/downloads)

## Localization

-   If you want to add language to Lotus Engine, please add an `app_[language-code].arb`, see [Example](https://github.com/Haruma-VN/Sen/tree/master/Engine/lib/l10n/app_en.arb) and sign the language code to [l10n.dart](https://github.com/Haruma-VN/Sen/tree/master/Engine/lib/l10n/l10n.dart)
