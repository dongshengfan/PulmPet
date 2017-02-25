/**
 * Created by FIRCorp on 24.02.2017.
 */
namespace Animals.Systems.TypeSystems {
    /**
     * Класс кровиностной системы
     */
    export class Circulatory implements ISystem {
        /**
         * Субъективное состояние
         * @type {SystemScale}
         */
        state: Animals.Scales.TypeScales.SystemScale;

        /**
         * Сердцебиение животного
         * @type {ArgumentScale}
         */
        protected _heartbeat: Animals.Scales.TypeScales.ArgumentScale;

        /**
         * Давление животного
         * @type {ArgumentScale}
         */
        protected _pressure: Animals.Scales.TypeScales.ArgumentScale;

        /**
         * Constructor of Muscular
         * @param scales объект шкалл
         */
        constructor(scales: any) {
            this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.TypeScales.SystemScale([]);
            ;
            this.heartbeat = scales[Animals.Scales.ParameterScaleTypes.heartbeat];
            this.pressure = scales[Animals.Scales.ParameterScaleTypes.pressure];
        }

        set heartbeat(param: Animals.Scales.TypeScales.ArgumentScale) {
            if (param) {
                this._heartbeat = param;
            }
        }

        set pressure(param: Animals.Scales.TypeScales.ArgumentScale) {
            if (param) {
                this._pressure = param;
            }
        }

        get heartbeat(): Animals.Scales.TypeScales.ArgumentScale {
            return this._heartbeat;
        }

        get pressure(): Animals.Scales.TypeScales.ArgumentScale {
            return this._pressure;
        }

        /**
         * Изменить сердцебиение на процент
         * @param delta дельта изменения
         */
        changeHeartbeat(delta: number) {
            this._heartbeat.change(delta);
            this.analysis();
        }

        /**
         * Изменить давление на процент
         * @param delta дельта изменения
         */
        changePressure(delta: number) {
            this._pressure.change(delta);
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