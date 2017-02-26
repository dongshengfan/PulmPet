/**
 * Created by FIRCorp on 24.02.2017.
 */
namespace Animals.Systems {
    export interface ISystem {
        /**
         * У любой системы есть субъективное состояние
         * @type {SystemScale}
         */
        state: Animals.Scales.TypeScales.SystemScale;
        /**
         * Любая система умеет себя анализировать
         */
        analysis(): void;
    }
}