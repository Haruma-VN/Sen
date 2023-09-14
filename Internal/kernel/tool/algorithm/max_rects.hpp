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
			rbp::Rect packedRect;
            char* const id;
	};

	inline auto best_sort(
		const Sprite a,
		const Sprite b
	) -> bool {
		return std::max(a.width, a.height) > std::max(b.width, b.height);
	}


    inline auto packSprites(
        std::vector<Sprite>& sprites,
        int binWidth,
        int binHeight,
        int padding
    ) -> std::vector<std::vector<Sprite>>
    {
        std::sort(sprites.begin(), sprites.end(), best_sort);
        auto packedSprites = std::vector<std::vector<Sprite>>{};
        auto currentBinSprites = std::vector<Sprite>{};
        auto bin = RectangleBinPack::MaxRectsBinPack(binWidth, binHeight, false);
        auto algorithm = RectangleBinPack::MaxRectsBinPack::RectBestShortSideFit;
        for (auto &sprite : sprites) {
            auto packedRect = bin.Insert(sprite.width + padding, sprite.height + padding,
                algorithm);
            if (packedRect.height == 0) {
                packedSprites.push_back(currentBinSprites);
                currentBinSprites.clear();
                bin.Init(binWidth, binHeight);
                packedRect = bin.Insert(sprite.width + padding, sprite.height + padding,
                    algorithm);
                if (packedRect.height == 0) {
                    sprite.packedRect = RectangleBinPack::Rect(-1, -1, sprite.width, sprite.height);
                }
                else {
                    sprite.packedRect = packedRect;
                }
                currentBinSprites.push_back(sprite);
            }
        }
        if (!currentBinSprites.empty()) {
            packedSprites.push_back(currentBinSprites);
        }
        return packedSprites;
    }

}