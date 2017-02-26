/**
 * Created by FIRCorp on 22.02.2017.
 */
namespace Animals.Communications.Builders {
    /**
     * Строитель коммуникатора
     */
    export class CommunicatorBuilder implements IBuilder {
        /**
         * Коммуникатор
         * @type {Communicator}
         */
        private _communicator: Communicator;

        /**
         * Массив шкал этого животного
         * @type {AScale[]}
         */
        private _scales: Animals.Scales.AScale[];

        /**
         * Фабрика функций
         * @type {FunctionFactory}
         */
        private _factoryFunction: Animals.Functions.Factories.FunctionFactory;

        /**
         * Constructor of CommunicatorBuilder
         * @param scales {AScale[]}
         */
        constructor(scales: Animals.Scales.AScale[]) {
            this._scales = scales;
            this._communicator = new Communicator();
            this._factoryFunction = Animals.Functions.Factories.FunctionFactory.instance();
        }

        /**
         * Обработка и подготовка новых подписчиков
         * @param param объект с событием
         * @returns {CommunicatorBuilder}
         */
        add(param: any): CommunicatorBuilder {
            param.link.forEach((communication: any) => {
                let {type, behavior, functions, params}=communication;
                let scale: any = this._scales[type];
                let fun = this._createFunction(functions, params);
                this._communicator.addLink(param.type, {scale, behavior, fun});
                scale.communicator = this._communicator;
            });
            return this;
        }

        /**
         * Возвращает коммуникатор
         * @returns {Communicator}
         */
        build(): Communicator {
            return this._communicator;
        }

        /**
         * Создает функцию по типу и параметрам
         * @param type тип функции
         * @param params массив параметров функции
         * @returns {IFunction}
         * @private
         */
        private _createFunction(type: Animals.Functions.FunctionTypes, params: any[]): Animals.Functions.IFunction {
            return this._factoryFunction.create(type, params);
        }
    }
}