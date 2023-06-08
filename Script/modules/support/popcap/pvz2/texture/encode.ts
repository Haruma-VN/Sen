namespace Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode {
    /**
     * Unofficial texture format but is fine to use inside the tool with switch case
     */
    export enum TextureEncoderUnofficial {
        A8 = 1,

        ARGB8888,

        ARGB1555,

        ARGB4444,

        ETC1_RGB,

        ETC1_RGB_A_Palette,

        ETC1_RGB_A8,

        L8,

        LA44,

        LA88,

        PVRTC1_4BPP_RGB,

        PVRTC1_4BPP_RGBA,

        PVRTC1_4BPP_RGBA_A8,

        RGB565,

        RGB565_Block,

        RGBA4444,
        RGBA4444_Block,

        RGBA5551,

        RGBA5551_Block,

        RGBA8888,
    }

    /**
     * Option to choose
     */

    export const EncodeOption: Array<Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial> = [
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.A8,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ARGB8888,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ARGB1555,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ARGB4444,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ETC1_RGB,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ETC1_RGB_A_Palette,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ETC1_RGB_A8,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.L8,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.LA44,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.LA88,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.PVRTC1_4BPP_RGB,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.PVRTC1_4BPP_RGBA,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.PVRTC1_4BPP_RGBA_A8,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGB565,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGB565_Block,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA4444,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA4444_Block,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA5551,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA5551_Block,
        Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA8888,
    ];

    /**
     *
     * @param that_in - Pass input path or input array
     * @param that_out - Pass output path or output array
     * @param encode - Pass texture format
     * @param width - Pass width or width array
     * @param height - Pass height or height array
     * @returns Encoded PTX
     */

    export function DecodePopCapPTX(
        that_in: string | string[],
        that_out: string | string[],
        width: int | int[],
        height: int | int[],
        encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial,
    ): void {
        if (Array.isArray(that_in)) {
            if (Array.isArray(that_out)) {
                if (!(that_in.length === that_out.length)) {
                    throw new Sen.Script.Modules.Exceptions.EncodingError(
                        Sen.Script.Modules.System.Default.Localization.GetString("not_enough_parameter_to_evaluate"),
                        `${MainScriptDirectory}/modules/support/popcap/pvz2/texture/encode.js`,
                    );
                }
            }
        }
        switch (encode) {
            case TextureEncoderUnofficial.A8: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_A8_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_A8_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ARGB8888: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ARGB8888_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ARGB8888_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ARGB1555: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ARGB1555_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ARGB1555_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ARGB4444: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ARGB4444_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ARGB4444_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ETC1_RGB: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ETC1_RGB_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ETC1_RGB_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ETC1_RGB_A_Palette: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ETC1_RGB_A_Palette_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ETC1_RGB_A_Palette_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ETC1_RGB_A8: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ETC1_RGB_A8_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ETC1_RGB_A8_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.L8: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_L8_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_L8_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.LA44: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_LA44_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_LA44_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.LA88: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_LA88_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_LA88_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.PVRTC1_4BPP_RGB: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_PVRTC1_4BPP_RGB_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_PVRTC1_4BPP_RGB_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.PVRTC1_4BPP_RGBA: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_PVRTC1_4BPP_RGBA_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_PVRTC1_4BPP_RGBA_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.PVRTC1_4BPP_RGBA_A8: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_PVRTC1_4BPP_RGBA_A8_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGB565: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGB565_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGB565_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGB565_Block: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGB565_Block_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGB565_Block_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGBA4444: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGBA4444_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGBA4444_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGBA4444_Block: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGBA4444_Block_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGBA4444_Block_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGBA5551: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGBA5551_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGBA5551_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGBA5551_Block: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGBA4444_Block_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGBA4444_Block_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGBA8888: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGBA8888_Decode(that_in, that_out, width as int, height as int);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGBA8888_Decode(
                            element,
                            (that_out as Array<string>)[index],
                            (width as Array<int>)[index],
                            (height as Array<int>)[index],
                        );
                    });
                }
                break;
            }
        }

        return;
    }

    /**
     *
     * @param that_in - Pass input path or input array
     * @param that_out - Pass output path or output array
     * @param encode - Pass texture format
     * @returns Encoded PTX
     */

    export function EncodePopCapPTX(
        that_in: string | string[],
        that_out: string | string[],
        encode: Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial,
    ): void {
        if (Array.isArray(that_in)) {
            if (Array.isArray(that_out)) {
                if (!(that_in.length === that_out.length)) {
                    throw new Sen.Script.Modules.Exceptions.EncodingError(
                        Sen.Script.Modules.System.Default.Localization.GetString("not_enough_parameter_to_evaluate"),
                        `${MainScriptDirectory}/modules/support/popcap/pvz2/texture/encode.js`,
                    );
                }
            }
        }
        switch (encode) {
            case TextureEncoderUnofficial.A8: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_A8_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_A8_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ARGB8888: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ARGB8888_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ARGB8888_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ARGB1555: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ARGB1555_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ARGB1555_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ARGB4444: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ARGB4444_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ARGB4444_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ETC1_RGB: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ETC1_RGB_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ETC1_RGB_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ETC1_RGB_A_Palette: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ETC1_RGB_A_Palette_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ETC1_RGB_A_Palette_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.ETC1_RGB_A8: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_ETC1_RGB_A8_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_ETC1_RGB_A8_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.L8: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_L8_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_L8_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.LA44: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_LA44_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_LA44_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.LA88: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_LA88_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_LA88_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.PVRTC1_4BPP_RGB: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_PVRTC1_4BPP_RGB_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_PVRTC1_4BPP_RGB_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.PVRTC1_4BPP_RGBA: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_PVRTC1_4BPP_RGBA_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_PVRTC1_4BPP_RGBA_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.PVRTC1_4BPP_RGBA_A8: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_PVRTC1_4BPP_RGBA_A8_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_PVRTC1_4BPP_RGBA_A8_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGB565: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGB565_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGB565_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGB565_Block: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGB565_Block_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGB565_Block_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGBA4444: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGBA4444_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGBA4444_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGBA4444_Block: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGBA4444_Block_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGBA4444_Block_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGBA5551: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGBA5551_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGBA5551_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGBA5551_Block: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGBA4444_Block_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGBA4444_Block_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
            case TextureEncoderUnofficial.RGBA8888: {
                if (!Array.isArray(that_in) && !Array.isArray(that_out)) {
                    TextureHandler.Create_RGBA8888_Encode(that_in, that_out);
                } else {
                    (that_in as Array<string>).forEach((element: string, index: number) => {
                        TextureHandler.Create_RGBA8888_Encode(element, (that_out as Array<string>)[index]);
                    });
                }
                break;
            }
        }

        return;
    }

    /**
     *
     * @returns Encode number for PTX
     */

    export function InputEncode(): Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial {
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            `${Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("select_one_texture_format"),
            )}`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.A8}. a8`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ARGB8888}. argb_8888`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ARGB1555}. argb_1555`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ARGB4444}. argb_4444`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ETC1_RGB}. rgb_etc1`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ETC1_RGB_A_Palette}. rgb_etc1_a_palette`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.ETC1_RGB_A8}. rgb_etc1_a_8`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.L8}. l8`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.LA44}. la44`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.LA88}. la88`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.PVRTC1_4BPP_RGB}. rgb_pvrtc4`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.PVRTC1_4BPP_RGBA}. rgba_pvrtc4`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.PVRTC1_4BPP_RGBA_A8}. rgb_pvrtc4_a_8`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGB565}. rgb_565`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGB565_Block}. rgb_565_tiled`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA4444}. rgba4444`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA4444_Block}. rgb_4444_tiled`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA5551}. rgba5551`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA5551_Block}. rgba5551_tiled`,
        );
        Console.Printf(
            null,
            `      ${Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.TextureEncoderUnofficial.RGBA8888}. rgba8888`,
        );
        let input: string = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (
            Sen.Script.Modules.Interface.Assert.MatchInputWithNumbers(
                input,
                Sen.Script.Modules.Support.PopCap.PvZ2.Texture.Encode.EncodeOption,
            ) === null
        ) {
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                    /\{\}/g,
                    Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(
                        /\{\}/g,
                        input,
                    ),
                )}`,
            );
            input = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        return parseInt(input);
    }

    /**
     *
     * @returns Width and Height from the user
     */

    export function InputDimension(): Sen.Script.Modules.BitMap.Constraints.DimensionInterface<int> {
        const numberRegex: RegExp = /^\d+$/;
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            `${Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("input_width"),
            )}`,
        );
        let input_width: string = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (!numberRegex.test(input_width)) {
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                    /\{\}/g,
                    Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(
                        /\{\}/g,
                        input_width,
                    ),
                )}`,
            );
            input_width = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        Console.Print(
            Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan,
            `${Sen.Script.Modules.System.Default.Localization.GetString("execution_argument").replace(
                /\{\}/g,
                Sen.Script.Modules.System.Default.Localization.GetString("input_height"),
            )}`,
        );
        let input_height: string = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        while (!numberRegex.test(input_height)) {
            Console.Print(
                Sen.Script.Modules.Platform.Constraints.ConsoleColor.Red,
                `${Sen.Script.Modules.System.Default.Localization.GetString("execution_failed").replace(
                    /\{\}/g,
                    Sen.Script.Modules.System.Default.Localization.GetString("is_not_valid_input_argument").replace(
                        /\{\}/g,
                        input_height,
                    ),
                )}`,
            );
            input_height = Console.Input(Sen.Script.Modules.Platform.Constraints.ConsoleColor.Cyan);
        }
        return {
            width: parseInt(input_width),
            height: parseInt(input_height),
        };
    }
}
