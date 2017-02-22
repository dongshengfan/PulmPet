/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animal.Scale.Factory {
    /**
     * Фабрика шкал
     */
    export class ScaleFactory {
        /**
         * Массив различных конструкторов шкал
         * @type {AScale[]}
         */
        private _factories: any[];

        /**
         * Экземпляр этой фабрики
         * @type {ScaleFactory}
         */
        private static _instance: ScaleFactory;

        /**
         * Constructor of ScaleFactory
         */
        constructor() {
            this._factories = [];
            this._factories[ScaleTypes.system] = SystemScale;
            this._factories[ScaleTypes.argument] = ArgumentScale;
        }

        /**
         * Создание фабрики
         * @returns {ScaleFactory}
         */
        static instance(): ScaleFactory {
            if (!this._instance) {
                this._instance = new ScaleFactory();
            }
            return this._instance;
        }

        /**
         * Добавление нового конструктора шкалы
         * @param type тип шкалы
         * @param system конструктор шкалы
         */
        add(type: ScaleTypes, system: any): void {
            this._factories[type] = system;
        }

        /**
         * Создание шкалы по типу
         * @param functionType тип шкалы
         * @param params параметры шкалы
         * @return {AScale}
         */
        create(functionType: ScaleTypes, params: any): AScale {
            return new this._factories[functionType](params);
        }
    }
}