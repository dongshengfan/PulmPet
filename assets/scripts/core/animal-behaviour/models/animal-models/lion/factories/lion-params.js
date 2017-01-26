import { SystemFunctionTypes } from '../../../system-functions/export-system-functions';

/*********
 * Scales
 ********/
const stateMuscular={
    params: {
        current: 100,
        min: 0,
        max: 100,
    },
    functions: [
        {
            type: SystemFunctionTypes.line,
            params: {
                coefficient: 2,
                free: 1
            }
        },
        {
            type: SystemFunctionTypes.quadratic,
            params: {
                coefficient: 2,
                free: 1
            }
        }
    ]
};

const speed = {
    params: {
        current: 5,
        min: 0,
        max: 10,
    },
    functions: [
        {
            type: SystemFunctionTypes.line,
            params: {
                coefficient: 2,
                free: 1
            }
        },
        {
            type: SystemFunctionTypes.quadratic,
            params: {
                coefficient: 2,
                free: 1
            }
        }
    ]
};

const weight = {
    params: {
        current: 5,
        min: 0,
        max: 10,
    },
    functions: [
        {
            type: SystemFunctionTypes.line,
            params: {
                coefficient: 2,
                free: 1
            }
        },
        {
            type: SystemFunctionTypes.quadratic,
            params: {
                coefficient: 2,
                free: 1
            }
        }
    ]
};

const stateCirculatory={
    params: {
        current: 100,
        min: 0,
        max: 100,
    },
    functions: [
        {
            type: SystemFunctionTypes.line,
            params: {
                coefficient: 2,
                free: 1
            }
        },
        {
            type: SystemFunctionTypes.quadratic,
            params: {
                coefficient: 2,
                free: 1
            }
        }
    ]
};
const pressure = {
    params: {
        current: 5,
        min: 0,
        max: 10,
    },
    functions: [
        {
            type: SystemFunctionTypes.line,
            params: {
                coefficient: 2,
                free: 1
            }
        },
        {
            type: SystemFunctionTypes.quadratic,
            params: {
                coefficient: 2,
                free: 1
            }
        }
    ]
};

const heartbeat = {
    params: {
        current: 5,
        min: 0,
        max: 10,
    },
    functions: [
        {
            type: SystemFunctionTypes.line,
            params: {
                coefficient: 2,
                free: 1
            }
        },
        {
            type: SystemFunctionTypes.quadratic,
            params: {
                coefficient: 2,
                free: 1
            }
        }
    ]
};

/*********
 * Systems
 ********/
const muscular = {
    scales: {
        state: stateMuscular,
        speed: speed,
        weight: weight
    }
}

const circulatory = {
    scales: {
        state: stateCirculatory,
        pressure: pressure,
        heartbeat: heartbeat
    }
}


/******
 * Params
 *****/
const params = {
    animal: {
    },
    systems: {
        muscular: muscular,
        circulatory: circulatory
    }
};

export { params as lionParams};