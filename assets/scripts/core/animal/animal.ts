/**
 * Created by FIRCorp on 25.02.2017.
 */
namespace Animals {
    /**
     * Класс животного
     */
    export class Animal {
        /**
         * Номер идентификации
         */
        private _id: number;

        /**
         * Опорнодвигательная система
         */
        private _muscular: Animals.Systems.TypeSystems.Muscular;

        /**
         * Кровиностная система
         */
        private _circulatory: Animals.Systems.TypeSystems.Circulatory;

        /**
         * Навигационная система
         */
        private _navigation: Animals.Systems.TypeSystems.Navigation;

        /**
         * Коммуникатор шкал
         */
        private _communicator: Animals.Communications.Communicator;

        /**
         * Constructor of Animal
         * @param params массив систем
         */
        constructor(params: any[]) {
            this.muscular = params[Animals.Systems.SystemTypes.muscular];
            this.circulatory = params[Animals.Systems.SystemTypes.circulatory];
            this.navigation = params[Animals.Systems.SystemTypes.navigation];
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

        set navigation(param: Animals.Systems.TypeSystems.Navigation) {
            if (param) {
                this._navigation = param;
            }
        }

        set communicator(param: Animals.Communications.Communicator) {
            this._communicator = param;
        }

        set id(param: number) {
            this._id = param;
        }

        get id() {
            return this._id;
        }

        /**
         * Дает команду модели двигаться до точки
         * @param point тока назначения
         */
        moveToPoint(point:cc.Vec2):void{

        }
    }
}