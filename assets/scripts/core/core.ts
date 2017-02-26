/**
 * Created by FIRCorp on 19.02.2017.
 */

class Create {
    constructor() {

    }

    createSystem(type: any, params: any[]): any {
        let factory = Animals.Systems.Factories.SystemFactory.instance();
        return factory.create(type, params);
    }

    createScale(json: any): any {
        let factory = Animals.Scales.Factories.ScaleFactory.instance();
        let {typeScale, type, params}=json;
        params.type = type;
        return factory.create(typeScale, params);
    }

    createCommunicator(json: any[], scales: any[]): any {
        let communicatorBuild = new Animals.Communications.Builders.CommunicatorBuilder(scales);
        json.forEach((item: any) => {
            communicatorBuild.add(item);
        });
        return communicatorBuild.build();
    }

    createL(json: any): any {
        let {systems, scales, communication}=json;
        //Создаю системы и Создаю шкалы
        let masScale: any[] = [];
        let masSystem: any[] = [];

        scales.forEach((item: any) => {
            masScale[item.type] = this.createScale(item);
        });

        systems.forEach((item: any) => {
            let mas: any[] = [];
            item.scalesType.forEach((sc: any) => {
                mas[sc.type] = masScale[sc.type];
            });
            masSystem[item.type] = this.createSystem(item.type, mas);
        });
        let com=this.createCommunicator(communication, masScale);
        console.log(masSystem);
        console.log(com);
        let animal=new Animals.Animal(masSystem);
        animal.communicator=com;
        console.log(animal);
        return animal;

    }
}

let lion: any = {
    systems: [
        {
            type: Animals.Systems.SystemTypes.muscular,
            scalesType: [
                {type: Animals.Scales.ParameterScaleTypes.speed},
                {type: Animals.Scales.ParameterScaleTypes.speed},
                {type:Animals.Scales.ParameterScaleTypes.weight}
            ],
        },
       /* {
            type: Animals.Systems.Factorys.SystemTypes.circulatory,
            scalesType: [
                {type: Animals.Scales.Factorys.ParameterScaleTypes.pressure},
                {type:Animals.Scales.Factorys.ParameterScaleTypes.heartbeat}
            ],
        }*/
    ],
    scales: [
        {
            typeScale: Animals.Scales.ScaleTypes.argument,
            type: Animals.Scales.ParameterScaleTypes.heartbeat,
            params: {
                name: 'Сердцебиение',
                current: 9,
                min: 0,
                max: 100,
                responseDelay: 0.12,
            }
        },
        {
            typeScale: Animals.Scales.ScaleTypes.argument,
            type: Animals.Scales.ParameterScaleTypes.pressure,
            params: {
                name: 'Давление',
                current: 8,
                min: 0,
                max: 10,
                responseDelay: 0.13
            }
        },
        {
            typeScale: Animals.Scales.ScaleTypes.argument,
            type: Animals.Scales.ParameterScaleTypes.speed,
            params: {
                name: 'Скорость',
                current: 9,
                min: 0,
                max: 100,
                responseDelay: 0.12,
            }
        },
        {
            typeScale: Animals.Scales.ScaleTypes.argument,
            type: Animals.Scales.ParameterScaleTypes.weight,
            params: {
                name: 'Вес',
                current: 8,
                min: 0,
                max: 10,
                responseDelay: 0.1
            }
        }
    ],
    communication: [
        {
            type: Animals.Scales.ParameterScaleTypes.speed,
            link: [
                {
                    type: Animals.Scales.ParameterScaleTypes.weight,
                    behavior: Animals.Communications.BehaviorScaleTypes.increase,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.18
                    ]
                }
            ],
        },
        {
            type: Animals.Scales.ParameterScaleTypes.weight,
            link: [
                {
                    type: Animals.Scales.ParameterScaleTypes.speed,
                    behavior: Animals.Communications.BehaviorScaleTypes.decrease,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.1
                    ]
                }
            ],
        }
    ],
};

let fa = new Create();
let _animal = fa.createL(lion);
/*
_animal.publish({
    behavior: Animals.Communications.Factorys.BehaviorScaleTypes.increase,
    type: Animals.Scales.Factorys.ParameterScaleTypes.speed
}, 0.8);*/