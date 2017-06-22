/**
 * Created by FIRCorp on 12.03.2017.
 */
namespace Animals {

    /**
     * Строитель моделей животного
     */
    export class AnimalBuilder {

        /**
         * экземпляр данного класса
         */
        static inst: AnimalBuilder;

        /**
         * временный массив шкалл
         */
        private masScales: any[];

        /**
         * Временный массив систем
         */
        private masSystems: any[];

        /**
         * Животное которое стоится
         */
        private _animal: Animal;

        /**
         * Инициализирует строителя
         * @returns {AnimalBuilder}
         */
        public static instance() {
            if (!this.inst) {
                this.inst = new AnimalBuilder();
            }
            return this.inst;
        }

        /**
         * Создает системы
         * @param systems массив типов систем
         * @returns {Animals.AnimalBuilder}
         */
        private createSystems(systems: any[]): AnimalBuilder {
            let factory = Animals.Systems.SystemFactory.instance();
            let mas: any[] = [];
            systems.forEach((item: any) => {
                mas = [];
                item.scalesType.forEach((sc: any) => {
                    mas[sc.type] = this.masScales[sc.type];
                });
                this.masSystems[item.type] = factory.create(item.type, mas);
            });
            return this;
        }

        /**
         * Создает шкалы
         * @param scales массив типов шкал
         * @returns {Animals.AnimalBuilder}
         */
        private createScales(scales: any[]): AnimalBuilder {
            let factory = Animals.Scales.ScaleFactory.instance();
            scales.forEach((item: any) => {
                let {typeScale, type, params}=item;
                params.type = type;
                this.masScales[type] = factory.create(typeScale, params);
            });
            return this;
        }

        /**
         * Создает коммуникатор
         * @param communocation ммассив настройки коммуникатора
         * @returns {Communicator}
         */
        private createCommunicator(communocation: any[]): Animals.Communications.Communicator {
            let communicatorBuild = new Animals.Communications.CommunicatorBuilder(this.masScales);
            communocation.forEach((item: any) => {
                communicatorBuild.add(item);
            });
            return communicatorBuild.build();
        }

        /**
         * Создает состояния
         * @param states массив настройки состояний
         * @returns {StateMachines.StateMachine}
         */
        private createStates(states: any): StateMachines.StateMachine {
            let factory = StateMachines.StateFactory.instance();
            let paramState: any[] = [];
            let {state, links}=states;
            state.forEach((item: any) => {
                paramState[item.type] = factory.create(item.type, item.name, this._animal, item.isEnd);
            });

            links.forEach((item: any) => {
                let massStates: any[] = [];
                item.link.forEach((state: any) => {
                    massStates.push(new StateMachines.Routes.Route(paramState[state.type], (model: Animal, probability: number) => {
                        if (state.probability > probability) {
                            return true;
                        }
                        return false;

                    }));
                });
                paramState[item.type].setRouteEngine(new StateMachines.Routes.ProbabilityRouteEngine(massStates));
            });

            return new StateMachines.StateMachine(paramState[StateMachines.TypesState.startLife]);
        }

        /**
         * Создает животное
         * @param model json настройки будущей модели
         * @returns {Animals.Animal}
         */
        public create(model: any): Animal {
            let {name, systems, scales, communication, states}=model;
            this.masScales = [];
            this.masSystems = [];
            let communicator = this.createScales(scales).createSystems(systems).createCommunicator(communication);
            this._animal = new Animals.Animal(this.masSystems);
            this._animal.name = name;
            this._animal.stateMachine = this.createStates(states);
            this._animal.communicator = communicator;
            return this._animal;
        }
    }
}
