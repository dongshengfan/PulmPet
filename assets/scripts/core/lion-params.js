import {
    SystemFunctionTypes,
    SystemTypes,
    ScalesTypes,
    ActTypes,
    CommunicationEvents as Event,
    StateTypes
} from './animal-behaviour/export-animal-behaviour';


/******
 * Params
 *****/
const params = {
    sensitivitySystem:0.01,
    timeLive:4,
    systems: {
        system: [
            {
                type: SystemTypes.muscular,
                scales: [
                    {
                        typeScale: ScalesTypes.stateSystemMuscular,
                        param: {
                            name:'State опорной',
                            current: 9,
                            min: 0,
                            max: 100
                        }
                    },
                    {
                        typeScale: ScalesTypes.weight,
                        param: {
                            name:'Вес',
                            current: 8,
                            min: 0,
                            max: 10
                        }
                    },
                    {
                        typeScale: ScalesTypes.speed,
                        param: {
                            name:'Скорость',
                            current: 1,
                            min: 1,
                            max: 10
                        }
                    }
                ]
            },
            {
                type: SystemTypes.circulatory,
                scales: [
                    {
                        typeScale: ScalesTypes.stateSystemCirculatory,
                        param: {
                            name:'State кровиностной ',
                            current: 9,
                            min: 0,
                            max: 100
                        }
                    },
                    {
                        typeScale: ScalesTypes.pressure,
                        param: {
                            name:'Давление',
                            current: 9,
                            min: 0,
                            max: 100
                        }
                    },
                    {
                        typeScale: ScalesTypes.heartbeat,
                        param: {
                            name:'Сердцебиение',
                            current: 9,
                            min: 0,
                            max: 100
                        }
                    }
                ]
            }
        ],
        eventCommunication: [
            {
                type: Event.speed.increase,
                link: [
                    {
                        scale: ScalesTypes.heartbeat,
                        type: ActTypes.also,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 0.5,
                            free: 0.1
                        }
                    },
                    {
                        scale: ScalesTypes.pressure,
                        type: ActTypes.also,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 0.5,
                            free: 0.1
                        }
                    },
                    {
                        scale: ScalesTypes.weight,
                        type: ActTypes.opposite,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 0.5,
                            free: 0.1
                        }
                    }
                ],

            },
            {
                type: Event.speed.decrease,
                link: [
                    {
                        scale: ScalesTypes.heartbeat,
                        type: ActTypes.also,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 0.5,
                            free: 0
                        }
                    },
                    {
                        scale: ScalesTypes.pressure,
                        type: ActTypes.also,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 0.5,
                            free: 0
                        }
                    },
                    {
                        scale: ScalesTypes.weight,
                        type: ActTypes.opposite,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 0.5,
                            free: 0
                        }
                    }
                ],
            },
            {
                type: Event.pressure.increase,
                link: [
                    {
                        scale: ScalesTypes.heartbeat,
                        type: ActTypes.opposite,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 0.05,
                            free: 0
                        }
                    },
                    {
                        scale: ScalesTypes.speed,
                        type: ActTypes.opposite,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 0.05,
                            free: -0.1
                        }
                    }
                ],
            }

        ],
    },
    states: {
        state: [
            {
                type: StateTypes.start,
                isEnd: false
            },
            {
                type: StateTypes.go,
                isEnd: false
            },
            {
                type: StateTypes.run,
                isEnd: false
            },
            {
                type: StateTypes.die,
                isEnd: true
            }
        ],
        links: [
            {
                type: StateTypes.start,
                link: [
                    {
                        type: StateTypes.go,
                        probability: 0.5
                    },
                    {
                        type: StateTypes.run,
                        probability: 0.7
                    },
                    {
                        type: StateTypes.die,
                        probability: 0.01
                    }
                ]
            },
            {
                type: StateTypes.go,
                link: [
                    {
                        type: StateTypes.run,
                        probability: 0.3
                    },
                    {
                        type: StateTypes.go,
                        probability: 0.3
                    },
                    {
                        type: StateTypes.die,
                        probability: 0.3
                    }
                ]
            },
            {
                type: StateTypes.run,
                link: [
                    {
                        type: StateTypes.die,
                        probability: 0.6
                    },
                    {
                        type: StateTypes.go,
                        probability: 0.9
                    },
                    {
                        type: StateTypes.run,
                        probability: 0.1
                    }
                ]
            }
        ]
    }
};

export { params as lionParams };