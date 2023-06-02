// /**
//  * @fileoverview Cross-platform file path sorting library for Node.js
//  * @author Milos Djermanovic <milos.djermanovic@gmail.com>
//  */
namespace Runtime.Script.Modules.Third.JavaScript.CrossPathSort {
    // Path types. Order of keys defines default order of path types in the sorted array.
    export type posixType = "rel" | "home" | "abs";

    export const posixPathType = {
        rel: 1, // relative
        home: 2, // ~/... ~user/...
        abs: 3, // /...
    };
    export const windowsPathType = {
        rel: 1, // relative
        home: 2, // ~\...
        abs: 3, // \...
        drel: 4, // C:...
        dabs: 5, // C:\...
        unc: 6, // \\server\share\...
        nms: 7, // \\?\... \\.\...
    };
    export const otherPlatformPathType = {
        nonroot: 1,
    };

    export const otherRoot = 0;

    /**
     * Sort options object.
     *
     * @typedef {Object} SortOptions
     * @property {string} [pathKey] Key of a property whose value is path string.
     * @property {boolean} [shallowFirst] If true, content of a directory will come before the content of its subdirectories.
     * @property {boolean} [deepFirst] If true, content of a directory will come after the content of its subdirectories.
     * @property {boolean} [homePathsSupported] If true, paths starting with '~' will be treated as 'home' paths.
     * @property {string[]} [posixOrder] POSIX path types order. Permutation of ['rel', 'home', 'abs'].
     * @property {string[]} [windowsOrder] Windows path types order. Permutation of ['rel', 'home', 'abs', 'drel', 'dabs', 'unc', 'nms'].
     * @property {Function} [segmentCompareFn] Function used to compare path segments.
     */

    /**
     * Internal cross-platform file path sorting function.
     *
     * @param {Object} Path Provides platform-specific normalize(), parse() and sep.
     * @param {(string[]|any[])} paths Array of path strings or objects containing path strings.
     * @param {SortOptions} [options] Sort options.
     * @returns {(string[]|any[])} Sorted array.
     */

    export interface SortOptions {
        pathKey?: string;
        shallowFirst?: boolean;
        deepFirst?: boolean;
        homePathsSupported?: boolean;
        posixOrder?: string[];
        windowsOrder?: string[];
        segmentCompareFn?: (a: string, b: string) => number;
    }

    export function _sort(
        Path: any,
        paths: string[] | any[],
        {
            pathKey,
            shallowFirst = false,
            deepFirst = false,
            homePathsSupported = false,
            posixOrder,
            windowsOrder,
            segmentCompareFn = (a, b) => a.localeCompare(b),
        }: SortOptions = {},
    ): string[] | any[] {
        validateOptions();
        // Never throw an error caused by the paths argument. It can be anything, and it can contain anything.
        if (!Array.isArray(paths)) return paths;

        const pathOrder = preparePathOrder();
        // Never call prototype methods on entry arrays and objects directly.
        const parsedPaths = [].map.call(paths, parse);
        // Both map and sort will preserve holes. Sort will put holes at the end.
        return parsedPaths.sort(compare as any).map((parsedPath) => (parsedPath as any).original);

        function validateOptions() {
            if (pathKey !== undefined && typeof pathKey !== "string") {
                throw new Error("Invalid arguments: pathKey must be a string or undefined.");
            }
            if (deepFirst && shallowFirst) {
                throw new Error("Invalid arguments: Only one of shallowFirst and deepFirst can have a truthy value.");
            }
            validateOrder(posixPathType, posixOrder, "posixOrder");
            validateOrder(windowsPathType, windowsOrder, "windowsOrder");
            if (typeof segmentCompareFn !== "function") {
                throw new Error("Invalid argument: segmentCompareFunction must be a function or undefined.");
            }
        }

        function validateOrder(type: any, order: string[] | undefined, paramName: string): void {
            if (order !== undefined) {
                if (!Array.isArray(order)) {
                    throw new Error(`Invalid arguments: ${paramName} must be an array or undefined.`);
                }
                const keys = Object.keys(type);
                if (
                    keys.length !== order.length ||
                    !keys.every((key) => ([].indexOf.call(order, key as never) >= 0) as any)
                ) {
                    throw new Error(
                        `Invalid arguments: ${paramName} must be a permutation of ${JSON.stringify(
                            keys,
                        )} array or undefined.`,
                    );
                }
            }
        }

        function preparePathOrder() {
            let order;
            // Prepare sort order by path type. Map over keys can be replaced with Object.values from ES2017
            if (Path.sep === "/") {
                // Posix
                if (posixOrder) {
                    // Custom
                    order = [].map.call(posixOrder, (key) => posixPathType[key]);
                } else {
                    // Predefined
                    order = Object.keys(posixPathType).map((key) => (posixPathType as any)[key]);
                }
            } else if (Path.sep === "\\") {
                // Windows
                if (windowsOrder) {
                    // Custom
                    order = [].map.call(windowsOrder, (key) => windowsPathType[key]);
                } else {
                    // Predefined
                    order = Object.keys(windowsPathType).map((key) => (windowsPathType as any)[key]);
                }
            } else {
                // Other platform
                order = Object.keys(otherPlatformPathType).map((key) => (otherPlatformPathType as any)[key]);
            }
            // Paths with unrecognized parsed root will be at the end. It should never happen, though.
            order.push(otherRoot);
            return order;
        }

        function parse(path: any) {
            const original = path;

            // Find the path string in the given element
            let pathString = undefined;
            if (typeof path === "string") {
                pathString = path;
            } else if (
                pathKey !== undefined &&
                path !== null &&
                typeof path === "object" &&
                typeof path[pathKey] === "string"
            ) {
                pathString = path[pathKey];
            }

            if (pathString === undefined) {
                // Unreadable element
                return { original, pathString };
            }

            // Parse and normalize never throw if you send a string, and always return strings
            const normalizedPathString = Path.normalize(pathString);
            let { root, dir, base } = Path.parse(normalizedPathString);

            let pathType = undefined;
            if (Path.sep === "/") {
                // Posix
                if (root) {
                    if (root === "/") {
                        pathType = posixPathType.abs;
                        // Optimization. Also, without this line files from the root dir would be
                        // wrongly treated as files from /""/ (empty name dir in the root dir)
                        dir = dir.slice(1);
                    } else {
                        pathType = otherRoot;
                    }
                } else {
                    if (homePathsSupported && pathString.startsWith("~")) {
                        pathType = posixPathType.home;
                    } else {
                        pathType = posixPathType.rel;
                    }
                }
            } else if (Path.sep === "\\") {
                // Windows
                if (root) {
                    if (root.startsWith("\\\\")) {
                        if (root.length > 2 && (root[2] === "?" || root[2] === ".")) {
                            // There is no need to check root[3], it must be '\\'
                            // Otherwise, normalize() and parse() would produce a completely different root
                            pathType = windowsPathType.nms;
                        } else {
                            pathType = windowsPathType.unc;
                        }
                        if (dir.endsWith("\\")) {
                            // Optimization. Also, remove separator from the end to avoid the empty name subdir problem
                            dir = dir.slice(2, -1);
                        } else {
                            // Optimization
                            dir = dir.slice(2);
                        }
                    } else if (root.startsWith("\\")) {
                        pathType = windowsPathType.abs;
                        // Optimization. Also, without this line files from the root dir would be
                        // wrongly treated as files from \""\ (empty name dir in the root dir)
                        dir = dir.slice(1);
                    } else if (root.endsWith(":\\")) {
                        pathType = windowsPathType.dabs;
                        if (dir.endsWith("\\")) {
                            // This can be only the root dir (e.g. C:\), that's how parse() works.
                            // Remove ':' and also remove separator from the end to avoid the empty name subdir problem
                            dir = `${dir.slice(0, root.length - 2)}${dir.slice(root.length - 1, -1)}`;
                        } else {
                            // Remove ':'
                            dir = `${dir.slice(0, root.length - 2)}${dir.slice(root.length - 1)}`;
                        }
                    } else if (root.endsWith(":")) {
                        pathType = windowsPathType.drel;
                        if (dir.length === root.length) {
                            // Remove ':'
                            dir = dir.slice(0, -1);
                        } else {
                            // Remove ':' and add `\\` between drive and subdir as they should be individually compared
                            dir = `${dir.slice(0, root.length - 1)}\\${dir.slice(root.length)}`;
                        }
                    } else {
                        pathType = otherRoot;
                    }
                } else {
                    if (homePathsSupported && pathString.startsWith("~")) {
                        pathType = windowsPathType.home;
                    } else {
                        pathType = windowsPathType.rel;
                    }
                }
            } else {
                // Other platform
                if (root) {
                    pathType = otherRoot;
                } else {
                    pathType = otherPlatformPathType.nonroot;
                }
            }

            // Root is always included in dir
            const dirs = dir ? dir.split(Path.sep) : [];

            return { original, pathString, normalizedPathString, pathType, dirs, base };
        }

        function compare(
            leftPath: {
                pathString?: string;
                normalizedPathString?: string;
                pathType: number;
                dirs: string[];
                base: string;
            },
            rightPath: {
                pathString?: string;
                normalizedPathString?: string;
                pathType: number;
                dirs: string[];
                base: string;
            },
        ): number {
            // Unreadable elements will be at the end, before holes
            const leftUnreadable = leftPath.pathString === undefined ? 1 : 0;
            const rightUnreadable = rightPath.pathString === undefined ? -1 : 0;
            if (leftUnreadable || rightUnreadable) {
                return leftUnreadable + rightUnreadable;
            }

            // Different types of paths are never directly compared
            if (leftPath.pathType !== rightPath.pathType) {
                // Find first in the list, which should always contain both.
                for (const pathType of pathOrder) {
                    if (pathType === leftPath.pathType) return -1;
                    if (pathType === rightPath.pathType) return 1;
                }
            }

            // Same types of paths. Compare dirs first.
            for (let i = 0; i < leftPath.dirs.length && i < rightPath.dirs.length; i++) {
                const result = segmentCompareFn(leftPath.dirs[i], rightPath.dirs[i]);
                if (result !== 0) return result;
            }

            // Dirs match, but one path might be deeper.
            if (leftPath.dirs.length === rightPath.dirs.length) {
                // Dirs completely match.
                const result = segmentCompareFn(leftPath.base, rightPath.base);
                if (result !== 0) return result;
                // Two normalized paths are equal, compare full unnormalized versions.
                return segmentCompareFn((leftPath as any).pathString, (rightPath as any).pathString);
            } else if (!(deepFirst || shallowFirst)) {
                // Base vs directory
                const result =
                    leftPath.dirs.length < rightPath.dirs.length
                        ? segmentCompareFn(leftPath.base, rightPath.dirs[leftPath.dirs.length])
                        : segmentCompareFn(leftPath.dirs[rightPath.dirs.length], rightPath.base);
                if (result !== 0) return result;
                // Directory vs its content, compare full normalized paths
                return segmentCompareFn(
                    (leftPath as any).normalizedPathString,
                    (rightPath as any).normalizedPathString,
                );
            } else {
                // Deep vs shallow. Exactly one of deepFirst and shallowFirst is true, no need to test both.
                return (leftPath.dirs.length < rightPath.dirs.length ? -1 : 1) * (deepFirst ? -1 : 1);
            }
        }

        /**
         * Cross-platform file path sorting function.
         *
         * @param {(string[]|any[])} paths Array of path strings or objects containing path strings.
         * @param {SortOptions} [options] Sort options.
         * @returns {(string[]|any[])} Sorted array.
         */
    }
}
