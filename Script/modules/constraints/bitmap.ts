namespace Sen.Script.Modules.BitMap.Constraints {
    /**
     * @package Dimension interface for image
     *
     */
    export interface DimensionInterface<Generic_T> {
        width: Generic_T;
        height: Generic_T;
    }

    /**
     * @package Dimension interface for image
     * @access can access to file contains the dimension
     */
    export interface ImageInfo<Generic_T> extends DimensionInterface<Generic_T> {
        file_path: string;
    }
}
