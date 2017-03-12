/**
 * Created by FIRCorp on 12.03.2017.
 */
namespace Animals.Systems.TypeSystems {
    /**
     * Класс навигационной системы
     */
    export class Navigation implements ISystem {
        /**
         * Субъективное состояние системы
         */
        state: Animals.Scales.TypeScales.SystemScale;

        /**
         * Скорость смекалки/реакции
         */
        protected _speedSavvy: Animals.Scales.TypeScales.ArgumentScale;

        /**
         * Радиус зрения
         */
        protected _radiusVision: Animals.Scales.TypeScales.ArgumentScale;

        /**
         * Радиус слуха
         */
        protected _radiusHearing: Animals.Scales.TypeScales.ArgumentScale;

        /**
         * Радиус обоняния
         */
        protected _radiusSmell: Animals.Scales.TypeScales.ArgumentScale;

        /**
         * Радиус осязания
         */
        protected _radiusTouch: Animals.Scales.TypeScales.ArgumentScale;

        /**
         * Constructor of Navigation
         * @param scales объект шкалл
         */
        constructor(scales: any[]) {
            this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.TypeScales.SystemScale([]);
            this.speedSavvy = scales[Animals.Scales.ParameterScaleTypes.speedSavvy];
            this.radiusHearing = scales[Animals.Scales.ParameterScaleTypes.radiusHearing];
            this.radiusSmell = scales[Animals.Scales.ParameterScaleTypes.radiusSmell];
            this.radiusVision = scales[Animals.Scales.ParameterScaleTypes.radiusVision];
            this.radiusTouch = scales[Animals.Scales.ParameterScaleTypes.radiusTouch];
        }

        set speedSavvy(param: Animals.Scales.TypeScales.ArgumentScale) {
            if (param) {
                this._speedSavvy = param;
            }
        }

        set radiusVision(param: Animals.Scales.TypeScales.ArgumentScale) {
            if (param) {
                this._radiusVision = param;
            }
        }

        set radiusHearing(param: Animals.Scales.TypeScales.ArgumentScale) {
            if (param) {
                this._radiusHearing = param;
            }
        }

        set radiusSmell(param: Animals.Scales.TypeScales.ArgumentScale) {
            if (param) {
                this._radiusSmell = param;
            }
        }

        set radiusTouch(param: Animals.Scales.TypeScales.ArgumentScale) {
            if (param) {
                this._radiusTouch = param;
            }
        }

        get speedSavvy(): Animals.Scales.TypeScales.ArgumentScale {
            return this._speedSavvy;
        }

        get radiusVision(): Animals.Scales.TypeScales.ArgumentScale {
            return this._radiusVision;
        }

        get radiusHearing(): Animals.Scales.TypeScales.ArgumentScale {
            return this._radiusHearing;
        }

        get radiusSmell(): Animals.Scales.TypeScales.ArgumentScale {
            return this._radiusSmell;
        }

        get radiusTouch(): Animals.Scales.TypeScales.ArgumentScale {
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