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
            this.navigation = null;
            this.muscular = null;
            this.circulatory = null;

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

        public runLife() {
            console.log(this);
            this._stateMachine.run();
        }

        /**
         * СОпрашивает шкалу сцелью формирования объекта для отображения статистики
         * @param scale шкала
         * @param unit именование единиц измерения
         * @returns {{name: string, value: number, unit: string}}
         * @private
         */
        _getParam(scale: Animals.Scales.AScale, unit: string): any {
            return {
                name: scale.name,
                value: scale.current,
                unit: unit,
            }
        }

        /**
         * Формирует и возвращает массив характеристик
         * @return {{name: string, currentState: string, param: Array}}
         */
        public getCharacteristics(): Object {

            let params: any = [];
            if (this.circulatory != null) {
                if (this.circulatory.heartbeat != null) {
                    params.push(this._getParam(this.circulatory.heartbeat, 'уд'));
                }
                if (this.circulatory.pressure != null) {
                    params.push(this._getParam(this.circulatory.pressure, ''));
                }
                if (this.circulatory.state != null) {
                    params.push(this._getParam(this.circulatory.state, '%'));
                }
            }
            if (this.muscular != null) {
                if (this.muscular.speed != null) {
                    params.push(this._getParam(this.muscular.speed, 'm/c'));
                }
                if (this.muscular.weight != null) {
                    params.push(this._getParam(this.muscular.weight, 'kg'));
                }
                if (this.muscular.state != null) {
                    params.push(this._getParam(this.muscular.state, '%'));
                }
            }
            if (this.navigation != null) {
                if (this.navigation.state != null) {
                    params.push(this._getParam(this.navigation.state, '%'));
                }
                if (this.navigation.radiusVision != null) {
                    params.push(this._getParam(this.navigation.radiusVision, 'ед'));
                }
                if (this.navigation.radiusSmell != null) {
                    params.push(this._getParam(this.navigation.radiusSmell, 'ед'));
                }
                if (this.navigation.radiusTouch != null) {
                    params.push(this._getParam(this.navigation.radiusTouch, 'ед'));
                }
                if (this.navigation.radiusHearing != null) {
                    params.push(this._getParam(this.navigation.radiusHearing, 'ед'));
                }
                if (this.navigation.speedSavvy != null) {
                    params.push(this._getParam(this.navigation.speedSavvy, 'ед'));
                }
            }

            return {
                name: this._name,
                currentState: this.stateMachine._state.getName(),
                param: params,
            };
        }

        /**
         * Устанавливает позицию модели животного
         * @param x по оси абсцисс
         * @param y по оси ординат
         */
        public setPointStart(x: number, y: number) {
            if (this.navigation != null) {
                this.navigation._currentPoint.x = x;
                this.navigation._currentPoint.y = y;
            }
        }
    }
}