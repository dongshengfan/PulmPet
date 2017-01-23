import { SystemFunctionFactory, SystemFunctionTypes } from '../system-functions/export-system-functions';
import { SystemScale } from './system-scale';

/**
 * 
 * @export
 * @class SystemScaleBuilder
 */
class SystemScaleBuilder { 
    /**
     * @type {SystemScale}
     * @memberOf SystemScaleBuilder
     */
    _scale;

    /**
     * @type {SystemFunctionFactory}
     * @memberOf SystemScaleBuilder
     */  
    _functionFactory;

    constructor(params) { 
        this._scale = new SystemScale(params);
        this._functionFactory = SystemFunctionFactory.instance();
    }

    addFunction(params) {
        var {type, params} = params;
        this._scale.addFunction(type, this._functionFactory.create(type, params));
        return this;
    }

    addAllFunctions(functions) { 
        functions.forEach((functionParam) => this.addFunction(functionParam));
        return this;
    }

    /**
     * 
     * @returns {SystemScale} 
     * @memberOf SystemScaleBuilder
     */
    build() { 
        return this._scale;
    }
}

export { SystemScaleBuilder }