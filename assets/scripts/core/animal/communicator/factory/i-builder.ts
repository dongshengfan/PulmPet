/**
 * Created by FIRCorp on 24.02.2017.
 */
namespace Animal.Communication.Factory {
    export interface IBuilder {
        /**
         * Какое-либо действие
         * @param param объект с событием
         * @returns {IBuilder}
         */
        add(param: any): IBuilder;

        /**
         * Возвращает готовый продукт
         */
        build(): any;
    }
}