namespace Sen.Script.Modules.Executable.PvZ2.PvZ2CBundlePortToPvZ2IBundle {
    export class BundleList {
        /**
         * argument
         */
        private _argument: Array<Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure> = [];

        /**
         * getter
         */

        get argument(): Array<Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure> {
            return this._argument;
        }

        /**
         * setter
         */

        set argument(str: Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure) {
            this._argument.push(str);
            return;
        }

        /**
         *
         * @param index - Pass index to delete
         * @returns
         */

        public DeleteArgument(index: int): void {
            if (this._argument.length >= 1) {
                this._argument.splice(index, 1);
            }
            return;
        }

        /**
         * Print arguments
         * @returns
         */

        public PrintArgument(): void {
            this._argument.forEach((arg: Sen.Script.Modules.Executable.PvZ2.RemoveSubgroup.SubgroupChildrenStructure, index: int) => {
                const name: Array<string> = Object.keys(arg);
                Sen.Shell.Console.Printf(null, `		${index + 1}. ${name[0]}`);
            });
            return;
        }
    }
}
