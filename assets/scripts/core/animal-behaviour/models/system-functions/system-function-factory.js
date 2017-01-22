import { LineSystemFunction } from './line-system-function';

const SystemFactoryTypes = {
    line: 0
}

class SystemFunctionFactory {
    _factories;

    constructor() { 
        this._factories = {};
        this._factories[SystemFactoryTypes.line] = LineSystemFunction
    }

    create(systemFactoryType, params) { 
        return new this._factories[systemFactoryType](params);
    }
}

export { SystemFactoryTypes, SystemFunctionFactory }