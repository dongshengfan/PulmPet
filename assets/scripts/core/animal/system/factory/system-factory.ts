    /**
 * Created by FIRCorp on 24.02.2017.
 */
namespace Animals.Systems {
    /**
     * Фабрика систем
     */
    export class SystemFactory {
        /**
         * Массив различных конструкторов систем
         * @type ISystem[]}
         */
        private _factories: any[];

        /**
         * Экземпляр этой фабрики
         * @type {SystemFactory}
         */
        private static _instance: SystemFactory;

        /**
         * Constructor of SystemFactory
         */
        constructor() {
            this._factories = [];
            this._factories[SystemTypes.muscular] = Animals.Systems.Muscular;
            this._factories[SystemTypes.circulatory] = Animals.Systems.Circulatory;
            this._factories[SystemTypes.navigation] = Animals.Systems.Navigation;
        }

        /**
         * Создание фабрики
         * @returns {SystemFactory}
         */
        static instance(): SystemFactory {
            if (!this._instance) {
                this._instance = new SystemFactory();
            }
            return this._instance;
        }

        /**
         * Добавление нового конструктора системы
         * @param type тип шкалы
         * @param system конструктор шкалы
         */
        add(type: SystemTypes, system: ISystem): void {
            this._factories[type] = system;
        }

        /**
         * Создание шкалы по типу
         * @param functionType тип шкалы
         * @param params параметры шкалы
         * @return {AScale}
         */
        create(functionType: SystemTypes, params: any): ISystem {
            return new this._factories[functionType](params);
        }
    }
}