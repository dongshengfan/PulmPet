
/**
 * Created by FIRCorp on 02.05.2017.
 */

let lion2: any = {
    name: 'Лев2',
    systems: [
        {
            type: Animals.Systems.SystemTypes.muscular,
            scalesType: [
                {type: Animals.Scales.ParameterScaleTypes.speed},
                {type: Animals.Scales.ParameterScaleTypes.speed},
                {type: Animals.Scales.ParameterScaleTypes.weight}
            ],
        },
        {
            type: Animals.Systems.SystemTypes.circulatory,
            scalesType: [
                {type: Animals.Scales.ParameterScaleTypes.pressure},
                {type: Animals.Scales.ParameterScaleTypes.heartbeat}
            ],
        },
        {
            type: Animals.Systems.SystemTypes.navigation,
            scalesType: [
                {type: Animals.Scales.ParameterScaleTypes.speedSavvy},
                {type: Animals.Scales.ParameterScaleTypes.radiusVision},
                {type: Animals.Scales.ParameterScaleTypes.radiusSmell},
                {type: Animals.Scales.ParameterScaleTypes.radiusHearing},
                {type: Animals.Scales.ParameterScaleTypes.radiusTouch},
            ],
        }
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
        },
        {
            typeScale: Animals.Scales.ScaleTypes.argument,
            type: Animals.Scales.ParameterScaleTypes.speedSavvy,
            params: {
                name: 'Время смекалки',
                current: 8,
                min: 0,
                max: 10,
                responseDelay: 0.1
            }
        },
        {
            typeScale: Animals.Scales.ScaleTypes.argument,
            type: Animals.Scales.ParameterScaleTypes.radiusTouch,
            params: {
                name: 'Радиус осязания',
                current: 9,
                min: 0,
                max: 10,
                responseDelay: 0.1
            }
        },
        {
            typeScale: Animals.Scales.ScaleTypes.argument,
            type: Animals.Scales.ParameterScaleTypes.radiusVision,
            params: {
                name: 'Радиус зрения',
                current: 40,
                min: 0,
                max: 80,
                responseDelay: 0.1
            }
        },

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
    states: {
        state: [
            {
                name: 'Старт',
                type: StateMachines.TypesState.startLife,
                isEnd: false
            },
            {
                name: 'Бегу',
                type: StateMachines.TypesState.run,
                isEnd: false
            },
            {
                name: 'Стою',
                type: StateMachines.TypesState.stand,
                isEnd: false
            },
            {
                name: 'Умер',
                type: StateMachines.TypesState.die,
                isEnd: true
            }
        ],
        links: [
            {
                type: StateMachines.TypesState.startLife,
                link: [
                    {
                        type: StateMachines.TypesState.run,
                        probability: 0.7
                    },
                    {
                        type: StateMachines.TypesState.stand,
                        probability: 0.7
                    },
                    {
                        type: StateMachines.TypesState.die,
                        probability: 0.01
                    }
                ]
            },
            {
                type: StateMachines.TypesState.stand,
                link: [
                    {
                        type: StateMachines.TypesState.run,
                        probability: 0.7
                    },
                    {
                        type: StateMachines.TypesState.die,
                        probability: 0.01
                    }
                ]
            },
            {
                type: StateMachines.TypesState.run,
                link: [
                    {
                        type: StateMachines.TypesState.die,
                        probability: 0.6
                    },
                    {
                        type: StateMachines.TypesState.stand,
                        probability: 0.9
                    },
                    {
                        type: StateMachines.TypesState.run,
                        probability: 0.1
                    }
                ]
            }
        ]
    }
};
