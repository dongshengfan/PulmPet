/**
 * Created by FIRCorp on 22.02.2017.
 */
namespace Animal.Communication.Factory {
    /**
     * Строитель коммуникатора
     */
    export class CommunicatorBuilder {
        /**
         * Коммуникатор
         * @type {Communicator}
         */
        private _communicator: Communicator;

        /**
         * Массив шкал этого животного
         * @type {AScale[]}
         */
        private _scales: Animal.Scale.AScale[];

        /**
         * Фабрика функций
         * @type {FunctionFactory}
         */
        private _factoryFunction: Animal.Function.Factory.FunctionFactory;

        /**
         * Constructor of CommunicatorBuilder
         * @param scales {AScale[]}
         */
        constructor(scales: Animal.Scale.AScale[]) {
            this._scales = scales;
            this._communicator = new Communicator();
            this._factoryFunction = Animal.Function.Factory.FunctionFactory.instance();
        }

        /**
         * Обработка и подготовка новых подписчиков
         * @param param объект с событием
         * @returns {Animal.Communication.Factory.CommunicatorBuilder}
         */
        add(param: any): CommunicatorBuilder {
            param.link.forEach((communication: any) => {
                let {type, behavior, functions, params}=communication;
                let scale = this._getScale(type);
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
         * Ищет шкалу в массиве шкал для коммуникатора по типу
         * @param type тип шкалы ддя поиска
         * @returns {Animal.Scale.AScale} щкала
         * @private
         */
        private _getScale(type: ParameterScaleTypes): any {
            let scale: Animal.Scale.AScale;
            this._scales.forEach((item: any) => {
                if (item.type === type) {
                    scale = item;
                }
            });
            return scale;
        }

        /**
         * Создает функцию по типу и параметрам
         * @param type тип функции
         * @param params массив параметров функции
         * @returns {IFunction}
         * @private
         */
        private _createFunction(type: Animal.Function.Factory.FunctionTypes, params: any[]): Animal.Function.IFunction {
            return this._factoryFunction.create(type, params);
        }
    }
}