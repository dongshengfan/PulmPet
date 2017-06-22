/**
 * Created by FIRCorp on 24.02.2017.
 */
namespace Animals.Systems {
    /**
     * Класс опорнодвигательной системы. Отвечает за передвижение животного.
     */
    export class Muscular implements ISystem {
        /**
         * Субъективное состояние
         * @type {SystemScale}
         */
        state: Animals.Scales.SystemScale;

        /**
         * Ссылка на класс животного
         * @type {Animal}
         */
        _linkToAnimal: Animals.Animal;


        /**
         * Скорость движения
         * @type {ArgumentScale}
         */
        _speed: Animals.Scales.ArgumentScale;

        /**
         * Вес животного
         * @type {ArgumentScale}
         */
        _weight: Animals.Scales.ArgumentScale;

        /**
         * Constructor of Muscular
         * @param scales объект шкал
         */
        constructor(scales: any[]) {
            this._speed = null;
            this._weight = null;

            this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);
            this.speed = scales[Animals.Scales.ParameterScaleTypes.speed];
            this.weight = scales[Animals.Scales.ParameterScaleTypes.weight];
        }

        set speed(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._speed = param;
            }
        }

        set weight(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._weight = param;
            }
        }

        get speed(): Animals.Scales.ArgumentScale {
            return this._speed;
        }

        get weight(): Animals.Scales.ArgumentScale {
            return this._weight;
        }


        /**
         * Изменить скорость на процент
         * @param delta дельта изменения
         */
        changeSpeed(delta: number) {
            if (this._speed != null) {
                this._speed.change(delta);
                this.analysis();
            }
        }

        /**
         * Изменить вес на процент
         * @param delta дельта изменения
         */
        changeWeight(delta: number) {
            if (this._weight) {
                this._weight.change(delta);
                this.analysis();
            }
        }


        /**
         * Анализирует систему
         */
        analysis(): void {
            this.state.analysis([
                this.speed,
                this.weight
            ]);
        }
    }
}