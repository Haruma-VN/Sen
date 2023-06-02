"use strict";
var Sen;
(function (Sen) {
    var Script;
    (function (Script) {
        var Modules;
        (function (Modules) {
            var System;
            (function (System) {
                var Default;
                (function (Default) {
                    var Timer;
                    (function (Timer) {
                        /**
                         *
                         * @returns Get current time
                         */
                        function CurrentTime() {
                            return Date.now();
                        }
                        Timer.CurrentTime = CurrentTime;
                        /**
                         *
                         * @param begin_time - Pass begin time
                         * @param end_time - Pass end time
                         * @param to_fixed - Fixed number if possible
                         * @returns Fixed number as string
                         */
                        function CalculateTime(begin_time, end_time, to_fixed = 3) {
                            return ((end_time - begin_time) / 1000).toFixed(to_fixed);
                        }
                        Timer.CalculateTime = CalculateTime;
                    })(Timer = Default.Timer || (Default.Timer = {}));
                })(Default = System.Default || (System.Default = {}));
            })(System = Modules.System || (Modules.System = {}));
        })(Modules = Script.Modules || (Script.Modules = {}));
    })(Script = Sen.Script || (Sen.Script = {}));
})(Sen || (Sen = {}));
