/**
 * Created by FIRCorp on 24.02.2017.
 */
namespace Animal.System.TypeSystem {
    /**
     * Класс опорнодвигательной системы
     */
    export class Muscular implements ISystem {
        /**
         * Субъективное состояние
         * @type {SystemScale}
         */
        state: Animal.Scale.TypeScale.SystemScale;

        /**
         * Скорость движения
         * @type {ArgumentScale}
         */
        protected _speed: Animal.Scale.TypeScale.ArgumentScale;

        /**
         * Вес животного
         * @type {ArgumentScale}
         */
        protected _weight: Animal.Scale.TypeScale.ArgumentScale;

        /**
         * Constructor of Muscular
         * @param scales объект шкалл
         */
        constructor(scales: any) {
            this.state = scales[Animal.Scale.Factory.ParameterScaleTypes.state];
            this.speed = scales[Animal.Scale.Factory.ParameterScaleTypes.speed];
            this.weight = scales[Animal.Scale.Factory.ParameterScaleTypes.weight];
        }

        set speed(param: Animal.Scale.TypeScale.ArgumentScale) {
            this._speed = param;
        }

        set weight(param: Animal.Scale.TypeScale.ArgumentScale) {
            this._weight = param;
        }

        get speed(): Animal.Scale.TypeScale.ArgumentScale {
            return this._speed;
        }

        get weight(): Animal.Scale.TypeScale.ArgumentScale {
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