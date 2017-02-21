import ScaleTypes = Animal.Scale.Factory.ScaleTypes;
import IFunction = Animal.Function.IFunction;
/**
 * Created by FIRCorp on 19.02.2017.
 */



class Create {
    constructor() {

    }

    createFunctiorn(json: any): any {
        let factory = Animal.Function.Factory.FunctionFactory.instance();
        let {functions, params} =json;
        return factory.create(functions, params);
    }

    createScale(json: any): any {
        let factory = Animal.Scale.Factory.ScaleFactory.instance();
        let {typeScale, type, params}=json;
        params.type=type;
        return factory.create(typeScale, params);
    }

    getScaleId(type: any, scales: any[]):any {
        let sc: any;
        scales.forEach((item) => {
            if(item._type=== type){
            sc = item;
            }
        });
        return sc;
    }

    createCommunicator(json: any[], scales: any[]): any {
        let communicator = new Animal.Communication.Communicator();

        json.forEach((item: any) => {
            item.type;//тип параметра
            let scale: any;
            item.link.forEach((lin: any) => {
                scale = this.getScaleId(lin.type, scales);
                let {type, behavior, functions, params}=lin;
                let fun = this.createFunctiorn({functions, params});
                communicator.addLink(item.type, {scale,behavior,fun});
            });

        });
        return communicator;
    }

    createL(json: any): any {
        let systems=json.systems;
        let {scales, eventCommunication}=systems;
        //Создаю шкалы
        let masScale: any[] = [];
        scales.forEach((item: any) => {
            masScale.push(this.createScale(item));
        });

        return this.createCommunicator(eventCommunication, masScale);
    }
}

let lion:any = {
    systems: {
        scales: [
            {
                typeScale: Animal.Scale.Factory.ScaleTypes.argument,
                type: Animal.Communication.Factory.EventTypes.speed,
                params: {
                    name: 'State опорной',
                    current: 9,
                    min: 0,
                    max: 100,
                    responseDelay: 2,
                }
            },
            {
                typeScale: Animal.Scale.Factory.ScaleTypes.argument,
                type: Animal.Communication.Factory.EventTypes.weight,
                params: {
                    name: 'Вес',
                    current: 8,
                    min: 0,
                    max: 10,
                    responseDelay:4
                }
            }
        ],
        eventCommunication: [
            {
                type: Animal.Communication.Factory.EventTypes.speed,
                link: [
                    {
                        type: Animal.Communication.Factory.EventTypes.weight,
                        behavior: Animal.Communication.Factory.BehaviorScaleTypes.increase,
                        functions: Animal.Function.Factory.FunctionTypes.line,
                        params: [
                            0.5,
                            0.1
                        ]
                    }
                ],
            },
            {
                type: Animal.Communication.Factory.EventTypes.weight,
                link: [
                    {
                        type: Animal.Communication.Factory.EventTypes.speed,
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

let fa=new Create();
let _animal=fa.createL(lion);
console.log(_animal);