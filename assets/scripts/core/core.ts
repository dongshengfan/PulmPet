/**
 * Created by FIRCorp on 19.02.2017.
 */

class Create {
    constructor() {

    }

    createScale(json: any): any {
        let factory = Animal.Scale.Factory.ScaleFactory.instance();
        let {typeScale, type, params}=json;
        params.type = type;
        return factory.create(typeScale, params);
    }

    createCommunicator(json: any[], scales: any[]): any {
        let communicatorBuild = new Animal.Communication.Factory.CommunicatorBuilder(scales);
        json.forEach((item: any) => {
            communicatorBuild.add(item);
        });
        return communicatorBuild.build();
    }

    createL(json: any): any {
        let systems = json.systems;
        let {scales, eventCommunication}=systems;
        //Создаю шкалы
        let masScale: any[] = [];
        scales.forEach((item: any) => {
            masScale.push(this.createScale(item));
        });

        return this.createCommunicator(eventCommunication, masScale);
    }
}

let lion: any = {
    systems: {
        scales: [
            {
                typeScale: Animal.Scale.Factory.ScaleTypes.argument,
                type: Animal.Communication.Factory.ParameterScaleTypes.speed,
                params: {
                    name: 'State опорной',
                    current: 9,
                    min: 0,
                    max: 100,
                    responseDelay: 0.12,
                }
            },
            {
                typeScale: Animal.Scale.Factory.ScaleTypes.argument,
                type: Animal.Communication.Factory.ParameterScaleTypes.weight,
                params: {
                    name: 'Вес',
                    current: 8,
                    min: 0,
                    max: 10,
                    responseDelay: 0.1
                }
            }
        ],
        eventCommunication: [
            {
                type: Animal.Communication.Factory.ParameterScaleTypes.speed,
                link: [
                    {
                        type: Animal.Communication.Factory.ParameterScaleTypes.weight,
                        behavior: Animal.Communication.Factory.BehaviorScaleTypes.increase,
                        functions: Animal.Function.Factory.FunctionTypes.line,
                        params: [
                            0.5,
                            0.18
                        ]
                    }
                ],
            },
            {
                type: Animal.Communication.Factory.ParameterScaleTypes.weight,
                link: [
                    {
                        type: Animal.Communication.Factory.ParameterScaleTypes.speed,
                        behavior: Animal.Communication.Factory.BehaviorScaleTypes.decrease,
                        functions: Animal.Function.Factory.FunctionTypes.line,
                        params: [
                            0.5,
                            0.1
                        ]
                    }
                ],
            }
        ],
    }
};

let fa = new Create();
let _animal = fa.createL(lion);
console.log(_animal);
_animal.publish({
    behavior: Animal.Communication.Factory.BehaviorScaleTypes.increase,
    type: Animal.Communication.Factory.ParameterScaleTypes.speed
}, 0.8);