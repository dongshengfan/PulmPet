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
         * Имя животного
         */
        private _name: string;

        /**
         * Опорнодвигательная система
         */
        private _muscular: Animals.Systems.Muscular;

        /**
         * Кровиностная система
         */
        private _circulatory: Animals.Systems.Circulatory;

        /**
         * Навигационная система
         */
        private _navigation: Animals.Systems.Navigation;

        /**
         * Коммуникатор шкал
         */
        private _communicator: Animals.Communications.Communicator;

        /**
         *
         */
        private _stateMachine: StateMachines.StateMachine;

        /**
         * Constructor of Animal
         * @param params массив систем
         */
        constructor(params: any[]) {
            this.muscular = params[Animals.Systems.SystemTypes.muscular];
            this.circulatory = params[Animals.Systems.SystemTypes.circulatory];
            this.navigation = params[Animals.Systems.SystemTypes.navigation];
            //подписываем системы на этот класс

            this.muscular._linkToAnimal = this;
            this.circulatory._linkToAnimal = this;
            this.navigation._linkToAnimal = this;
        }

        set muscular(param: Animals.Systems.Muscular) {
            if (param) {
                this._muscular = param;
            }
        }

        set circulatory(param: Animals.Systems.Circulatory) {
            if (param) {
                this._circulatory = param;
            }
        }

        set navigation(param: Animals.Systems.Navigation) {
            if (param) {
                this._navigation = param;
            }
        }

        set communicator(param: Animals.Communications.Communicator) {
            this._communicator = param;
        }

        set stateMachine(param: StateMachines.StateMachine) {
            this._stateMachine = param;
        }

        set id(param: number) {
            this._id = param;
        }

        set name(param: string) {
            this._name = param;
        }


        get muscular(): Animals.Systems.Muscular {
            return this._muscular;
        }

        get circulatory(): Animals.Systems.Circulatory {
            return this._circulatory;
        }

        get navigation(): Animals.Systems.Navigation {
            return this._navigation;
        }

        get communicator(): Animals.Communications.Communicator {
            return this._communicator;
        }

        get stateMachine(): StateMachines.StateMachine {
            return this._stateMachine;
        }

        get id(): number {
            return this._id;
        }

        get name(): string {
            return this._name;
        }

        /**
         * Дает команду модели двигаться до точки
         * @param point тока назначения
         */
        public moveToPoint(point: cc.Vec2): void {
            //console.log(this._stateMachine);
        }

        public runLife(){
            console.log(this);
            this._stateMachine.run();
        }

        /**
         * Формирует и возвращает массив характеристик
         * @return {{name: string, currentState: string, param: Array}}
         */
        public getCharacteristics(): Object {
            let params: Array<Object> = [
                {
                    name: 'Скорость',
                    value: 89,
                    unit: 'м/с',
                },
                {
                    name: 'Возраст',
                    value: 12,
                    unit: 'лет',
                },
                {
                    name: 'Вес',
                    value: 12,
                    unit: 'кг',
                },
                {
                    name: 'Выносливость',
                    value: 12,
                    unit: 'ед.',
                },
                {
                    name: 'Система кровообращения',
                    value: 89,
                    unit: '%',
                },
                {
                    name: 'Система памяти',
                    value: 59,
                    unit: '%',
                },
                {
                    name: 'Система дыхания',
                    value: 89,
                    unit: '%',
                }
            ];

            return {
                name: this._name,
                currentState: 'Бегу',
                param: params,
            };
        }
    }
}