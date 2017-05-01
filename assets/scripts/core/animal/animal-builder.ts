/**
 * Created by FIRCorp on 12.03.2017.
 */
namespace Animals {
    export class AnimalBuilder {
        /**
         *
         */
        static inst: AnimalBuilder;

        /**
         *
         */
        masScales: any[];

        /**
         *
         */
        masSystems: any[];

        /**
         *
         * @returns {AnimalBuilder}
         */
        static instance() {
            if (!this.inst) {
                this.inst = new AnimalBuilder();
            }
            return this.inst;
        }

        /**
         *
         * @param systems
         * @returns {Animals.AnimalBuilder}
         */
        createSystems(systems: any[]): AnimalBuilder {
            let factory = Animals.Systems.Factories.SystemFactory.instance();
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
         *
         * @param scales
         * @returns {Animals.AnimalBuilder}
         */
        createScales(scales: any[]): AnimalBuilder {
            let factory = Animals.Scales.Factories.ScaleFactory.instance();
            scales.forEach((item: any) => {
                let {typeScale, type, params}=item;
                params.type = type;
                this.masScales[type] = factory.create(typeScale, params);
            });
            return this;
        }

        /**
         *
         * @param communocation
         * @returns {Communicator}
         */
        createCommunicator(communocation: any[]): Animals.Communications.Communicator {
            let communicatorBuild = new Animals.Communications.Builders.CommunicatorBuilder(this.masScales);
            communocation.forEach((item: any) => {
                communicatorBuild.add(item);
            });
            return communicatorBuild.build();
        }

        /**
         *
         * @param model
         * @returns {Animals.Animal}
         */
        create(model: any): Animal {
            let {name, systems, scales, communication}=model;
            this.masScales = [];
            this.masSystems = [];
            let communicator = this.createScales(scales).createSystems(systems).createCommunicator(communication);
            let animal = new Animals.Animal(this.masSystems);
            animal.communicator = communicator;
            animal.name = name;
            return animal;
        }
    }
}