/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animal.Function.Factory {
    /**
     * Фабрика функций
     */
    export class FunctionFactory {
        /**
         * Массив различных конструкторов функций
         * @type {Array<IFunction>}
         */
        _factories: any[];

        /**
         * Экземпляр этой фабрики
         * @type {FunctionFactory}
         */
        static _instance: FunctionFactory;

        /**
         * Constructor of FunctionFactory
         */
        constructor() {
            this._factories = [];
            this._factories[FunctionTypes.line] = LineFunction;
            this._factories[FunctionTypes.quadratic] = QuadraticFunction;
        }

        /**
         * Создание фабрики
         * @returns {FunctionFactory}
         */
        static instance(): FunctionFactory {
            if (!this._instance) {
                this._instance = new FunctionFactory();
            }
            return this._instance;
        }

        /**
         * Добавление нового конструктора функции
         * @param type тип функции
         * @param system конструктор функции
         */
        add(type: FunctionTypes, system: any): void {
            this._factories[type] = system;
        }

        /**
         * Создание функции по типу
         * @param functionType тип функции
         * @param params параметры функции
         */
        create(functionType: FunctionTypes, params: any): any {
            return new this._factories[functionType](params);
        }
    }
}