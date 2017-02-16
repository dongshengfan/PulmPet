import { Communicator } from './communicator';
import { SystemFunctionFactory } from '../../factories/system-function-factory';

/**
 * Класс-строитель коммуникации систем определенного животного
 * @export
 * @class EventSystemBuilder
 */
class EventSystemBuilder {

    /**
     * Коммуникатор общения между шкалами
     * @type {Communicator}
     * @memberOf EventSystemBuilder
     */
    _communicator;

    _factoryFunction;

    constructor() {
        this._communicator = new Communicator();
        this._factoryFunction = SystemFunctionFactory.instance();
    }

    /**
     *
     *
     * @param {CommunicationEvents} event
     * @param {Number} param
     * @returns {this}
     *
     * @memberOf EventSystemBuilder
     */
    add(event, param) {
        this._addLink(event, param);
        return this;
    }

    /**
     *
     *
     * @param {CommunicationEvents} event
     * @param {Number} params
     * @returns {this}
     *
     * @memberOf EventSystemBuilder
     */
    addAll(event, params) {
        params.forEach((param) => this._addLink(event, param));
        return this;
    }

    /**
     *
     *
     * @returns {Communicator}
     *
     * @memberOf EventSystemBuilder
     */
    build() {
        return this._communicator;
    }

    /**
     *
     *
     * @param {CommunicationEvents} event
     * @param {JSON} param
     *
     * @memberOf EventSystemBuilder
     */
    _addLink(event, param) {
        var {scale, type, functions, params} = param;
        this._factoryFunction.create(functions, params);
        this._communicator.register(event, {
            scale: scale,
            act: type,
            function: this._factoryFunction.create(functions, params)
        });
    }
}

export { EventSystemBuilder }