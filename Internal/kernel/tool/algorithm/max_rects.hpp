#include <vector>
#include <algorithm>
#include "../../dependencies/RectangleBinPack/MaxRectsBinPack.h"


namespace Sen::Internal::Kernel::Tool::Algorithm 
{

    namespace RectangleBinPack = rbp;
	
    struct Sprite {
        int width;
        int height;
        int x;
        int y;
        int imageIndex;
        bool hasOversized;
    };

    inline auto best_sort(
        const Sprite a,
        const Sprite b
    ) -> bool {
        return std::max(a.width, a.height) > std::max(b.width, b.height);
    }

    inline auto packSprites(
        std::vector<Sprite>& sprites, 
        int sheetWidth,
        int sheetHeight, 
        int padding
    ) -> void {
        std::sort(sprites.begin(), sprites.end(), best_sort);
        auto bins = std::vector<RectangleBinPack::MaxRectsBinPack>{};
        bins.emplace_back(sheetWidth, sheetHeight);
        auto algorithm = RectangleBinPack::MaxRectsBinPack::RectBestAreaFit;
        for (auto &sprite : sprites) {
            if (sprite.width > sheetWidth || sprite.height > sheetHeight) {
                sprite.x = -1;
                sprite.y = -1;
                sprite.hasOversized = true;
                continue;
            }
            auto bin = bins.begin();
            auto packed = rbp::Rect{};

            for (; bin != bins.end(); ++bin) {
                packed = bin->Insert(sprite.width + padding, 
                    sprite.height + padding,
                    algorithm
                );
                if (packed.height != 0 && packed.width != 0) {
                    break;
                }
            }
            if (bin == bins.end()) {
                bins.emplace_back(sheetWidth, sheetHeight);
                bin = std::prev(bins.end());
                packed = bin->Insert(sprite.width + padding, sprite.height + padding,
                    algorithm);
            }
            sprite.x = packed.x;
            sprite.y = packed.y;
            sprite.imageIndex = std::distance(bins.begin(), bin);
        }
        return;
    }

}