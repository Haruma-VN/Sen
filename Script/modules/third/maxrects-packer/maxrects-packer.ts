namespace Runtime.Script.Modules.Third.JavaScript.MaxRectsAlgorithm {
    export interface IRectangle {
        width: number;
        height: number;
        x: number;
        y: number;
        [propName: string]: any;
    }

    export interface IBin {
        width: number;
        height: number;
        maxWidth: number;
        maxHeight: number;
        freeRects: IRectangle[];
        rects: IRectangle[];
        options: IOption;
        [propName: string]: any;
    }

    export abstract class Bin<T extends IRectangle> implements IBin {
        public width!: number;
        public height!: number;
        public maxWidth!: number;
        public maxHeight!: number;
        public freeRects!: IRectangle[];
        public rects!: T[];
        public options!: IOption;
        public abstract add(rect: T): T | undefined;
        public abstract add(width: number, height: number, data: any): T | undefined;
        public abstract reset(deepRest: boolean): void;
        public abstract repack(): T[] | undefined;

        public data?: any;
        public tag?: string;

        protected _dirty: number = 0;
        get dirty(): boolean {
            return this._dirty > 0 || this.rects.some((rect) => rect.dirty);
        }
        /**
         * Set bin dirty status
         *
         * @memberof Bin
         */
        public setDirty(value: boolean = true): void {
            this._dirty = value ? this._dirty + 1 : 0;
            if (!value) {
                for (let rect of this.rects) {
                    if (rect.setDirty) rect.setDirty(false);
                }
            }
        }

        public abstract clone(): Bin<T>;
    }

    export class MaxRectsBin<T extends IRectangle = Rectangle> extends Bin<T> {
        public width: number;
        public height: number;
        public freeRects: Rectangle[] = [];
        public rects: T[] = [];
        private verticalExpand: boolean = false;
        private stage: Rectangle;
        private border: number;
        public options: IOption = {
            smart: true,
            pot: true,
            square: true,
            allowRotation: false,
            tag: false,
            exclusiveTag: true,
            border: 0,
            logic: PACKING_LOGIC.MAX_EDGE,
        };

        constructor(
            public maxWidth: number = EDGE_MAX_VALUE,
            public maxHeight: number = EDGE_MAX_VALUE,
            public padding: number = 0,
            options: IOption = {},
        ) {
            super();
            this.options = { ...this.options, ...options };
            this.width = this.options.smart ? 1 : maxWidth;
            this.height = this.options.smart ? 1 : maxHeight;
            this.border = this.options.border ? this.options.border : 0;
            this.freeRects.push(
                new Rectangle(
                    this.maxWidth + this.padding - this.border * 2,
                    this.maxHeight + this.padding - this.border * 2,
                    this.border,
                    this.border,
                ),
            );
            this.stage = new Rectangle(this.width, this.height);
        }

        public add(rect: T): T | undefined;
        public add(width: number, height: number, data: any): T | undefined;
        public add(...args: any[]): any {
            let data: any;
            let rect: IRectangle;
            if (args.length === 1) {
                if (typeof args[0] !== "object") throw new Error("MacrectsBin.add(): Wrong parameters");
                rect = args[0] as T;
                // Check if rect.tag match bin.tag, if bin.tag not defined, it will accept any rect
                let tag = rect.data && rect.data.tag ? rect.data.tag : rect.tag ? rect.tag : undefined;
                if (this.options.tag && this.options.exclusiveTag && this.tag !== tag) return undefined;
            } else {
                data = args.length > 2 ? args[2] : null;
                // Check if data.tag match bin.tag, if bin.tag not defined, it will accept any rect
                if (this.options.tag && this.options.exclusiveTag) {
                    if (data && this.tag !== data.tag) return undefined;
                    if (!data && this.tag) return undefined;
                }
                rect = new Rectangle(args[0], args[1]);
                rect.data = data;
                rect.setDirty(false);
            }

            const result = this.place(rect);
            if (result) this.rects.push(result);
            return result;
        }

        public repack(): T[] | undefined {
            let unpacked: T[] = [];
            this.reset();
            // re-sort rects from big to small
            this.rects.sort((a, b) => {
                const result = Math.max(b.width, b.height) - Math.max(a.width, a.height);
                if (result === 0 && a.hash && b.hash) {
                    return a.hash > b.hash ? -1 : 1;
                } else return result;
            });
            for (let rect of this.rects) {
                if (!this.place(rect)) {
                    unpacked.push(rect);
                }
            }
            for (let rect of unpacked) this.rects.splice(this.rects.indexOf(rect), 1);
            return unpacked.length > 0 ? unpacked : undefined;
        }

        public reset(deepReset: boolean = false, resetOption: boolean = false): void {
            if (deepReset) {
                if (this.data) delete this.data;
                if (this.tag) delete this.tag;
                this.rects = [];
                if (resetOption) {
                    this.options = {
                        smart: true,
                        pot: true,
                        square: true,
                        allowRotation: false,
                        tag: false,
                        border: 0,
                    };
                }
            }
            this.width = this.options.smart ? 0 : this.maxWidth;
            this.height = this.options.smart ? 0 : this.maxHeight;
            this.border = this.options.border ? this.options.border : 0;
            this.freeRects = [
                new Rectangle(
                    this.maxWidth + this.padding - this.border * 2,
                    this.maxHeight + this.padding - this.border * 2,
                    this.border,
                    this.border,
                ),
            ];
            this.stage = new Rectangle(this.width, this.height);
            this._dirty = 0;
        }

        public clone(): MaxRectsBin<T> {
            let clonedBin: MaxRectsBin<T> = new MaxRectsBin<T>(
                this.maxWidth,
                this.maxHeight,
                this.padding,
                this.options,
            );
            for (let rect of this.rects) {
                clonedBin.add(rect);
            }
            return clonedBin;
        }

        private place(rect: IRectangle): T | undefined {
            // recheck if tag matched
            let tag = rect.data && rect.data.tag ? rect.data.tag : rect.tag ? rect.tag : undefined;
            if (this.options.tag && this.options.exclusiveTag && this.tag !== tag) return undefined;

            let node: IRectangle | undefined;
            let allowRotation: boolean | undefined;
            // getter/setter do not support hasOwnProperty()
            if (rect.hasOwnProperty("_allowRotation") && rect.allowRotation !== undefined) {
                allowRotation = rect.allowRotation; // Per Rectangle allowRotation override packer settings
            } else {
                allowRotation = this.options.allowRotation;
            }
            node = this.findNode(rect.width + this.padding, rect.height + this.padding, allowRotation);

            if (node) {
                this.updateBinSize(node);
                let numRectToProcess = this.freeRects.length;
                let i: number = 0;
                while (i < numRectToProcess) {
                    if (this.splitNode(this.freeRects[i], node)) {
                        this.freeRects.splice(i, 1);
                        numRectToProcess--;
                        i--;
                    }
                    i++;
                }
                this.pruneFreeList();
                this.verticalExpand = this.width > this.height ? true : false;
                rect.x = node.x;
                rect.y = node.y;
                if (rect.rot === undefined) rect.rot = false;
                rect.rot = node.rot ? !rect.rot : rect.rot;
                this._dirty++;
                return rect as T;
            } else if (!this.verticalExpand) {
                if (
                    this.updateBinSize(
                        new Rectangle(
                            rect.width + this.padding,
                            rect.height + this.padding,
                            this.width + this.padding - this.border,
                            this.border,
                        ),
                    ) ||
                    this.updateBinSize(
                        new Rectangle(
                            rect.width + this.padding,
                            rect.height + this.padding,
                            this.border,
                            this.height + this.padding - this.border,
                        ),
                    )
                ) {
                    return this.place(rect);
                }
            } else {
                if (
                    this.updateBinSize(
                        new Rectangle(
                            rect.width + this.padding,
                            rect.height + this.padding,
                            this.border,
                            this.height + this.padding - this.border,
                        ),
                    ) ||
                    this.updateBinSize(
                        new Rectangle(
                            rect.width + this.padding,
                            rect.height + this.padding,
                            this.width + this.padding - this.border,
                            this.border,
                        ),
                    )
                ) {
                    return this.place(rect);
                }
            }
            return undefined;
        }

        private findNode(width: number, height: number, allowRotation?: boolean): Rectangle | undefined {
            let score: number = Number.MAX_VALUE;
            let areaFit: number;
            let r: Rectangle;
            let bestNode: Rectangle | undefined;
            for (let i in this.freeRects) {
                r = this.freeRects[i];
                if (r.width >= width && r.height >= height) {
                    areaFit =
                        this.options.logic === PACKING_LOGIC.MAX_AREA
                            ? r.width * r.height - width * height
                            : Math.min(r.width - width, r.height - height);
                    if (areaFit < score) {
                        bestNode = new Rectangle(width, height, r.x, r.y);
                        score = areaFit;
                    }
                }

                if (!allowRotation) continue;

                // Continue to test 90-degree rotated rectangle
                if (r.width >= height && r.height >= width) {
                    areaFit =
                        this.options.logic === PACKING_LOGIC.MAX_AREA
                            ? r.width * r.height - height * width
                            : Math.min(r.height - width, r.width - height);
                    if (areaFit < score) {
                        bestNode = new Rectangle(height, width, r.x, r.y, true); // Rotated node
                        score = areaFit;
                    }
                }
            }
            return bestNode;
        }

        private splitNode(freeRect: IRectangle, usedNode: IRectangle): boolean {
            // Test if usedNode intersect with freeRect
            if (!freeRect.collide(usedNode)) return false;

            // Do vertical split
            if (usedNode.x < freeRect.x + freeRect.width && usedNode.x + usedNode.width > freeRect.x) {
                // New node at the top side of the used node
                if (usedNode.y > freeRect.y && usedNode.y < freeRect.y + freeRect.height) {
                    let newNode: Rectangle = new Rectangle(
                        freeRect.width,
                        usedNode.y - freeRect.y,
                        freeRect.x,
                        freeRect.y,
                    );
                    this.freeRects.push(newNode);
                }
                // New node at the bottom side of the used node
                if (usedNode.y + usedNode.height < freeRect.y + freeRect.height) {
                    let newNode = new Rectangle(
                        freeRect.width,
                        freeRect.y + freeRect.height - (usedNode.y + usedNode.height),
                        freeRect.x,
                        usedNode.y + usedNode.height,
                    );
                    this.freeRects.push(newNode);
                }
            }

            // Do Horizontal split
            if (usedNode.y < freeRect.y + freeRect.height && usedNode.y + usedNode.height > freeRect.y) {
                // New node at the left side of the used node.
                if (usedNode.x > freeRect.x && usedNode.x < freeRect.x + freeRect.width) {
                    let newNode = new Rectangle(usedNode.x - freeRect.x, freeRect.height, freeRect.x, freeRect.y);
                    this.freeRects.push(newNode);
                }
                // New node at the right side of the used node.
                if (usedNode.x + usedNode.width < freeRect.x + freeRect.width) {
                    let newNode = new Rectangle(
                        freeRect.x + freeRect.width - (usedNode.x + usedNode.width),
                        freeRect.height,
                        usedNode.x + usedNode.width,
                        freeRect.y,
                    );
                    this.freeRects.push(newNode);
                }
            }
            return true;
        }

        private pruneFreeList() {
            // Go through each pair of freeRects and remove any rects that is redundant
            let i: number = 0;
            let j: number = 0;
            let len: number = this.freeRects.length;
            while (i < len) {
                j = i + 1;
                let tmpRect1 = this.freeRects[i];
                while (j < len) {
                    let tmpRect2 = this.freeRects[j];
                    if (tmpRect2.contain(tmpRect1)) {
                        this.freeRects.splice(i, 1);
                        i--;
                        len--;
                        break;
                    }
                    if (tmpRect1.contain(tmpRect2)) {
                        this.freeRects.splice(j, 1);
                        j--;
                        len--;
                    }
                    j++;
                }
                i++;
            }
        }

        private updateBinSize(node: IRectangle): boolean {
            if (!this.options.smart) return false;
            if (this.stage.contain(node)) return false;
            let tmpWidth: number = Math.max(this.width, node.x + node.width - this.padding + this.border);
            let tmpHeight: number = Math.max(this.height, node.y + node.height - this.padding + this.border);
            if (this.options.allowRotation) {
                // do extra test on rotated node whether it's a better choice
                const rotWidth: number = Math.max(this.width, node.x + node.height - this.padding + this.border);
                const rotHeight: number = Math.max(this.height, node.y + node.width - this.padding + this.border);
                if (rotWidth * rotHeight < tmpWidth * tmpHeight) {
                    tmpWidth = rotWidth;
                    tmpHeight = rotHeight;
                }
            }
            if (this.options.pot) {
                tmpWidth = Math.pow(2, Math.ceil(Math.log(tmpWidth) * Math.LOG2E));
                tmpHeight = Math.pow(2, Math.ceil(Math.log(tmpHeight) * Math.LOG2E));
            }
            if (this.options.square) {
                tmpWidth = tmpHeight = Math.max(tmpWidth, tmpHeight);
            }
            if (tmpWidth > this.maxWidth + this.padding || tmpHeight > this.maxHeight + this.padding) {
                return false;
            }
            this.expandFreeRects(tmpWidth + this.padding, tmpHeight + this.padding);
            this.width = this.stage.width = tmpWidth;
            this.height = this.stage.height = tmpHeight;
            return true;
        }

        private expandFreeRects(width: number, height: number) {
            this.freeRects.forEach((freeRect, index) => {
                if (freeRect.x + freeRect.width >= Math.min(this.width + this.padding - this.border, width)) {
                    freeRect.width = width - freeRect.x - this.border;
                }
                if (freeRect.y + freeRect.height >= Math.min(this.height + this.padding - this.border, height)) {
                    freeRect.height = height - freeRect.y - this.border;
                }
            }, this);
            this.freeRects.push(
                new Rectangle(
                    width - this.width - this.padding,
                    height - this.border * 2,
                    this.width + this.padding - this.border,
                    this.border,
                ),
            );
            this.freeRects.push(
                new Rectangle(
                    width - this.border * 2,
                    height - this.height - this.padding,
                    this.border,
                    this.height + this.padding - this.border,
                ),
            );
            this.freeRects = this.freeRects.filter((freeRect) => {
                return !(
                    freeRect.width <= 0 ||
                    freeRect.height <= 0 ||
                    freeRect.x < this.border ||
                    freeRect.y < this.border
                );
            });
            this.pruneFreeList();
        }
    }

    export class Rectangle implements IRectangle {
        /**
         * Oversized tag on rectangle which is bigger than packer itself.
         *
         * @type {boolean}
         * @memberof Rectangle
         */
        public oversized: boolean = false;

        /**
         * Creates an instance of Rectangle.
         *
         * @param {number} [width=0]
         * @param {number} [height=0]
         * @param {number} [x=0]
         * @param {number} [y=0]
         * @param {boolean} [rot=false]
         * @param {boolean} [allowRotation=false]
         * @memberof Rectangle
         */
        constructor(
            width: number = 0,
            height: number = 0,
            x: number = 0,
            y: number = 0,
            rot: boolean = false,
            allowRotation: boolean | undefined = undefined,
        ) {
            this._width = width;
            this._height = height;
            this._x = x;
            this._y = y;
            this._data = {};
            this._rot = rot;
            this._allowRotation = allowRotation;
        }

        /**
         * Test if two given rectangle collide each other
         *
         * @static
         * @param {IRectangle} first
         * @param {IRectangle} second
         * @returns
         * @memberof Rectangle
         */
        public static Collide(first: IRectangle, second: IRectangle) {
            return first.collide(second);
        }

        /**
         * Test if the first rectangle contains the second one
         *
         * @static
         * @param {IRectangle} first
         * @param {IRectangle} second
         * @returns
         * @memberof Rectangle
         */
        public static Contain(first: IRectangle, second: IRectangle) {
            return first.contain(second);
        }

        /**
         * Get the area (w * h) of the rectangle
         *
         * @returns {number}
         * @memberof Rectangle
         */
        public area(): number {
            return this.width * this.height;
        }

        /**
         * Test if the given rectangle collide with this rectangle.
         *
         * @param {IRectangle} rect
         * @returns {boolean}
         * @memberof Rectangle
         */
        public collide(rect: IRectangle): boolean {
            return (
                rect.x < this.x + this.width &&
                rect.x + rect.width > this.x &&
                rect.y < this.y + this.height &&
                rect.y + rect.height > this.y
            );
        }

        /**
         * Test if this rectangle contains the given rectangle.
         *
         * @param {IRectangle} rect
         * @returns {boolean}
         * @memberof Rectangle
         */
        public contain(rect: IRectangle): boolean {
            return (
                rect.x >= this.x &&
                rect.y >= this.y &&
                rect.x + rect.width <= this.x + this.width &&
                rect.y + rect.height <= this.y + this.height
            );
        }

        protected _width: number;
        get width(): number {
            return this._width;
        }
        set width(value: number) {
            if (value === this._width) return;
            this._width = value;
            this._dirty++;
        }

        protected _height: number;
        get height(): number {
            return this._height;
        }
        set height(value: number) {
            if (value === this._height) return;
            this._height = value;
            this._dirty++;
        }

        protected _x: number;
        get x(): number {
            return this._x;
        }
        set x(value: number) {
            if (value === this._x) return;
            this._x = value;
            this._dirty++;
        }

        protected _y: number;
        get y(): number {
            return this._y;
        }
        set y(value: number) {
            if (value === this._y) return;
            this._y = value;
            this._dirty++;
        }

        protected _rot: boolean = false;

        /**
         * If the rectangle is rotated
         *
         * @type {boolean}
         * @memberof Rectangle
         */
        get rot(): boolean {
            return this._rot;
        }

        /**
         * Set the rotate tag of the rectangle.
         *
         * note: after `rot` is set, `width/height` of this rectangle is swaped.
         *
         * @memberof Rectangle
         */
        set rot(value: boolean) {
            if (this._allowRotation === false) return;

            if (this._rot !== value) {
                const tmp = this.width;
                this.width = this.height;
                this.height = tmp;
                this._rot = value;
                this._dirty++;
            }
        }

        protected _allowRotation: boolean | undefined = undefined;

        /**
         * If the rectangle allow rotation
         *
         * @type {boolean}
         * @memberof Rectangle
         */
        get allowRotation(): boolean | undefined {
            return this._allowRotation;
        }

        /**
         * Set the allowRotation tag of the rectangle.
         *
         * @memberof Rectangle
         */
        set allowRotation(value: boolean | undefined) {
            if (this._allowRotation !== value) {
                this._allowRotation = value;
                this._dirty++;
            }
        }

        protected _data: any;
        get data(): any {
            return this._data;
        }
        set data(value: any) {
            if (value === null || value === this._data) return;
            this._data = value;
            // extract allowRotation settings
            if (typeof value === "object" && value.hasOwnProperty("allowRotation")) {
                this._allowRotation = value.allowRotation;
            }
            this._dirty++;
        }

        protected _dirty: number = 0;
        get dirty(): boolean {
            return this._dirty > 0;
        }
        public setDirty(value: boolean = true): void {
            this._dirty = value ? this._dirty + 1 : 0;
        }
    }

    export class OversizedElementBin<T extends IRectangle = Rectangle> extends Bin<T> {
        public width: number;
        public height: number;
        public data: any;
        public maxWidth: number;
        public maxHeight: number;
        public options: IOption;
        public rects: T[] = [];
        public freeRects: IRectangle[];

        constructor(rect: T);
        constructor(width: number, height: number, data: any);
        constructor(...args: any[]) {
            super();
            if (args.length === 1) {
                if (typeof args[0] !== "object") throw new Error("OversizedElementBin: Wrong parameters");
                const rect = args[0];
                this.rects = [rect];
                this.width = rect.width;
                this.height = rect.height;
                this.data = rect.data;
                rect.oversized = true;
            } else {
                this.width = args[0];
                this.height = args[1];
                this.data = args.length > 2 ? args[2] : null;
                const rect: IRectangle = new Rectangle(this.width, this.height);
                rect.oversized = true;
                rect.data = this.data;
                this.rects.push(rect as T);
            }
            this.freeRects = [];
            this.maxWidth = this.width;
            this.maxHeight = this.height;
            this.options = { smart: false, pot: false, square: false };
        }

        add() {
            return undefined;
        }
        reset(deepReset: boolean = false): void {
            // nothing to do here
        }
        repack(): T[] | undefined {
            return undefined;
        }
        clone(): Bin<T> {
            let clonedBin: OversizedElementBin<T> = new OversizedElementBin<T>(this.rects[0]);
            return clonedBin;
        }
    }

    export const EDGE_MAX_VALUE: number = 4096;
    export const EDGE_MIN_VALUE: number = 128;
    export enum PACKING_LOGIC {
        MAX_AREA = 0,
        MAX_EDGE = 1,
    }

    /**
     * Options for MaxRect Packer
     * @property {boolean} options.smart Smart sizing packer (default is true)
     * @property {boolean} options.pot use power of 2 sizing (default is true)
     * @property {boolean} options.square use square size (default is false)
     * @property {boolean} options.allowRotation allow rotation packing (default is false)
     * @property {boolean} options.tag allow auto grouping based on `rect.tag` (default is false)
     * @property {boolean} options.exclusiveTag tagged rects will have dependent bin, if set to `false`, packer will try to put tag rects into the same bin (default is true)
     * @property {boolean} options.border atlas edge spacing (default is 0)
     * @property {PACKING_LOGIC} options.logic MAX_AREA or MAX_EDGE based sorting logic (default is MAX_EDGE)
     * @export
     * @interface Option
     */
    export interface IOption {
        smart?: boolean;
        pot?: boolean;
        square?: boolean;
        allowRotation?: boolean;
        tag?: boolean;
        exclusiveTag?: boolean;
        border?: number;
        logic?: PACKING_LOGIC;
    }

    export class MaxRectsPacker<T extends IRectangle = Rectangle> {
        /**
         * The Bin array added to the packer
         *
         * @type {Bin[]}
         * @memberof MaxRectsPacker
         */
        public bins: Bin<T>[];

        /**
         * Options for MaxRect Packer
         * @property {boolean} options.smart Smart sizing packer (default is true)
         * @property {boolean} options.pot use power of 2 sizing (default is true)
         * @property {boolean} options.square use square size (default is false)
         * @property {boolean} options.allowRotation allow rotation packing (default is false)
         * @property {boolean} options.tag allow auto grouping based on `rect.tag` (default is false)
         * @property {boolean} options.exclusiveTag tagged rects will have dependent bin, if set to `false`, packer will try to put tag rects into the same bin (default is true)
         * @property {boolean} options.border atlas edge spacing (default is 0)
         * @property {PACKING_LOGIC} options.logic MAX_AREA or MAX_EDGE based sorting logic (default is MAX_EDGE)
         * @export
         * @interface Option
         */
        public options: IOption = {
            smart: true,
            pot: true,
            square: false,
            allowRotation: false,
            tag: false,
            exclusiveTag: true,
            border: 0,
            logic: PACKING_LOGIC.MAX_EDGE,
        };

        /**
         * Creates an instance of MaxRectsPacker.
         * @param {number} width of the output atlas (default is 4096)
         * @param {number} height of the output atlas (default is 4096)
         * @param {number} padding between glyphs/images (default is 0)
         * @param {IOption} [options={}] (Optional) packing options
         * @memberof MaxRectsPacker
         */
        constructor(
            public width: number = EDGE_MAX_VALUE,
            public height: number = EDGE_MAX_VALUE,
            public padding: number = 0,
            options: IOption = {},
        ) {
            this.bins = [];
            this.options = { ...this.options, ...options };
        }

        /**
         * Add a bin/rectangle object with data to packer
         * @param {number} width of the input bin/rectangle
         * @param {number} height of the input bin/rectangle
         * @param {*} data custom data object
         * @memberof MaxRectsPacker
         */
        public add(width: number, height: number, data: any): T;
        /**
         * Add a bin/rectangle object extends IRectangle to packer
         * @template T Generic type extends IRectangle interface
         * @param {T} rect the rect object add to the packer bin
         * @memberof MaxRectsPacker
         */
        public add(rect: T): T;
        public add(...args: any[]): any {
            if (args.length === 1) {
                if (typeof args[0] !== "object") throw new Error("MacrectsPacker.add(): Wrong parameters");
                const rect = args[0] as T;
                if (rect.width > this.width || rect.height > this.height) {
                    this.bins.push(new OversizedElementBin<T>(rect));
                } else {
                    let added = this.bins.slice(this._currentBinIndex).find((bin) => bin.add(rect) !== undefined);
                    if (!added) {
                        let bin = new MaxRectsBin<T>(this.width, this.height, this.padding, this.options);
                        let tag = rect.data && rect.data.tag ? rect.data.tag : rect.tag ? rect.tag : undefined;
                        if (this.options.tag && tag) bin.tag = tag;
                        bin.add(rect);
                        this.bins.push(bin);
                    }
                }
                return rect;
            } else {
                const rect: IRectangle = new Rectangle(args[0], args[1]);
                if (args.length > 2) rect.data = args[2];

                if (rect.width > this.width || rect.height > this.height) {
                    this.bins.push(new OversizedElementBin<T>(rect as T));
                } else {
                    let added = this.bins.slice(this._currentBinIndex).find((bin) => bin.add(rect as T) !== undefined);
                    if (!added) {
                        let bin = new MaxRectsBin<T>(this.width, this.height, this.padding, this.options);
                        if (this.options.tag && rect.data.tag) bin.tag = rect.data.tag;
                        bin.add(rect as T);
                        this.bins.push(bin);
                    }
                }
                return rect as T;
            }
        }

        /**
         * Add an Array of bins/rectangles to the packer.
         *
         * `Javascript`: Any object has property: { width, height, ... } is accepted.
         *
         * `Typescript`: object shall extends `MaxrectsPacker.IRectangle`.
         *
         * note: object has `hash` property will have more stable packing result
         *
         * @param {IRectangle[]} rects Array of bin/rectangles
         * @memberof MaxRectsPacker
         */
        public addArray(rects: T[]) {
            if (!this.options.tag || this.options.exclusiveTag) {
                // if not using tag or using exclusiveTag, old approach
                this.sort(rects, this.options.logic).forEach((rect) => this.add(rect));
            } else {
                // sort rects by tags first
                if (rects.length === 0) return;
                rects.sort((a, b) => {
                    const aTag = a.data && a.data.tag ? a.data.tag : a.tag ? a.tag : undefined;
                    const bTag = b.data && b.data.tag ? b.data.tag : b.tag ? b.tag : undefined;
                    return bTag === undefined ? -1 : aTag === undefined ? 1 : bTag > aTag ? -1 : 1;
                });

                // iterate all bins to find the first bin which can place rects with same tag
                //
                let currentTag: any;
                let currentIdx: number = 0;
                let targetBin = this.bins.slice(this._currentBinIndex).find((bin, binIndex) => {
                    let testBin = bin.clone();
                    for (let i = currentIdx; i < rects.length; i++) {
                        const rect = rects[i];
                        const tag = rect.data && rect.data.tag ? rect.data.tag : rect.tag ? rect.tag : undefined;

                        // initialize currentTag
                        if (i === 0) currentTag = tag;

                        if (tag !== currentTag) {
                            // all current tag memeber tested successfully
                            currentTag = tag;
                            // do addArray()
                            this.sort(rects.slice(currentIdx, i), this.options.logic).forEach((r) => bin.add(r));
                            currentIdx = i;

                            // recrusively addArray() with remaining rects
                            this.addArray(rects.slice(i));
                            return true;
                        }

                        // remaining untagged rect will use normal addArray()
                        if (tag === undefined) {
                            // do addArray()
                            this.sort(rects.slice(i), this.options.logic).forEach((r) => this.add(r));
                            currentIdx = rects.length;
                            // end test
                            return true;
                        }

                        // still in the same tag group
                        if (testBin.add(rect) === undefined) {
                            // add the rects that could fit into the bins already
                            // do addArray()
                            this.sort(rects.slice(currentIdx, i), this.options.logic).forEach((r) => bin.add(r));
                            currentIdx = i;

                            // current bin cannot contain all tag members
                            // procceed to test next bin
                            return false;
                        }
                    }

                    // all rects tested
                    // do addArray() to the remaining tag group
                    this.sort(rects.slice(currentIdx), this.options.logic).forEach((r) => bin.add(r));
                    return true;
                });

                // create a new bin if no current bin fit
                if (!targetBin) {
                    const rect = rects[currentIdx];
                    const bin = new MaxRectsBin<T>(this.width, this.height, this.padding, this.options);
                    const tag = rect.data && rect.data.tag ? rect.data.tag : rect.tag ? rect.tag : undefined;
                    if (this.options.tag && this.options.exclusiveTag && tag) bin.tag = tag;
                    this.bins.push(bin);
                    // Add the rect to the newly created bin
                    bin.add(rect);
                    currentIdx++;
                    this.addArray(rects.slice(currentIdx));
                }
            }
        }

        /**
         * Reset entire packer to initial states, keep settings
         *
         * @memberof MaxRectsPacker
         */
        public reset(): void {
            this.bins = [];
            this._currentBinIndex = 0;
        }

        /**
         * Repack all elements inside bins
         *
         * @param {boolean} [quick=true] quick repack only dirty bins
         * @returns {void}
         * @memberof MaxRectsPacker
         */
        public repack(quick: boolean = true): void {
            if (quick) {
                let unpack: T[] = [];
                for (let bin of this.bins) {
                    if (bin.dirty) {
                        let up = bin.repack();
                        if (up) unpack.push(...up);
                    }
                }
                this.addArray(unpack);
                return;
            }
            if (!this.dirty) return;
            const allRects = this.rects;
            this.reset();
            this.addArray(allRects);
        }

        /**
         * Stop adding new element to the current bin and return a new bin.
         *
         * note: After calling `next()` all elements will no longer added to previous bins.
         *
         * @returns {Bin}
         * @memberof MaxRectsPacker
         */
        public next(): number {
            this._currentBinIndex = this.bins.length;
            return this._currentBinIndex;
        }

        /**
         * Load bins to the packer, overwrite exist bins
         * @param {MaxRectsBin[]} bins MaxRectsBin objects
         * @memberof MaxRectsPacker
         */
        public load(bins: IBin[]) {
            bins.forEach((bin, index) => {
                if (bin.maxWidth > this.width || bin.maxHeight > this.height) {
                    this.bins.push(new OversizedElementBin(bin.width, bin.height, {}));
                } else {
                    let newBin = new MaxRectsBin<T>(this.width, this.height, this.padding, bin.options);
                    newBin.freeRects.splice(0);
                    bin.freeRects.forEach((r, i) => {
                        newBin.freeRects.push(new Rectangle(r.width, r.height, r.x, r.y));
                    });
                    newBin.width = bin.width;
                    newBin.height = bin.height;
                    if (bin.tag) newBin.tag = bin.tag;
                    this.bins[index] = newBin;
                }
            }, this);
        }

        /**
         * Output current bins to save
         * @memberof MaxRectsPacker
         */
        public save(): IBin[] {
            let saveBins: IBin[] = [];
            this.bins.forEach((bin) => {
                let saveBin: IBin = {
                    width: bin.width,
                    height: bin.height,
                    maxWidth: bin.maxWidth,
                    maxHeight: bin.maxHeight,
                    freeRects: [],
                    rects: [],
                    options: bin.options,
                };
                if (bin.tag) saveBin = { ...saveBin, tag: bin.tag };
                bin.freeRects.forEach((r) => {
                    saveBin.freeRects.push({
                        x: r.x,
                        y: r.y,
                        width: r.width,
                        height: r.height,
                    });
                });
                saveBins.push(saveBin);
            });
            return saveBins;
        }

        /**
         * Sort the given rects based on longest edge or surface area.
         *
         * If rects have the same sort value, will sort by second key `hash` if presented.
         *
         * @private
         * @param {T[]} rects
         * @param {PACKING_LOGIC} [logic=PACKING_LOGIC.MAX_EDGE] sorting logic, "area" or "edge"
         * @returns
         * @memberof MaxRectsPacker
         */
        private sort(rects: T[], logic: IOption["logic"] = PACKING_LOGIC.MAX_EDGE) {
            return rects.slice().sort((a, b) => {
                const result =
                    logic === PACKING_LOGIC.MAX_EDGE
                        ? Math.max(b.width, b.height) - Math.max(a.width, a.height)
                        : b.width * b.height - a.width * a.height;
                if (result === 0 && a.hash && b.hash) {
                    return a.hash > b.hash ? -1 : 1;
                } else return result;
            });
        }

        private _currentBinIndex: number = 0;
        /**
         * Return current functioning bin index, perior to this wont accept any new elements
         *
         * @readonly
         * @type {number}
         * @memberof MaxRectsPacker
         */
        get currentBinIndex(): number {
            return this._currentBinIndex;
        }

        /**
         * Returns dirty status of all child bins
         *
         * @readonly
         * @type {boolean}
         * @memberof MaxRectsPacker
         */
        get dirty(): boolean {
            return this.bins.some((bin) => bin.dirty);
        }

        /**
         * Return all rectangles in this packer
         *
         * @readonly
         * @type {T[]}
         * @memberof MaxRectsPacker
         */
        get rects(): T[] {
            let allRects: T[] = [];
            for (let bin of this.bins) {
                allRects.push(...bin.rects);
            }
            return allRects;
        }
    }
}
