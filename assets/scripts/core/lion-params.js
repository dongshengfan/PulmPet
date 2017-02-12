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
    systems: {
        system: [
            {
                type: SystemTypes.muscular,
                scales: [
                    {
                        typeScale: ScalesTypes.stateSystem,
                        param: {
                            current: 9,
                            min: 0,
                            max: 100
                        }
                    },
                    {
                        typeScale: ScalesTypes.weight,
                        param: {
                            current: 8,
                            min: 0,
                            max: 10
                        }
                    },
                    {
                        typeScale: ScalesTypes.speed,
                        param: {
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
                        typeScale: ScalesTypes.stateSystem,
                        param: {
                            current: 9,
                            min: 0,
                            max: 100
                        }
                    },
                    {
                        typeScale: ScalesTypes.pressure,
                        param: {
                            current: 9,
                            min: 0,
                            max: 100
                        }
                    },
                    {
                        typeScale: ScalesTypes.heartbeat,
                        param: {
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
                            coefficient: 2,
                            free: 0
                        }
                    },
                    {
                        scale: ScalesTypes.pressure,
                        type: ActTypes.also,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 2,
                            free: 0
                        }
                    },
                    {
                        scale: ScalesTypes.weight,
                        type: ActTypes.opposite,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 2,
                            free: 0
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
                            coefficient: 2,
                            free: 0
                        }
                    },
                    {
                        scale: ScalesTypes.pressure,
                        type: ActTypes.also,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 2,
                            free: 0
                        }
                    },
                    {
                        scale: ScalesTypes.weight,
                        type: ActTypes.opposite,
                        functions: SystemFunctionTypes.line,
                        params: {
                            coefficient: 2,
                            free: 0
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
                        probability: 0.04
                    },
                    {
                        type: StateTypes.run,
                        probability: 0.01
                    },
                    {
                        type: StateTypes.die,
                        probability: 0.9
                    }
                ]
            },
            {
                type: StateTypes.go,
                link: [
                    {
                        type: StateTypes.run,
                        probability: 0.03
                    },
                    {
                        type: StateTypes.go,
                        probability: 0.07
                    },
                    {
                        type: StateTypes.die,
                        probability: 0.99
                    }
                ]
            },
            {
                type: StateTypes.run,
                link: [
                    {
                        type: StateTypes.die,
                        probability: 0.0002
                    },
                    {
                        type: StateTypes.go,
                        probability: 0.99
                    },
                    {
                        type: StateTypes.run,
                        probability: 0.0001
                    }
                ]
            }
        ]
    }
};

export { params as lionParams };