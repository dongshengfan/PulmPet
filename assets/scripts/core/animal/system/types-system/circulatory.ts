/**
 * Created by FIRCorp on 24.02.2017.
 */
namespace Animal.System.TypeSystem {
    /**
     * Класс кровиностной системы
     */
    export class Circulatory implements ISystem {
        /**
         * Субъективное состояние
         * @type {SystemScale}
         */
        state: Animal.Scale.TypeScale.SystemScale;

        /**
         * Сердцебиение животного
         * @type {ArgumentScale}
         */
        protected _heartbeat: Animal.Scale.TypeScale.ArgumentScale;

        /**
         * Давление животного
         * @type {ArgumentScale}
         */
        protected _pressure: Animal.Scale.TypeScale.ArgumentScale;

        /**
         * Constructor of Muscular
         * @param scales объект шкалл
         */
        constructor(scales: any) {
            this.state = scales[Animal.Scale.Factory.ParameterScaleTypes.state];
            this.heartbeat = scales[Animal.Scale.Factory.ParameterScaleTypes.heartbeat];
            this.pressure = scales[Animal.Scale.Factory.ParameterScaleTypes.pressure];
        }

        set heartbeat(param: Animal.Scale.TypeScale.ArgumentScale) {
            this._heartbeat = param;
        }

        set pressure(param: Animal.Scale.TypeScale.ArgumentScale) {
            this._pressure = param;
        }

        get heartbeat(): Animal.Scale.TypeScale.ArgumentScale {
            return this._heartbeat;
        }

        get pressure(): Animal.Scale.TypeScale.ArgumentScale {
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