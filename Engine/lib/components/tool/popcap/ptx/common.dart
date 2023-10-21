import 'package:sen_material_design/module/tool/popcap/sexy_texture/common.dart';

class CommonTextureEncode {
  static const String iOSApple = 'iOS';

  static const String androidGoogle = 'Android';

  static const String iOSAppleAndAndroidGoogle = 'Android & iOS';

  static TextureFormat exchangeTextureFormat(String format) {
    switch (format) {
      case 'argb_8888':
        {
          return TextureFormat.argb_8888;
        }
      case 'rgba_8888':
        {
          return TextureFormat.rgba_8888;
        }
      case 'rgba_4444':
        {
          return TextureFormat.rgba_4444;
        }
      case 'rgb_565':
        {
          return TextureFormat.rgb_565;
        }
      case 'rgba_5551':
        {
          return TextureFormat.rgba_5551;
        }
      case 'rgba_4444_tiled':
        {
          return TextureFormat.rgba_4444_tiled;
        }
      case 'rgb_565_tiled':
        {
          return TextureFormat.rgb_565_tiled;
        }
      case 'rgba_5551_tiled':
        {
          return TextureFormat.rgba_5551_tiled;
        }
      case 'rgb_etc1':
        {
          return TextureFormat.rgb_etc1;
        }
      case 'rgb_etc1_a8':
        {
          return TextureFormat.rgb_etc1_a8;
        }
      case 'rgb_etc1_palette':
        {
          return TextureFormat.rgb_etc1_palette;
        }
      case 'rgba_pvrtc_4bpp':
        {
          return TextureFormat.rgba_pvrtc_4bpp;
        }
      case 'rgb_pvrtc_4bpp_a8':
        {
          return TextureFormat.rgb_pvrtc_4bpp_a8;
        }
      default:
        {
          throw Exception('Unsupported texture format');
        }
    }
  }

  static List<SexyTextureFormat> textureFormat = [
    SexyTextureFormat(
      TextureFormat.argb_8888,
      'argb_8888',
      iOSApple,
      0,
    ),
    SexyTextureFormat(
      TextureFormat.rgba_8888,
      'rgba_8888',
      androidGoogle,
      0,
    ),
    SexyTextureFormat(
      TextureFormat.rgba_4444,
      'rgba_4444',
      iOSAppleAndAndroidGoogle,
      1,
    ),
    SexyTextureFormat(
      TextureFormat.rgb_565,
      'rgb_565',
      androidGoogle,
      2,
    ),
    SexyTextureFormat(
      TextureFormat.rgba_5551,
      'rgba_5551',
      iOSAppleAndAndroidGoogle,
      3,
    ),
    SexyTextureFormat(
      TextureFormat.rgba_4444_tiled,
      'rgba_4444_tiled',
      iOSAppleAndAndroidGoogle,
      21,
    ),
    SexyTextureFormat(
      TextureFormat.rgb_565_tiled,
      'rgb_565_tiled',
      androidGoogle,
      22,
    ),
    SexyTextureFormat(
      TextureFormat.rgba_5551_tiled,
      'rgba_5551_tiled',
      iOSAppleAndAndroidGoogle,
      23,
    ),
    SexyTextureFormat(
      TextureFormat.rgb_etc1,
      'rgb_etc1',
      androidGoogle,
      147,
    ),
    SexyTextureFormat(
      TextureFormat.rgb_etc1_a8,
      'rgb_etc1_a8',
      androidGoogle,
      147,
    ),
    SexyTextureFormat(
      TextureFormat.rgb_etc1_palette,
      'rgb_etc1_palette',
      iOSApple,
      30,
    ),
    SexyTextureFormat(
      TextureFormat.rgba_pvrtc_4bpp,
      'rgba_pvrtc_4bpp',
      iOSApple,
      30,
    ),
    SexyTextureFormat(
      TextureFormat.rgb_pvrtc_4bpp_a8,
      'rgb_pvrtc_4bpp_a8',
      iOSApple,
      148,
    ),
  ];
}
