// ignore_for_file: unused_local_variable, unused_element, prefer_final_fields
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:sen_material_design/bridge/functions.dart';
import 'package:sen_material_design/bridge/service.dart';
import 'package:sen_material_design/common/custom.dart';
import 'package:sen_material_design/common/default.dart';
import 'package:sen_material_design/components/page/widget.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:sen_material_design/bridge/method.dart';
import 'package:sen_material_design/module/utility/io/common.dart';
import 'package:path/path.dart' as p;

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

Future<void> refreshModule() async {
  await Future.delayed(
    const Duration(
      milliseconds: 500,
    ),
  );
  return;
}

class RipeValue {
  late String value;
  late String display;
  RipeValue();
  RipeValue.has(this.value, this.display);
}

class _HomePageState extends State<HomePage> {
  bool isHovering = false;

  String methodFile = p.join(
    ApplicationInformation.libraryPath.value,
    'interface',
    'methods.json',
  );

  String initMethod() {
    Customization.initMethod(methodFile);
    return methodFile;
  }

  Method exchangeFunction(
    String id,
  ) {
    switch (id) {
      case 'popcap.resource_group.split':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_resource_group_split,
            AppLocalizations.of(context)!.popcap_resource_group_split_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.resource_group.merge':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_resource_group_merge,
            AppLocalizations.of(context)!.popcap_resource_group_merge_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.resource_group.to_resinfo':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_resource_group_to_resinfo,
            AppLocalizations.of(context)!
                .popcap_resource_group_to_resinfo_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.resource_group.from_resinfo':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_resource_group_from_resinfo,
            AppLocalizations.of(context)!
                .popcap_resource_group_from_resinfo_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.resinfo.split':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_resinfo_split,
            AppLocalizations.of(context)!.popcap_resinfo_split_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.resinfo.merge':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_resinfo_merge,
            AppLocalizations.of(context)!.popcap_resinfo_merge_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.resource_group.split_atlas':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_resource_group_split_atlas,
            AppLocalizations.of(context)!
                .popcap_resource_group_split_atlas_subtitle,
            Icons.perm_media_outlined,
          );
        }
      case 'popcap.resource_group.merge_atlas':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_resource_group_merge_atlas,
            AppLocalizations.of(context)!
                .popcap_resource_group_merge_atlas_subtitle,
            Icons.perm_media_outlined,
          );
        }
      case 'popcap.resinfo.split_atlas':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_resinfo_split_atlas,
            AppLocalizations.of(context)!.popcap_resinfo_split_atlas_subtitle,
            Icons.perm_media_outlined,
          );
        }
      case 'popcap.resinfo.merge_atlas':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_resinfo_merge_atlas,
            AppLocalizations.of(context)!.popcap_resinfo_merge_atlas_subtitle,
            Icons.perm_media_outlined,
          );
        }
      case 'popcap.ptx.decode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_ptx_decode,
            AppLocalizations.of(context)!.popcap_ptx_decode_subtitle,
            Icons.photo_size_select_actual_outlined,
          );
        }
      case 'popcap.ptx.encode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_ptx_encode,
            AppLocalizations.of(context)!.popcap_ptx_encode_subtitle,
            Icons.photo_size_select_actual_outlined,
          );
        }
      case 'popcap.animation.decode_to_json':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_animation_decode_to_json,
            AppLocalizations.of(context)!
                .popcap_animation_decode_to_json_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.animation.encode_from_json':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_animation_encode_from_json,
            AppLocalizations.of(context)!
                .popcap_animation_encode_from_json_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.animation.pam_to_flash':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_animation_pam_to_flash,
            AppLocalizations.of(context)!
                .popcap_animation_pam_to_flash_subtitle,
            Icons.motion_photos_auto_outlined,
          );
        }
      case 'popcap.animation.pam_from_flash':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_animation_pam_from_flash,
            AppLocalizations.of(context)!
                .popcap_animation_pam_from_flash_subtitle,
            Icons.motion_photos_auto_outlined,
          );
        }
      case 'popcap.animation.json_to_flash':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_animation_json_to_flash,
            AppLocalizations.of(context)!
                .popcap_animation_json_to_flash_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.animation.json_from_flash':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_animation_json_from_flash,
            AppLocalizations.of(context)!
                .popcap_animation_json_from_flash_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.rton.decode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rton_decode,
            AppLocalizations.of(context)!.popcap_rton_decode_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.rton.encode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rton_encode,
            AppLocalizations.of(context)!.popcap_rton_encode_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.rton.decrypt':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rton_decrypt,
            AppLocalizations.of(context)!.popcap_rton_decrypt_subtitle,
            Icons.no_encryption_outlined,
          );
        }
      case 'popcap.rton.encrypt':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rton_encrypt,
            AppLocalizations.of(context)!.popcap_rton_encrypt_subtitle,
            Icons.lock_outlined,
          );
        }
      case 'popcap.rton.decrypt_and_decode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rton_decrypt_and_decode,
            AppLocalizations.of(context)!
                .popcap_rton_decrypt_and_decode_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.rton.encode_and_encrypt':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rton_encode_and_encrypt,
            AppLocalizations.of(context)!
                .popcap_rton_encode_and_encrypt_subtitle,
            Icons.data_object_outlined,
          );
        }
      case 'popcap.rsg.unpack':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rsg_unpack,
            AppLocalizations.of(context)!.popcap_rsg_unpack_subtitle,
            Icons.data_array_outlined,
          );
        }
      case 'popcap.rsg.pack':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rsg_pack,
            AppLocalizations.of(context)!.popcap_rsg_pack_subtitle,
            Icons.data_array_outlined,
          );
        }
      case 'popcap.rsb.unpack':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rsb_unpack,
            AppLocalizations.of(context)!.popcap_rsb_unpack_subtitle,
            Icons.data_array_outlined,
          );
        }
      case 'popcap.rsb.pack':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rsb_pack,
            AppLocalizations.of(context)!.popcap_rsb_pack_subtitle,
            Icons.data_array_outlined,
          );
        }
      case 'popcap.rsb.unpack_simple':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rsb_unpack_simple,
            AppLocalizations.of(context)!.popcap_rsb_unpack_simple_subtitle,
            Icons.data_array_outlined,
          );
        }
      case 'popcap.rsb.pack_simple':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rsb_pack_simple,
            AppLocalizations.of(context)!.popcap_rsb_pack_simple_subtitle,
            Icons.data_array_outlined,
          );
        }
      case 'popcap.rsb.unpack_by_loose_constraints':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!
                .popcap_rsb_unpack_by_loose_constraints,
            AppLocalizations.of(context)!
                .popcap_rsb_unpack_by_loose_constraints_subtitle,
            Icons.data_array_outlined,
          );
        }
      case 'popcap.rsb.unpack_resource':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rsb_unpack_resource,
            AppLocalizations.of(context)!.popcap_rsb_unpack_resource_subtitle,
            Icons.folder_open_rounded,
          );
        }
      case 'popcap.rsb.pack_resource':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rsb_pack_resource,
            AppLocalizations.of(context)!.popcap_rsb_pack_resource_subtitle,
            Icons.folder_open_rounded,
          );
        }
      case 'popcap.zlib.compress':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_zlib_compress,
            AppLocalizations.of(context)!.popcap_zlib_compress_subtitle,
            Icons.compress_rounded,
          );
        }
      case 'popcap.zlib.uncompress':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_zlib_uncompress,
            AppLocalizations.of(context)!.popcap_zlib_uncompress_subtitle,
            Icons.compress_rounded,
          );
        }
      case 'wwise.soundbank.decode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.wwise_soundbank_decode,
            AppLocalizations.of(context)!.wwise_soundbank_decode_subtitle,
            Icons.graphic_eq_rounded,
          );
        }
      case 'wwise.soundbank.encode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.wwise_soundbank_encode,
            AppLocalizations.of(context)!.wwise_soundbank_encode_subtitle,
            Icons.graphic_eq_rounded,
          );
        }
      case 'popcap.animation.flash_animation_resize':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!
                .popcap_animation_flash_animation_resize,
            AppLocalizations.of(context)!
                .popcap_animation_flash_animation_resize_subtitle,
            Icons.photo_size_select_small_outlined,
          );
        }
      case 'popcap.rsbpatch.decode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rsbpatch_decode,
            AppLocalizations.of(context)!.popcap_rsbpatch_decode_subtitle,
            Icons.description_outlined,
          );
        }
      case 'popcap.rsbpatch.encode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_rsbpatch_encode,
            AppLocalizations.of(context)!.popcap_rsbpatch_encode_subtitle,
            Icons.description_outlined,
          );
        }
      case 'popcap.lawnstring.convert':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_lawnstring_convert,
            AppLocalizations.of(context)!.popcap_lawnstring_convert_subtitle,
            Icons.format_align_left_rounded,
          );
        }
      case 'popcap.newton.decode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_newton_decode,
            AppLocalizations.of(context)!.popcap_newton_decode_subtitle,
            Icons.description_outlined,
          );
        }
      case 'popcap.newton.encode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_newton_encode,
            AppLocalizations.of(context)!.popcap_newton_encode_subtitle,
            Icons.description_outlined,
          );
        }
      case 'popcap.compiled_text.decode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_compiled_text_decode,
            AppLocalizations.of(context)!.popcap_compiled_text_decode_subtitle,
            Icons.format_align_left_rounded,
          );
        }
      case 'popcap.compiled_text.encode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_compiled_text_encode,
            AppLocalizations.of(context)!.popcap_compiled_text_encode_subtitle,
            Icons.format_align_left_rounded,
          );
        }
      case 'popcap.render.effects.decode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_render_effects_decode,
            AppLocalizations.of(context)!.popcap_render_effects_decode_subtitle,
            Icons.description_outlined,
          );
        }
      case 'popcap.render.effects.encode':
        {
          return Method.hasIcon(
            AppLocalizations.of(context)!.popcap_render_effects_encode,
            AppLocalizations.of(context)!.popcap_render_effects_encode_subtitle,
            Icons.description_outlined,
          );
        }
      default:
        {
          return Method.hasIcon(
            'name',
            'subtitle',
            Icons.terminal_outlined,
          );
        }
    }
  }

  TextEditingController _searchController = TextEditingController(
    text: ApplicationInformation.searchValue.value,
  );

  @override
  void initState() {
    super.initState();
    if (ApplicationInformation.storagePermission.value &&
        ApplicationInformation.methodItems.value.isEmpty &&
        ApplicationInformation.displayItems.value.isEmpty) {
      ApplicationInformation.methodItems.value = List<MethodItem>.from(
        FileSystem.readJson(
          FileSystem.fileExists(methodFile) ? methodFile : initMethod(),
        ).map((dynamic e) => MethodItem.fromJson(e)),
      );
      ApplicationInformation.displayItems.value = [
        ...ApplicationInformation.methodItems.value,
      ];
    }
  }

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);
    return Column(
      children: [
        ValueListenableBuilder<bool>(
          valueListenable: ApplicationInformation.hasSearch,
          builder: (context, hasSearch, child) {
            return hasSearch
                ? Container(
                    margin: EdgeInsets.symmetric(
                      vertical: MediaQuery.of(context).size.height * 0.01,
                      horizontal: MediaQuery.of(context).size.width * 0.05,
                    ),
                    child: TextField(
                      controller: _searchController,
                      decoration: InputDecoration(
                        labelText: AppLocalizations.of(context)!.search,
                        hintText: AppLocalizations.of(context)!.search,
                        prefixIcon: const Icon(Icons.search),
                        border: const OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(25.0)),
                        ),
                      ),
                      onChanged: (String value) {
                        setState(() {
                          ApplicationInformation.searchValue.value = value;
                          ApplicationInformation.displayItems.value =
                              ApplicationInformation.methodItems.value
                                  .where((MethodItem item) {
                            return item.method
                                .toLowerCase()
                                .contains(value.toLowerCase());
                          }).toList();
                        });
                      },
                    ),
                  )
                : Container();
          },
        ),
        Expanded(
          child: ListView(
            children: [
              ApplicationInformation.storagePermission.value
                  ? Column(
                      children: ApplicationInformation.displayItems.value
                          .map(
                            (MethodItem e) => InkWell(
                              borderRadius: BorderRadius.circular(30.0),
                              hoverColor: Colors.blue.withAlpha(50),
                              onHover: (value) {
                                setState(() {
                                  isHovering = value;
                                });
                              },
                              child: Container(
                                margin: EdgeInsets.symmetric(
                                  vertical:
                                      MediaQuery.of(context).size.height * 0.01,
                                  horizontal:
                                      MediaQuery.of(context).size.width * 0.05,
                                ),
                                decoration: BoxDecoration(
                                  color: isHovering
                                      ? Theme.of(context)
                                          .colorScheme
                                          .onSecondary
                                          .withOpacity(0.7)
                                      : Theme.of(context)
                                          .colorScheme
                                          .onSecondary,
                                  borderRadius: BorderRadius.circular(30.0),
                                  boxShadow: [
                                    if (!(Theme.of(context).brightness ==
                                        Brightness.dark))
                                      const BoxShadow(
                                        color: Colors.grey,
                                        blurRadius: 2,
                                        spreadRadius: 2,
                                        offset: Offset(4, 2),
                                      ),
                                  ],
                                ),
                                child: ListTile(
                                  leading: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: <Widget>[
                                      Icon(
                                        exchangeFunction(e.method).icon,
                                        size: Theme.of(context).iconTheme.size,
                                      ),
                                    ],
                                  ),
                                  title: Text(
                                    (exchangeFunction(e.method).name),
                                    style:
                                        Theme.of(context).textTheme.titleSmall,
                                  ),
                                  subtitle: Text(
                                    exchangeFunction(e.method).subtitle,
                                    style:
                                        Theme.of(context).textTheme.bodySmall,
                                  ),
                                  trailing: SizedBox(
                                    child: Icon(
                                      Icons.arrow_right_sharp,
                                      size: Theme.of(context).iconTheme.size,
                                    ),
                                  ),
                                  onTap: () {
                                    Navigator.of(context).push(
                                      PageRouteBuilder(
                                        pageBuilder: (
                                          context,
                                          animation,
                                          secondaryAnimation,
                                        ) =>
                                            FutureBuilder(
                                          future: refreshModule(),
                                          builder: (
                                            BuildContext context,
                                            AsyncSnapshot snapshot,
                                          ) {
                                            if (snapshot.connectionState ==
                                                ConnectionState.done) {
                                              return materialWidget[e.method] ??
                                                  Scaffold(
                                                    appBar: AppBar(
                                                      title: const Text(
                                                        ApplicationInformation
                                                            .applicationName,
                                                      ),
                                                      centerTitle: false,
                                                      elevation: 3,
                                                      scrolledUnderElevation: 3,
                                                    ),
                                                    body: Text(
                                                      AppLocalizations.of(
                                                        context,
                                                      )!
                                                          .have_not_implemented,
                                                    ),
                                                  );
                                            } else {
                                              return Scaffold(
                                                appBar: AppBar(
                                                  title: const Text(
                                                    ApplicationInformation
                                                        .applicationName,
                                                  ),
                                                  centerTitle: false,
                                                  elevation: 3,
                                                  scrolledUnderElevation: 3,
                                                ),
                                                body: const Center(
                                                  child:
                                                      CircularProgressIndicator(),
                                                ),
                                              );
                                            }
                                          },
                                        ),
                                        transitionsBuilder: (
                                          context,
                                          animation,
                                          secondaryAnimation,
                                          child,
                                        ) {
                                          var begin = const Offset(
                                            1.0,
                                            0.0,
                                          );
                                          var end = Offset.zero;
                                          var curve = Curves.ease;

                                          var tween = Tween(
                                            begin: begin,
                                            end: end,
                                          ).chain(CurveTween(curve: curve));

                                          return SlideTransition(
                                            position: animation.drive(tween),
                                            child: child,
                                          );
                                        },
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ),
                          )
                          .toList(),
                    )
                  : Column(
                      children: [
                        Container(
                          margin: EdgeInsets.symmetric(
                            vertical: MediaQuery.of(context).size.height * 0.01,
                            horizontal:
                                MediaQuery.of(context).size.width * 0.05,
                          ),
                          decoration: BoxDecoration(
                            color: isHovering
                                ? Theme.of(context)
                                    .colorScheme
                                    .onSecondary
                                    .withOpacity(0.7)
                                : Theme.of(context).colorScheme.onSecondary,
                            borderRadius: BorderRadius.circular(30.0),
                            boxShadow: [
                              if (!(Theme.of(context).brightness ==
                                  Brightness.dark))
                                const BoxShadow(
                                  color: Colors.grey,
                                  blurRadius: 2,
                                  spreadRadius: 2,
                                  offset: Offset(4, 2),
                                ),
                            ],
                          ),
                          child: ListTile(
                            leading: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                Icon(
                                  Icons.error_outline,
                                  size: theme.iconTheme.size,
                                  color: Colors.red,
                                ),
                              ],
                            ),
                            title: Text(
                              (AppLocalizations.of(context)!
                                  .does_not_have_permission),
                              style: theme.textTheme.titleMedium,
                            ),
                            subtitle: Text(
                              AppLocalizations.of(context)!
                                  .does_not_have_permission_subtitle,
                              style: theme.textTheme.bodySmall,
                            ),
                          ),
                        ),
                        Container(
                          margin: EdgeInsets.symmetric(
                            vertical: MediaQuery.of(context).size.height * 0.01,
                            horizontal:
                                MediaQuery.of(context).size.width * 0.05,
                          ),
                          decoration: BoxDecoration(
                            color: isHovering
                                ? Theme.of(context)
                                    .colorScheme
                                    .onSecondary
                                    .withOpacity(0.7)
                                : Theme.of(context).colorScheme.onSecondary,
                            borderRadius: BorderRadius.circular(30.0),
                            boxShadow: [
                              if (!(Theme.of(context).brightness ==
                                  Brightness.dark))
                                const BoxShadow(
                                  color: Colors.grey,
                                  blurRadius: 2,
                                  spreadRadius: 2,
                                  offset: Offset(4, 2),
                                ),
                            ],
                          ),
                          child: ListTile(
                            leading: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                Icon(
                                  Icons.sd_storage_outlined,
                                  size: theme.iconTheme.size,
                                ),
                              ],
                            ),
                            title: Text(
                              (AppLocalizations.of(context)!.grant_permission),
                              style: theme.textTheme.titleMedium,
                            ),
                            subtitle: Text(
                              AppLocalizations.of(context)!
                                  .grant_permission_subtitle,
                              style: theme.textTheme.bodySmall,
                            ),
                            trailing: SizedBox(
                              child: Platform.isAndroid
                                  ? Icon(
                                      Icons.open_in_new,
                                      size: theme.iconTheme.size,
                                    )
                                  : null,
                            ),
                            onTap: Platform.isAndroid
                                ? () async {
                                    setState(() async {
                                      ApplicationInformation
                                              .storagePermission.value =
                                          await MainActivity
                                              .requestStoragePermission();
                                    });
                                  }
                                : null,
                          ),
                        ),
                      ],
                    ),
            ],
          ),
        ),
      ],
    );
  }
}
