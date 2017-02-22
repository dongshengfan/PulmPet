/**
 * Created by FIRCorp on 22.02.2017.
 */
namespace Animal.Communication.Factory {
    /**
     * Строитель коммуникатора
     */
    export class CommunicatorBuilder {

        _communicator: Communicator;

        _scales: Animal.Scale.AScale[];

        _factoryFunction: Animal.Function.Factory.FunctionFactory;

        constructor(scales: Animal.Scale.AScale[]) {
            this._scales = scales;
            this._communicator = new Communicator();
            this._factoryFunction = Animal.Function.Factory.FunctionFactory.instance();
        }

        add(param: any): CommunicatorBuilder {
            param.link.forEach((communication: any) => {
                let {type, behavior, functions, params}=communication;
                let scale = this._getScale(type);
                let fun = this._createFunction(functions, params);
                this._communicator.addLink(param.type, {scale, behavior, fun});
                scale.communicator = this._communicator;
            });
            return this;
        }

        build(): Communicator {
            return this._communicator;
        }

        _getScale(type: ParameterScaleTypes): any {
            let scale: Animal.Scale.AScale;
            this._scales.forEach((item: any) => {
                if (item.type === type) {
                    scale = item;
                }
            });
            return scale;
        }

        _createFunction(functions: Animal.Function.Factory.FunctionTypes, params: any): Animal.Function.IFunction {
            return this._factoryFunction.create(functions, params);
        }
    }
}