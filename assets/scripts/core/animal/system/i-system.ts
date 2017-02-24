/**
 * Created by FIRCorp on 24.02.2017.
 */
namespace Animal.System {
    export interface ISystem {
        /**
         * У любой системы есть субъективное состояние
         * @type {SystemScale}
         */
        state: Animal.Scale.TypeScale.SystemScale;
        /**
         * Любая система умеет себя анализировать
         */
        analysis(): void;
    }
}