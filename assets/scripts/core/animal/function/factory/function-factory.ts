/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animals.Functions.Factories {
    /**
     * Фабрика функций
     */
    export class FunctionFactory {
        /**
         * Массив различных конструкторов функций
         * @type {IFunction[]}
         */
        private _factories: any[];

        /**
         * Экземпляр этой фабрики
         * @type {FunctionFactory}
         */
        private static _instance: FunctionFactory;

        /**
         * Constructor of FunctionFactory
         */
        constructor() {
            this._factories = [];
            this._factories[FunctionTypes.line] = Animals.Functions.TypeFunctions.LineFunction;
            this._factories[FunctionTypes.quadratic] = Animals.Functions.TypeFunctions.QuadraticFunction;
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
        add(type: FunctionTypes, system: IFunction): void {
            this._factories[type] = system;
        }

        /**
         * Создание функции по типу
         * @param functionType тип функции
         * @param params параметры функции
         * @return {IFunction}
         */
        create(functionType: FunctionTypes, params: any[]): IFunction {
            return new this._factories[functionType](params);
        }
    }
}