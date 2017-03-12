/**
 * Created by FIRCorp on 12.03.2017.
 */

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
