import { SystemFunctionTypes } from '../../../system-functions/export-system-functions';

/*********
 * Scales
 ********/
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
                coefficient: 22
            }
        }
    ]
};

const weight = {
    params: {},
    functions: [
        {
            type: SystemFunctionTypes.line,
            params: {
            }
        }
    ]
};

const pressure = {
    params: {},
    functions: [
        {
            type: SystemFunctionTypes.line,
            params: {
            }
        }
    ]
};

const heartbeat = {
    params: {},
    functions: [
        {
            type: SystemFunctionTypes.line,
            params: {
            }
        }
    ]
};

/*********
 * Systems
 ********/
const muscular = {
    scales: {
        speed: speed,
        weight: weight
    }
}

const circulatory = {
    scales: {
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