#include <vector>
#include <algorithm>
#include "../../dependencies/RectangleBinPack/MaxRectsBinPack.h"


namespace Sen::Internal::Kernel::Tool::Algorithm 
{

    namespace RectangleBinPack = rbp;

    struct Sprite {
    public:
        int width;
        int height;
        int x;
        int y;
        int imageIndex;
        bool hasOversized;
        char* id;
        int infoX;
        int infoY;
        int cols;
        int rows;
        char** path;
        int pathSize;
        bool isPacked;
    };

    inline auto best_sort(
        const Sprite a,
        const Sprite b
    ) -> bool {
        return std::max(a.width, a.height) > std::max(b.width, b.height);
    }

    inline auto packSprites(
        std::vector<Sprite>& sprites, 
        const int &sheetWidth, 
        const int &sheetHeight,
        const int &padding
    ) -> void {
        std::sort(sprites.begin(), sprites.end(), best_sort);
        auto current_index = 0;
        auto bin = RectangleBinPack::MaxRectsBinPack(sheetWidth, sheetHeight, false);
        auto algorithm = RectangleBinPack::MaxRectsBinPack::RectBestAreaFit;

        for (auto& sprite : sprites) {
            if (sprite.width + padding > sheetWidth || sprite.height + padding > sheetHeight) {
                sprite.x = -1;
                sprite.y = -1;
                sprite.hasOversized = true;
                sprite.imageIndex = -1;
                continue;
            }
            auto packed = bin.Insert(sprite.width + padding, sprite.height + padding, algorithm);

            if (packed.height != 0) {
                sprite.x = packed.x;
                sprite.y = packed.y;
                sprite.hasOversized = false;
                sprite.imageIndex = current_index;
            }
            else {
                current_index++;
                bin = RectangleBinPack::MaxRectsBinPack(sheetWidth, sheetHeight, false);
                packed = bin.Insert(sprite.width + padding, sprite.height + padding, algorithm);

                if (packed.height != 0) {
                    sprite.x = packed.x;
                    sprite.y = packed.y;
                    sprite.hasOversized = false;
                    sprite.imageIndex = current_index;
                }
            }
        }
    }
}