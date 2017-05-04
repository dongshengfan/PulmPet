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
         * Точка текущего положения животного
         */
        _currentPoint: {
            x: number,
            y: number
        };

        /**
         * Скорость движения
         * @type {ArgumentScale}
         */
        protected _speed: Animals.Scales.ArgumentScale;

        /**
         * Вес животного
         * @type {ArgumentScale}
         */
        protected _weight: Animals.Scales.ArgumentScale;

        /**
         * Constructor of Muscular
         * @param scales объект шкал
         */
        constructor(scales: any[]) {
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

        //!
        set currentPoint(param: any) {
            this._currentPoint.x = param.x;
            this._currentPoint.y = param.y;
        }

        get speed(): Animals.Scales.ArgumentScale {
            return this._speed;
        }

        get weight(): Animals.Scales.ArgumentScale {
            return this._weight;
        }

        //!
        get currentPoint(): any {
            return this._currentPoint;
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