/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animals.Functions {
    /**
     * Фабрика функций
     */
    export class FunctionFactory {
        /**
         * Массив различных конструкторов функций
         * @type {Array<IFunctionConstructor>}
         */
        private _factories: IFunctionConstructor[];

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
        public add(type: FunctionTypes, system: IFunctionConstructor): void {
            this._factories[type] = system;
        }

        /**
         * Создание функции по типу
         * @param functionType тип функции
         * @param params параметры функции
         * @return {IFunction}
         */
        public create(functionType: FunctionTypes, params: number[]): IFunction {
            return new this._factories[functionType](params);
        }
    }
}