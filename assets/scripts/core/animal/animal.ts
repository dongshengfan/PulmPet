/**
 * Created by FIRCorp on 25.02.2017.
 */
namespace Animals {
    /**
     * Класс животного
     */
    export class Animal {
        /**
         * Опорнодвигательная система
         */
        private _muscular: Animals.Systems.TypeSystems.Muscular;

        /**
         * Кровиностная система
         */
        private _circulatory: Animals.Systems.TypeSystems.Circulatory;

        /**
         * Коммуникатор шкал
         */
        private _communicator: Animals.Communications.Communicator;

        /**
         * Constructor of Animal
         * @param params массив систем
         */
        constructor(params: any[]) {
            this.muscular = params[Animals.Systems.Factorys.SystemTypes.muscular];
            this.circulatory = params[Animals.Systems.Factorys.SystemTypes.circulatory];
        }

        set muscular(param: Animals.Systems.TypeSystems.Muscular) {
            if (param) {
                this._muscular = param;
            }
        }

        set circulatory(param: Animals.Systems.TypeSystems.Circulatory) {
            if (param) {
                this._circulatory = param;
            }
        }

        set communicator(param: Animals.Communications.Communicator) {
            this._communicator = param;
        }
    }
}