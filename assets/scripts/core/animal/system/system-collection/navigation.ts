/**
 * Created by FIRCorp on 12.03.2017.
 */
namespace Animals.Systems {
    /**
     * Класс навигационной системы. Отвечает за ориентацию животного в пространстве. Поиск пути.
     */
    export class Navigation implements ISystem {
        /**
         * Субъективное состояние системы
         */
        state: Animals.Scales.SystemScale;

        /**
         * Ссылка на класс животного
         * @type {Animal}
         */
        _linkToAnimal: Animals.Animal;

        /**
         * Скорость смекалки/реакции
         */
        protected _speedSavvy: Animals.Scales.ArgumentScale;

        /**
         * Радиус зрения
         */
        protected _radiusVision: Animals.Scales.ArgumentScale;

        /**
         * Радиус слуха
         */
        protected _radiusHearing: Animals.Scales.ArgumentScale;

        /**
         * Радиус обоняния
         */
        protected _radiusSmell: Animals.Scales.ArgumentScale;

        /**
         * Радиус осязания
         */
        protected _radiusTouch: Animals.Scales.ArgumentScale;

        /**
         * Constructor of Navigation
         * @param scales объект шкалл
         */
        constructor(scales: any[]) {
            this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);

            this.speedSavvy = scales[Animals.Scales.ParameterScaleTypes.speedSavvy];
            this.radiusHearing = scales[Animals.Scales.ParameterScaleTypes.radiusHearing];
            this.radiusSmell = scales[Animals.Scales.ParameterScaleTypes.radiusSmell];
            this.radiusVision = scales[Animals.Scales.ParameterScaleTypes.radiusVision];
            this.radiusTouch = scales[Animals.Scales.ParameterScaleTypes.radiusTouch];
        }

        set speedSavvy(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._speedSavvy = param;
            }
        }

        set radiusVision(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._radiusVision = param;
            }
        }

        set radiusHearing(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._radiusHearing = param;
            }
        }

        set radiusSmell(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._radiusSmell = param;
            }
        }

        set radiusTouch(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._radiusTouch = param;
            }
        }

        get speedSavvy(): Animals.Scales.ArgumentScale {
            return this._speedSavvy;
        }

        get radiusVision(): Animals.Scales.ArgumentScale {
            return this._radiusVision;
        }

        get radiusHearing(): Animals.Scales.ArgumentScale {
            return this._radiusHearing;
        }

        get radiusSmell(): Animals.Scales.ArgumentScale {
            return this._radiusSmell;
        }

        get radiusTouch(): Animals.Scales.ArgumentScale {
            return this._radiusTouch;
        }


        /**
         * Изменить скорость смекалки  на процент
         * @param delta дельта изменения
         */
        changeSpeedSavvy(delta: number): void {
            this._speedSavvy.change(delta);
            this.analysis();
        }

        /**
         * Изменить радиус зрения на процент
         * @param delta дельта изменения
         */
        changeRadiusVision(delta: number): void {
            this._radiusVision.change(delta);
            this.analysis();
        }

        /**
         * Изменить радиус слуха на процент
         * @param delta дельта изменения
         */
        changeRadiusHearing(delta: number): void {
            this._radiusHearing.change(delta);
            this.analysis();
        }

        /**
         * Изменить радиус обоняния на процент
         * @param delta дельта изменения
         */
        changeRadiusSmell(delta: number): void {
            this._radiusSmell.change(delta);
            this.analysis();
        }

        /**
         * Изменить радиус осязания на процент
         * @param delta дельта изменения
         */
        changeRadiusTouch(delta: number): void {
            this._radiusTouch.change(delta);
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