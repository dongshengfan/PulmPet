/**
 * Created by FIRCorp on 24.02.2017.
 */
namespace Animals.Systems.TypeSystems {
    /**
     * Класс опорнодвигательной системы
     */
    export class Muscular implements ISystem {
        /**
         * Субъективное состояние
         * @type {SystemScale}
         */
        state: Animals.Scales.TypeScales.SystemScale;

        /**
         * Скорость движения
         * @type {ArgumentScale}
         */
        protected _speed: Animals.Scales.TypeScales.ArgumentScale;

        /**
         * Вес животного
         * @type {ArgumentScale}
         */
        protected _weight: Animals.Scales.TypeScales.ArgumentScale;

        /**
         * Constructor of Muscular
         * @param scales объект шкал
         */
        constructor(scales: any) {
            this.state = scales[Animals.Scales.Factorys.ParameterScaleTypes.state] || new Animals.Scales.TypeScales.SystemScale([]);
            this.speed = scales[Animals.Scales.Factorys.ParameterScaleTypes.speed];
            this.weight = scales[Animals.Scales.Factorys.ParameterScaleTypes.weight];
        }

        set speed(param: Animals.Scales.TypeScales.ArgumentScale) {
            if (param) {
                this._speed = param;
            }
        }

        set weight(param: Animals.Scales.TypeScales.ArgumentScale) {
            if (param) {
                this._weight = param;
            }
        }

        get speed(): Animals.Scales.TypeScales.ArgumentScale {
            return this._speed;
        }

        get weight(): Animals.Scales.TypeScales.ArgumentScale {
            return this._weight;
        }

        /**
         * Изменить скорость на процент
         * @param delta дельта изменения
         */
        changeSpeed(delta: number) {
            this._speed.change(delta);
            this.analysis();
        }

        /**
         * Изменить вес на процент
         * @param delta дельта изменения
         */
        changeWeight(delta: number) {
            this._weight.change(delta);
            this.analysis();
        }

        /**
         * Анализирует систему
         */
        analysis(): void {
            this.state.analysis([]);
        }
    }
}