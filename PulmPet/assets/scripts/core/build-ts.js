var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Core = (function () {
    function Core() {
    }
    Core.instance = function () {
        if (!this.inst) {
            this.inst = new Core();
        }
        return this.inst;
    };
    Core.prototype.createAnimal = function (putToModel, id) {
        var factory = Animals.AnimalBuilder.instance();
        var animal;
        animal = factory.create(lion);
        animal.id = id;
        return animal;
    };
    Core.prototype.createMap = function (tiled) {
        var map = MapGame.Map.instance();
        map.world = tiled;
    };
    return Core;
}());
var Animals;
(function (Animals) {
    var AnimalBuilder = (function () {
        function AnimalBuilder() {
        }
        AnimalBuilder.instance = function () {
            if (!this.inst) {
                this.inst = new AnimalBuilder();
            }
            return this.inst;
        };
        AnimalBuilder.prototype.createSystems = function (systems) {
            var _this = this;
            var factory = Animals.Systems.SystemFactory.instance();
            var mas = [];
            systems.forEach(function (item) {
                mas = [];
                item.scalesType.forEach(function (sc) {
                    mas[sc.type] = _this.masScales[sc.type];
                });
                _this.masSystems[item.type] = factory.create(item.type, mas);
            });
            return this;
        };
        AnimalBuilder.prototype.createScales = function (scales) {
            var _this = this;
            var factory = Animals.Scales.ScaleFactory.instance();
            scales.forEach(function (item) {
                var typeScale = item.typeScale, type = item.type, params = item.params;
                params.type = type;
                _this.masScales[type] = factory.create(typeScale, params);
            });
            return this;
        };
        AnimalBuilder.prototype.createCommunicator = function (communocation) {
            var communicatorBuild = new Animals.Communications.CommunicatorBuilder(this.masScales);
            communocation.forEach(function (item) {
                communicatorBuild.add(item);
            });
            return communicatorBuild.build();
        };
        AnimalBuilder.prototype.createStates = function (states) {
            var _this = this;
            var factory = StateMachines.StateFactory.instance();
            var paramState = [];
            var state = states.state, links = states.links;
            state.forEach(function (item) {
                paramState[item.type] = factory.create(item.type, item.name, _this._animal, item.isEnd);
            });
            links.forEach(function (item) {
                var massStates = [];
                item.link.forEach(function (state) {
                    massStates.push(new StateMachines.Routes.Route(paramState[state.type], function (model, probability) {
                        if (state.probability > probability) {
                            return true;
                        }
                        return false;
                    }));
                });
                paramState[item.type].setRouteEngine(new StateMachines.Routes.ProbabilityRouteEngine(massStates));
            });
            return new StateMachines.StateMachine(paramState[StateMachines.TypesState.startLife]);
        };
        AnimalBuilder.prototype.create = function (model) {
            var name = model.name, systems = model.systems, scales = model.scales, communication = model.communication, states = model.states;
            this.masScales = [];
            this.masSystems = [];
            var communicator = this.createScales(scales).createSystems(systems).createCommunicator(communication);
            this._animal = new Animals.Animal(this.masSystems);
            this._animal.name = name;
            this._animal.stateMachine = this.createStates(states);
            this._animal.communicator = communicator;
            return this._animal;
        };
        return AnimalBuilder;
    }());
    Animals.AnimalBuilder = AnimalBuilder;
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Animal = (function () {
        function Animal(params) {
            this.navigation = null;
            this.muscular = null;
            this.circulatory = null;
            this.muscular = params[Animals.Systems.SystemTypes.muscular];
            this.circulatory = params[Animals.Systems.SystemTypes.circulatory];
            this.navigation = params[Animals.Systems.SystemTypes.navigation];
            this.muscular._linkToAnimal = this;
            this.circulatory._linkToAnimal = this;
            this.navigation._linkToAnimal = this;
        }
        Object.defineProperty(Animal.prototype, "muscular", {
            get: function () {
                return this._muscular;
            },
            set: function (param) {
                if (param) {
                    this._muscular = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "circulatory", {
            get: function () {
                return this._circulatory;
            },
            set: function (param) {
                if (param) {
                    this._circulatory = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "navigation", {
            get: function () {
                return this._navigation;
            },
            set: function (param) {
                if (param) {
                    this._navigation = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "communicator", {
            get: function () {
                return this._communicator;
            },
            set: function (param) {
                this._communicator = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "stateMachine", {
            get: function () {
                return this._stateMachine;
            },
            set: function (param) {
                this._stateMachine = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "id", {
            get: function () {
                return this._id;
            },
            set: function (param) {
                this._id = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (param) {
                this._name = param;
            },
            enumerable: true,
            configurable: true
        });
        Animal.prototype.moveToPoint = function (point) {
        };
        Animal.prototype.runLife = function () {
            console.log(this);
            this._stateMachine.run();
        };
        Animal.prototype._getParam = function (scale, unit) {
            return {
                name: scale.name,
                value: scale.current,
                unit: unit,
            };
        };
        Animal.prototype.getCharacteristics = function () {
            var params = [];
            if (this._circulatory != null) {
                if (this._circulatory.heartbeat != null) {
                    params.push(this._getParam(this._circulatory._heartbeat, 'уд'));
                }
                if (this._circulatory.pressure != null) {
                    params.push(this._getParam(this._circulatory._pressure, ''));
                }
                if (this._circulatory.state != null) {
                    params.push(this._getParam(this._circulatory.state, '%'));
                }
            }
            if (this._muscular != null) {
                if (this._muscular.speed != null) {
                    params.push(this._getParam(this._muscular._speed, 'm/c'));
                }
                if (this._muscular.weight != null) {
                    params.push(this._getParam(this._muscular._weight, 'kg'));
                }
                if (this._muscular.state != null) {
                    params.push(this._getParam(this._muscular.state, '%'));
                }
            }
            if (this._navigation != null) {
                if (this._navigation.state != null) {
                    params.push(this._getParam(this._navigation.state, '%'));
                }
                if (this._navigation.radiusVision != null) {
                    params.push(this._getParam(this._navigation._radiusVision, 'ед'));
                }
                if (this._navigation.radiusSmell != null) {
                    params.push(this._getParam(this._navigation._radiusSmell, 'ед'));
                }
                if (this._navigation.radiusTouch != null) {
                    params.push(this._getParam(this._navigation._radiusTouch, 'ед'));
                }
                if (this._navigation.radiusHearing != null) {
                    params.push(this._getParam(this._navigation._radiusHearing, 'ед'));
                }
                if (this._navigation.speedSavvy != null) {
                    params.push(this._getParam(this._navigation._speedSavvy, 'ед'));
                }
            }
            return {
                name: this._name,
                currentState: this._stateMachine._state.getName(),
                param: params,
            };
        };
        Animal.prototype.setPointStart = function (x, y) {
            if (this.navigation != null) {
                this.navigation._currentPoint.x = x;
                this.navigation._currentPoint.y = y;
            }
        };
        Animal.prototype.goStateSit = function () {
        };
        Animal.prototype.goStateLies = function () {
        };
        Animal.prototype.goFrighten = function () {
            this.circulatory.heartbeat.change(50);
        };
        Animal.prototype.goCare = function () {
            this.circulatory.heartbeat.change(-50);
        };
        return Animal;
    }());
    Animals.Animal = Animal;
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        var Communicator = (function () {
            function Communicator() {
                this._netLinks = [];
                this._sensitivity = 0.1;
            }
            Object.defineProperty(Communicator.prototype, "sensitivity", {
                get: function () {
                    return this._sensitivity;
                },
                set: function (param) {
                    this._sensitivity = param ? param : 0.1;
                },
                enumerable: true,
                configurable: true
            });
            Communicator.prototype.setting = function (params) {
                this.sensitivity = params.sensitivity || 0.1;
            };
            Communicator.prototype.addLink = function (event, link) {
                if (this._netLinks[event]) {
                    this._netLinks[event].push(link);
                }
                else {
                    this._netLinks[event] = [link];
                }
            };
            Communicator.prototype.publish = function (pack, param) {
                var _this = this;
                var links = this._netLinks[pack.type];
                if (links) {
                    links.forEach(function (link) {
                        var delta = link.fun.calculate(param);
                        if (Math.abs(delta) > _this._sensitivity) {
                            delta = pack.behavior === link.behavior ? delta : -delta;
                            link.scale.change(delta);
                        }
                    });
                }
            };
            return Communicator;
        }());
        Communications.Communicator = Communicator;
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        var BehaviorScaleTypes;
        (function (BehaviorScaleTypes) {
            BehaviorScaleTypes[BehaviorScaleTypes["increase"] = 1] = "increase";
            BehaviorScaleTypes[BehaviorScaleTypes["decrease"] = 2] = "decrease";
        })(BehaviorScaleTypes = Communications.BehaviorScaleTypes || (Communications.BehaviorScaleTypes = {}));
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        var CommunicatorBuilder = (function () {
            function CommunicatorBuilder(scales) {
                this._scales = scales;
                this._communicator = new Communications.Communicator();
                this._factoryFunction = Animals.Functions.FunctionFactory.instance();
            }
            CommunicatorBuilder.prototype.add = function (param) {
                var _this = this;
                param.link.forEach(function (communication) {
                    var type = communication.type, behavior = communication.behavior, functions = communication.functions, params = communication.params;
                    var scale = _this._scales[type];
                    var fun = _this._createFunction(functions, params);
                    _this._communicator.addLink(param.type, { scale: scale, behavior: behavior, fun: fun });
                    scale.communicator = _this._communicator;
                });
                return this;
            };
            CommunicatorBuilder.prototype.build = function () {
                return this._communicator;
            };
            CommunicatorBuilder.prototype._createFunction = function (type, params) {
                return this._factoryFunction.create(type, params);
            };
            return CommunicatorBuilder;
        }());
        Communications.CommunicatorBuilder = CommunicatorBuilder;
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var FunctionFactory = (function () {
            function FunctionFactory() {
                this._factories = [];
                this._factories[Functions.FunctionTypes.line] = Functions.LineFunction;
                this._factories[Functions.FunctionTypes.quadratic] = Functions.QuadraticFunction;
            }
            FunctionFactory.instance = function () {
                if (!this._instance) {
                    this._instance = new FunctionFactory();
                }
                return this._instance;
            };
            FunctionFactory.prototype.add = function (type, system) {
                this._factories[type] = system;
            };
            FunctionFactory.prototype.create = function (functionType, params) {
                return new this._factories[functionType](params);
            };
            return FunctionFactory;
        }());
        Functions.FunctionFactory = FunctionFactory;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var FunctionTypes;
        (function (FunctionTypes) {
            FunctionTypes[FunctionTypes["line"] = 1] = "line";
            FunctionTypes[FunctionTypes["quadratic"] = 2] = "quadratic";
        })(FunctionTypes = Functions.FunctionTypes || (Functions.FunctionTypes = {}));
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var LineFunction = (function () {
            function LineFunction(params) {
                this._coefficient = params[0] || 0;
                this._free = params[1] || 0;
            }
            Object.defineProperty(LineFunction.prototype, "coefficient", {
                get: function () {
                    return this._coefficient;
                },
                set: function (param) {
                    this._coefficient = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineFunction.prototype, "free", {
                get: function () {
                    return this._free;
                },
                set: function (param) {
                    this._free = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            LineFunction.prototype.calculate = function (param) {
                return this._coefficient * param + this._free;
            };
            return LineFunction;
        }());
        Functions.LineFunction = LineFunction;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var QuadraticFunction = (function () {
            function QuadraticFunction(params) {
                this._coefficientA = params[0] || 0;
                this._coefficientB = params[1] || 0;
                this._free = params[2] || 0;
            }
            Object.defineProperty(QuadraticFunction.prototype, "coefficientA", {
                get: function () {
                    return this._coefficientA;
                },
                set: function (param) {
                    this._coefficientA = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadraticFunction.prototype, "coefficientB", {
                get: function () {
                    return this._coefficientB;
                },
                set: function (param) {
                    this._coefficientB = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadraticFunction.prototype, "free", {
                get: function () {
                    return this._free;
                },
                set: function (param) {
                    this._free = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            QuadraticFunction.prototype.calculate = function (param) {
                return this._coefficientA * (Math.pow(param, 2)) + this._coefficientB * param + this._free;
            };
            return QuadraticFunction;
        }());
        Functions.QuadraticFunction = QuadraticFunction;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var Scale = (function () {
            function Scale() {
            }
            Object.defineProperty(Scale.prototype, "name", {
                get: function () {
                    return this._name;
                },
                set: function (param) {
                    this._name = param;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scale.prototype, "min", {
                get: function () {
                    return this._min;
                },
                set: function (param) {
                    this._min = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scale.prototype, "max", {
                get: function () {
                    return this._max;
                },
                set: function (param) {
                    this._max = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scale.prototype, "current", {
                get: function () {
                    return this._current;
                },
                set: function (param) {
                    this._current = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scale.prototype, "percent", {
                get: function () {
                    return this._percent;
                },
                set: function (param) {
                    this._percent = param;
                    this.getCurrentValueOnScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scale.prototype, "type", {
                get: function () {
                    return this._type;
                },
                set: function (param) {
                    this._type = param;
                },
                enumerable: true,
                configurable: true
            });
            Scale.prototype.getPercentageInScale = function () {
                if (this._current >= this._max) {
                    this._percent = 100;
                }
                else if (this._current <= this._min) {
                    this._percent = 0;
                }
                else {
                    this._percent = ((this._current - this._min) * 100) / (this._max - this._min);
                }
            };
            Scale.prototype.getCurrentValueOnScale = function () {
                this._current = (((this._max - this._min) / 100) * this._percent) + this._min;
            };
            return Scale;
        }());
        Scales.Scale = Scale;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var ScaleFactory = (function () {
            function ScaleFactory() {
                this._factories = [];
                this._factories[Scales.ScaleTypes.system] = Scales.SystemScale;
                this._factories[Scales.ScaleTypes.argument] = Scales.ArgumentScale;
            }
            ScaleFactory.instance = function () {
                if (!this._instance) {
                    this._instance = new ScaleFactory();
                }
                return this._instance;
            };
            ScaleFactory.prototype.add = function (type, system) {
                this._factories[type] = system;
            };
            ScaleFactory.prototype.create = function (scaleType, params) {
                return new this._factories[scaleType](params);
            };
            return ScaleFactory;
        }());
        Scales.ScaleFactory = ScaleFactory;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var ScaleTypes;
        (function (ScaleTypes) {
            ScaleTypes[ScaleTypes["system"] = 0] = "system";
            ScaleTypes[ScaleTypes["argument"] = 1] = "argument";
        })(ScaleTypes = Scales.ScaleTypes || (Scales.ScaleTypes = {}));
        var ParameterScaleTypes;
        (function (ParameterScaleTypes) {
            ParameterScaleTypes[ParameterScaleTypes["state"] = 1] = "state";
            ParameterScaleTypes[ParameterScaleTypes["speed"] = 2] = "speed";
            ParameterScaleTypes[ParameterScaleTypes["weight"] = 3] = "weight";
            ParameterScaleTypes[ParameterScaleTypes["heartbeat"] = 4] = "heartbeat";
            ParameterScaleTypes[ParameterScaleTypes["pressure"] = 5] = "pressure";
            ParameterScaleTypes[ParameterScaleTypes["amountPointRememberWater"] = 6] = "amountPointRememberWater";
            ParameterScaleTypes[ParameterScaleTypes["amountPointRememberGrass"] = 7] = "amountPointRememberGrass";
            ParameterScaleTypes[ParameterScaleTypes["amountPointRememberMeat"] = 8] = "amountPointRememberMeat";
            ParameterScaleTypes[ParameterScaleTypes["speedSavvy"] = 9] = "speedSavvy";
            ParameterScaleTypes[ParameterScaleTypes["radiusVision"] = 10] = "radiusVision";
            ParameterScaleTypes[ParameterScaleTypes["radiusHearing"] = 11] = "radiusHearing";
            ParameterScaleTypes[ParameterScaleTypes["radiusSmell"] = 12] = "radiusSmell";
            ParameterScaleTypes[ParameterScaleTypes["radiusTouch"] = 13] = "radiusTouch";
        })(ParameterScaleTypes = Scales.ParameterScaleTypes || (Scales.ParameterScaleTypes = {}));
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var ArgumentScale = (function (_super) {
            __extends(ArgumentScale, _super);
            function ArgumentScale(params) {
                var _this = _super.call(this) || this;
                _this._name = params.name || "No name";
                _this._min = params.min || 0;
                _this._max = params.max || 100;
                _this._current = params.current || _this._max;
                _this._responseDelay = params.responseDelay || 1000;
                _this._type = params.type || 0;
                _this.getPercentageInScale();
                return _this;
            }
            Object.defineProperty(ArgumentScale.prototype, "responseDelay", {
                get: function () {
                    return this._responseDelay;
                },
                set: function (param) {
                    this._responseDelay = param ? param : 1000;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArgumentScale.prototype, "communicator", {
                get: function () {
                    return this._communicator;
                },
                set: function (param) {
                    this._communicator = param;
                },
                enumerable: true,
                configurable: true
            });
            ArgumentScale.prototype.trigger = function (params) {
                var event = (params > 0) ? Animals.Communications.BehaviorScaleTypes.increase : Animals.Communications.BehaviorScaleTypes.decrease;
                var pack = {
                    behavior: event,
                    type: this._type
                };
                console.log(this._communicator);
                console.log(this);
                this._communicator.publish(pack, params);
            };
            ArgumentScale.prototype.change = function (delta) {
                var _this = this;
                var rez = this.percent + delta;
                if (rez <= 100 && rez >= 0) {
                    this.percent = rez;
                    this.getCurrentValueOnScale();
                }
                setTimeout(function () {
                    _this.trigger(delta);
                }, this.responseDelay);
            };
            return ArgumentScale;
        }(Scales.Scale));
        Scales.ArgumentScale = ArgumentScale;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var SystemScale = (function (_super) {
            __extends(SystemScale, _super);
            function SystemScale(params) {
                var _this = _super.call(this) || this;
                _this._name = params.name || "No name";
                _this._min = params.min || 0;
                _this._max = params.max || 100;
                _this._type = params.type || 0;
                _this._current = params.current || _this._max;
                _this.getPercentageInScale();
                return _this;
            }
            SystemScale.prototype.analysis = function (params) {
                var rez = 0;
                params.forEach(function (param) {
                    rez += param.percent;
                });
                this.percent = rez / params.length;
                this.getCurrentValueOnScale();
            };
            return SystemScale;
        }(Scales.Scale));
        Scales.SystemScale = SystemScale;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var SystemFactory = (function () {
            function SystemFactory() {
                this._factories = [];
                this._factories[Systems.SystemTypes.muscular] = Animals.Systems.Muscular;
                this._factories[Systems.SystemTypes.circulatory] = Animals.Systems.Circulatory;
                this._factories[Systems.SystemTypes.navigation] = Animals.Systems.Navigation;
            }
            SystemFactory.instance = function () {
                if (!this._instance) {
                    this._instance = new SystemFactory();
                }
                return this._instance;
            };
            SystemFactory.prototype.add = function (type, system) {
                this._factories[type] = system;
            };
            SystemFactory.prototype.create = function (systemType, params) {
                return new this._factories[systemType](params);
            };
            return SystemFactory;
        }());
        Systems.SystemFactory = SystemFactory;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var SystemTypes;
        (function (SystemTypes) {
            SystemTypes[SystemTypes["muscular"] = 1] = "muscular";
            SystemTypes[SystemTypes["circulatory"] = 2] = "circulatory";
            SystemTypes[SystemTypes["navigation"] = 3] = "navigation";
        })(SystemTypes = Systems.SystemTypes || (Systems.SystemTypes = {}));
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var Circulatory = (function () {
            function Circulatory(scales) {
                this._heartbeat = null;
                this._pressure = null;
                this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);
                ;
                this.heartbeat = scales[Animals.Scales.ParameterScaleTypes.heartbeat];
                this.pressure = scales[Animals.Scales.ParameterScaleTypes.pressure];
            }
            Object.defineProperty(Circulatory.prototype, "heartbeat", {
                get: function () {
                    return this._heartbeat;
                },
                set: function (param) {
                    if (param) {
                        this._heartbeat = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Circulatory.prototype, "pressure", {
                get: function () {
                    return this._pressure;
                },
                set: function (param) {
                    if (param) {
                        this._pressure = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Circulatory.prototype.changeHeartbeat = function (delta) {
                if (this._heartbeat != null) {
                    this._heartbeat.change(delta);
                    this.analysis();
                }
            };
            Circulatory.prototype.changePressure = function (delta) {
                if (this._pressure != null) {
                    this._pressure.change(delta);
                    this.analysis();
                }
            };
            Circulatory.prototype.analysis = function () {
                this.state.analysis([
                    this.pressure,
                    this.heartbeat
                ]);
            };
            return Circulatory;
        }());
        Systems.Circulatory = Circulatory;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var Muscular = (function () {
            function Muscular(scales) {
                this._speed = null;
                this._weight = null;
                this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);
                this.speed = scales[Animals.Scales.ParameterScaleTypes.speed];
                this.weight = scales[Animals.Scales.ParameterScaleTypes.weight];
            }
            Object.defineProperty(Muscular.prototype, "speed", {
                get: function () {
                    return this._speed;
                },
                set: function (param) {
                    if (param) {
                        this._speed = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Muscular.prototype, "weight", {
                get: function () {
                    return this._weight;
                },
                set: function (param) {
                    if (param) {
                        this._weight = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Muscular.prototype.changeSpeed = function (delta) {
                if (this._speed != null) {
                    this._speed.change(delta);
                    this.analysis();
                }
            };
            Muscular.prototype.changeWeight = function (delta) {
                if (this._weight) {
                    this._weight.change(delta);
                    this.analysis();
                }
            };
            Muscular.prototype.analysis = function () {
                this.state.analysis([
                    this.speed,
                    this.weight
                ]);
            };
            return Muscular;
        }());
        Systems.Muscular = Muscular;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var Navigation = (function () {
            function Navigation(scales) {
                this._speedSavvy = null;
                this._radiusHearing = null;
                this._radiusTouch = null;
                this._radiusSmell = null;
                this._radiusVision = null;
                this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);
                this.speedSavvy = scales[Animals.Scales.ParameterScaleTypes.speedSavvy];
                this.radiusHearing = scales[Animals.Scales.ParameterScaleTypes.radiusHearing];
                this.radiusSmell = scales[Animals.Scales.ParameterScaleTypes.radiusSmell];
                this.radiusVision = scales[Animals.Scales.ParameterScaleTypes.radiusVision];
                this.radiusTouch = scales[Animals.Scales.ParameterScaleTypes.radiusTouch];
                this._currentPoint = {
                    x: 0,
                    y: 0
                };
                this._map = MapGame.Map.instance();
            }
            Object.defineProperty(Navigation.prototype, "speedSavvy", {
                get: function () {
                    return this._speedSavvy;
                },
                set: function (param) {
                    if (param) {
                        this._speedSavvy = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusVision", {
                get: function () {
                    return this._radiusVision;
                },
                set: function (param) {
                    if (param) {
                        this._radiusVision = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusHearing", {
                get: function () {
                    return this._radiusHearing;
                },
                set: function (param) {
                    if (param) {
                        this._radiusHearing = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusSmell", {
                get: function () {
                    return this._radiusSmell;
                },
                set: function (param) {
                    if (param) {
                        this._radiusSmell = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusTouch", {
                get: function () {
                    return this._radiusTouch;
                },
                set: function (param) {
                    if (param) {
                        this._radiusTouch = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Navigation.prototype.changeSpeedSavvy = function (delta) {
                this._speedSavvy.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusVision = function (delta) {
                this._radiusVision.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusHearing = function (delta) {
                this._radiusHearing.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusSmell = function (delta) {
                this._radiusSmell.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusTouch = function (delta) {
                this._radiusTouch.change(delta);
                this.analysis();
            };
            Navigation.prototype.analysis = function () {
                this.state.analysis([
                    this.radiusHearing,
                    this.radiusTouch,
                    this.radiusSmell,
                    this.speedSavvy,
                    this.radiusVision,
                ]);
            };
            Navigation.prototype.A = function (pointEnd) {
                var _this = this;
                var tileStart = this._map.convertTiledPos(this._currentPoint);
                var tileEnd = this._map.convertTiledPos(pointEnd);
                var closed = [];
                var open = [];
                open.push(tileStart);
                var puth = [];
                var arr = [];
                var _loop_1 = function () {
                    var curr = this_1.minF(open, tileEnd);
                    if (curr.x === tileEnd.x && curr.y === tileEnd.y) {
                        return { value: this_1.foundPuth(puth, tileEnd) };
                    }
                    closed.push(curr);
                    this_1.removeElement(curr, open);
                    arr = [];
                    this_1.getElementNotInClosedForCurr(closed, curr).forEach(function (element) {
                        if (_this.checkInMass(open, element)) {
                            arr.push(curr);
                            arr.push(element);
                            open.push(element);
                        }
                    });
                    puth.push(arr);
                };
                var this_1 = this;
                while (open.length > 0) {
                    var state_1 = _loop_1();
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
                return false;
            };
            Navigation.prototype.foundPuth = function (puth, end) {
                var arr = [];
                for (var i = puth.length - 1; i >= 0; i--) {
                    var row = puth[i];
                    for (var j = 1, length_1 = row.length; j < length_1; j += 2) {
                        if (end.x === row[j].x && end.y === row[j].y) {
                            arr.push(end);
                            end = row[j - 1];
                            break;
                        }
                    }
                }
                return arr;
            };
            Navigation.prototype.correctPuth = function (puth) {
                if (puth) {
                    var target = 1;
                    var element1, element2, element3;
                    while (target != 0) {
                        target = 0;
                        for (var i = 0; i < puth.length - 3; i++) {
                            element1 = puth[i],
                                element2 = puth[i + 1],
                                element3 = puth[i + 2];
                            if (Math.abs(element1.x - element3.x) === 1 && Math.abs(element1.y - element3.y) === 1) {
                                if (element2.x === element1.x) {
                                    target = cc.v2(element3.x, element1.y);
                                }
                                else {
                                    target = cc.v2(element1.x, element3.y);
                                }
                                if (this._map.isCheсkObstacle(target)) {
                                    puth.splice(i + 1, 1);
                                }
                                else {
                                    target = 0;
                                }
                            }
                        }
                    }
                }
                return puth;
            };
            Navigation.prototype.getElementNotInClosedForCurr = function (closed, curr) {
                var arr = [];
                var p;
                p = cc.p(curr.x, curr.y + 1);
                if (this._map.isCheсkObstacle(p) && this.checkInMass(closed, p)) {
                    arr.push(p);
                }
                p = cc.p(curr.x, curr.y - 1);
                if (this._map.isCheсkObstacle(p) && this.checkInMass(closed, p)) {
                    arr.push(p);
                }
                p = cc.p(curr.x + 1, curr.y);
                if (this._map.isCheсkObstacle(p) && this.checkInMass(closed, p)) {
                    arr.push(p);
                }
                p = cc.p(curr.x - 1, curr.y);
                if (this._map.isCheсkObstacle(p) && this.checkInMass(closed, p)) {
                    arr.push(p);
                }
                return arr;
            };
            Navigation.prototype.checkInMass = function (closed, element) {
                return closed.find(function (item) { return item.x === element.x && item.y === element.y; }) ? false : true;
            };
            Navigation.prototype.removeElement = function (element, mass) {
                var index = mass.findIndex(function (item) { return element.x === item.x && element.y === item.y; });
                mass.splice(index, 1);
            };
            Navigation.prototype.minF = function (mas, tileEnd) {
                var _this = this;
                var min = Number.MAX_VALUE;
                var minItem = null;
                mas.forEach(function (item, i) {
                    var vremen = _this.h(item, tileEnd);
                    if (vremen < min) {
                        min = vremen;
                        minItem = item;
                    }
                });
                return minItem;
            };
            Navigation.prototype.h = function (start, end) {
                return Math.sqrt(Math.pow((end.x - start.x), 2) + Math.pow((end.y - start.y), 2));
            };
            return Navigation;
        }());
        Systems.Navigation = Navigation;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var MapGame;
(function (MapGame) {
    var Map = (function () {
        function Map() {
        }
        Map.instance = function () {
            if (!this._inst) {
                this._inst = new Map();
            }
            return this._inst;
        };
        Object.defineProperty(Map.prototype, "world", {
            get: function () {
                return this._world;
            },
            set: function (map) {
                if (map) {
                    this._world = map;
                    this._initializationWorld();
                }
                else {
                    throw new Error('World was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "obstaclesLayer", {
            set: function (layer) {
                if (layer) {
                    this._obstaclesLayer = layer;
                }
                else {
                    throw new Error('Layer obstacle was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "waterLayer", {
            set: function (layer) {
                if (layer) {
                    this._waterLayer = layer;
                }
                else {
                    throw new Error('Layer water was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "treeLayer", {
            set: function (layer) {
                if (layer) {
                    this._treeLayer = layer;
                }
                else {
                    throw new Error('Layer tree was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Map.prototype._initializationWorld = function () {
            this._initializationLayer();
            this._sizeMapTiled = this._world.getMapSize();
            this._sizeTiled = this._world.getTileSize();
            this._sizeMapPixel = this._getSizeMapPixel();
        };
        Map.prototype._initializationLayer = function () {
            this.obstaclesLayer = this._world.getLayer('obstacles');
            this.waterLayer = this._world.getLayer('water');
            this.treeLayer = this._world.getLayer('tree');
        };
        Map.prototype._getSizeMapPixel = function () {
            var sizeX = this._sizeMapTiled.width * this._sizeTiled.width;
            var sizeY = this._sizeMapTiled.height * this._sizeTiled.height;
            return cc.v2(sizeX, sizeY);
        };
        Map.prototype.convertTiledPos = function (posInPixel) {
            var x = Math.floor((posInPixel.x) / this._sizeTiled.width);
            var y = Math.floor((this._sizeMapPixel.y - (posInPixel.y)) / this._sizeTiled.height);
            return cc.v2(x, y);
        };
        Map.prototype.convertPixelPos = function (posInTiled) {
            var x = posInTiled.x * this._sizeTiled.width + this._sizeTiled.width / 2;
            var y = this._sizeMapPixel.y - (posInTiled.y * this._sizeTiled.height) - this._sizeTiled.height / 2;
            return cc.v2(x, y);
        };
        Map.prototype.isCheсkObstacle = function (gid) {
            if (this._isCorrectPos(gid)) {
                if (this._obstaclesLayer.getTileGIDAt(gid.x, gid.y) === 0) {
                    return false;
                }
            }
            return true;
        };
        Map.prototype._isCorrectPos = function (pos) {
            if (pos.x < 0 || pos.y < 0 || pos.x > this._sizeMapTiled.width - 1 || pos.y > this._sizeMapTiled.height - 1) {
                return false;
            }
            return true;
        };
        return Map;
    }());
    MapGame.Map = Map;
})(MapGame || (MapGame = {}));
var StateMachines;
(function (StateMachines) {
    var StateMachine = (function () {
        function StateMachine(state) {
            this._state = state;
            this.factory = StateMachines.StateFactory.instance();
            this._needState = [];
        }
        StateMachine.prototype.run = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pack;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._isRun = true;
                            return [4, this._state.run()];
                        case 1:
                            _a.sent();
                            if (!this._isRun) return [3, 2];
                            this.next();
                            return [3, 4];
                        case 2:
                            pack = this._needState.unshift();
                            return [4, this.factory.create(pack.type, pack.name, pack.animal, pack.isEnd).run()];
                        case 3:
                            _a.sent();
                            if (this._needState.length < 1) {
                                this.next();
                            }
                            _a.label = 4;
                        case 4: return [2];
                    }
                });
            });
        };
        StateMachine.prototype.next = function () {
            if (!this._state.isEndPoint()) {
                this._state = this._state.getNextState();
                this.run();
            }
        };
        return StateMachine;
    }());
    StateMachines.StateMachine = StateMachine;
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var StateFactory = (function () {
        function StateFactory() {
            this._factories = [];
            this._factories[StateMachines.TypesState.startLife] = StateMachines.States.StateStart;
            this._factories[StateMachines.TypesState.stand] = StateMachines.States.StateStand;
            this._factories[StateMachines.TypesState.run] = StateMachines.States.StateRun;
            this._factories[StateMachines.TypesState.die] = StateMachines.States.StateDie;
            this._factories[StateMachines.TypesState.sleep] = StateMachines.States.StateSleep;
            this._factories[StateMachines.TypesState.go] = StateMachines.States.StateGo;
            this._factories[StateMachines.TypesState.lies] = StateMachines.States.StateLies;
            this._factories[StateMachines.TypesState.sit] = StateMachines.States.StateSit;
        }
        StateFactory.instance = function () {
            if (!this._instance) {
                this._instance = new StateFactory();
            }
            return this._instance;
        };
        StateFactory.prototype.add = function (type, state) {
            this._factories[type] = state;
        };
        StateFactory.prototype.create = function (typeState, name, animal, isEnd) {
            return new this._factories[typeState](name, animal, isEnd, null);
        };
        return StateFactory;
    }());
    StateMachines.StateFactory = StateFactory;
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var TypesState;
    (function (TypesState) {
        TypesState[TypesState["startLife"] = 1] = "startLife";
        TypesState[TypesState["stand"] = 2] = "stand";
        TypesState[TypesState["run"] = 3] = "run";
        TypesState[TypesState["die"] = 4] = "die";
        TypesState[TypesState["sleep"] = 5] = "sleep";
        TypesState[TypesState["go"] = 6] = "go";
        TypesState[TypesState["lies"] = 7] = "lies";
        TypesState[TypesState["sit"] = 8] = "sit";
    })(TypesState = StateMachines.TypesState || (StateMachines.TypesState = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var Routes;
    (function (Routes) {
        var Route = (function () {
            function Route(state, availability) {
                this._state = state;
                this._availability = availability;
            }
            Route.prototype.isAvailable = function (model, probability) {
                if (probability === void 0) { probability = 1.0; }
                return (this._availability && this._availability(model, probability)) ? this._state : null;
            };
            Route.prototype.getState = function () {
                return this._state;
            };
            return Route;
        }());
        Routes.Route = Route;
    })(Routes = StateMachines.Routes || (StateMachines.Routes = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var Routes;
    (function (Routes) {
        var RouteEngine = (function () {
            function RouteEngine(routes, nextEngine) {
                if (routes === void 0) { routes = []; }
                if (nextEngine === void 0) { nextEngine = null; }
                this._routes = routes;
                this._nextEngine = nextEngine;
            }
            RouteEngine.prototype.add = function (routes) {
                (_a = this._routes).push.apply(_a, routes);
                var _a;
            };
            RouteEngine.prototype.getRoute = function () {
                throw new Error('Not implemented yet...');
            };
            RouteEngine.prototype.setNextEngine = function (engine) {
                this._nextEngine = engine;
            };
            RouteEngine.prototype.setModel = function (animal) {
                this._model = animal;
            };
            RouteEngine.prototype._nextRouteEngine = function () {
                if (this._nextEngine) {
                    return this._nextEngine.getRoute();
                }
                return null;
            };
            return RouteEngine;
        }());
        Routes.RouteEngine = RouteEngine;
    })(Routes = StateMachines.Routes || (StateMachines.Routes = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var Routes;
    (function (Routes) {
        var ProbabilityRouteEngine = (function (_super) {
            __extends(ProbabilityRouteEngine, _super);
            function ProbabilityRouteEngine(routes, nextEngine) {
                if (routes === void 0) { routes = []; }
                if (nextEngine === void 0) { nextEngine = null; }
                return _super.call(this, routes, nextEngine) || this;
            }
            ProbabilityRouteEngine.prototype.getRoute = function () {
                var _this = this;
                var probability = Math.random();
                var routes = this._routes.filter(function (route) { return route.isAvailable(_this._model, probability); });
                return routes.length > 0 ? routes[0] : this._nextRouteEngine();
            };
            return ProbabilityRouteEngine;
        }(Routes.RouteEngine));
        Routes.ProbabilityRouteEngine = ProbabilityRouteEngine;
    })(Routes = StateMachines.Routes || (StateMachines.Routes = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var Routes;
    (function (Routes) {
        var SimpleRouteEngine = (function (_super) {
            __extends(SimpleRouteEngine, _super);
            function SimpleRouteEngine(routes, nextEngine) {
                if (routes === void 0) { routes = []; }
                if (nextEngine === void 0) { nextEngine = null; }
                return _super.call(this, routes, nextEngine) || this;
            }
            SimpleRouteEngine.prototype.getRoute = function () {
                var _this = this;
                var routes = this._routes.filter(function (route) { return route.isAvailable(_this._model); });
                return routes.length > 0 ? routes[0] : this._nextRouteEngine();
            };
            return SimpleRouteEngine;
        }(Routes.RouteEngine));
        Routes.SimpleRouteEngine = SimpleRouteEngine;
    })(Routes = StateMachines.Routes || (StateMachines.Routes = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var States;
    (function (States) {
        var State = (function () {
            function State(name, model, routeEngine, isEndPoint) {
                if (routeEngine === void 0) { routeEngine = null; }
                if (isEndPoint === void 0) { isEndPoint = false; }
                this._name = name;
                this._model = model;
                this._routeEngine = routeEngine;
                this._isEndPoint = isEndPoint;
            }
            State.prototype.getName = function () {
                return this._name;
            };
            State.prototype.getNextState = function () {
                if (!this._routeEngine) {
                    return this;
                }
                var route = this._routeEngine.getRoute();
                return route ? route.getState() : this;
            };
            State.prototype.isEndPoint = function () {
                return this._isEndPoint;
            };
            State.prototype.setRouteEngine = function (routeEngine) {
                this._routeEngine = routeEngine;
                this._routeEngine.setModel(this._model);
            };
            State.prototype.add = function (state) {
                throw new Error('Not implemented yet...');
            };
            State.prototype.run = function (model) {
                throw new Error('Not implemented yet...');
            };
            State.prototype.mySleep = function (s) {
                s *= 1000;
                return new Promise(function (resolve) { return setTimeout(resolve, s); });
            };
            return State;
        }());
        States.State = State;
    })(States = StateMachines.States || (StateMachines.States = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var States;
    (function (States) {
        var StateDie = (function (_super) {
            __extends(StateDie, _super);
            function StateDie(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) { isEndPoint = false; }
                if (routeEngine === void 0) { routeEngine = null; }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateDie.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log('умер');
                        return [2];
                    });
                });
            };
            return StateDie;
        }(States.State));
        States.StateDie = StateDie;
    })(States = StateMachines.States || (StateMachines.States = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var States;
    (function (States) {
        var StateGo = (function (_super) {
            __extends(StateGo, _super);
            function StateGo(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) { isEndPoint = false; }
                if (routeEngine === void 0) { routeEngine = null; }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateGo.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('иду');
                                this._model.muscular.changeSpeed(0.5);
                                this._model.muscular.changeWeight(0.7);
                                this._model.navigation.changeSpeedSavvy(0.1);
                                this._model.circulatory.changeHeartbeat(-0.3);
                                return [4, this.mySleep(2)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            return StateGo;
        }(States.State));
        States.StateGo = StateGo;
    })(States = StateMachines.States || (StateMachines.States = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var States;
    (function (States) {
        var StateLies = (function (_super) {
            __extends(StateLies, _super);
            function StateLies(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) { isEndPoint = false; }
                if (routeEngine === void 0) { routeEngine = null; }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateLies.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('лежу');
                                this._model.muscular.changeSpeed(0.5);
                                this._model.muscular.changeWeight(0.7);
                                this._model.circulatory.changeHeartbeat(-0.3);
                                return [4, this.mySleep(2)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            return StateLies;
        }(States.State));
        States.StateLies = StateLies;
    })(States = StateMachines.States || (StateMachines.States = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var States;
    (function (States) {
        var StateRun = (function (_super) {
            __extends(StateRun, _super);
            function StateRun(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) { isEndPoint = false; }
                if (routeEngine === void 0) { routeEngine = null; }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateRun.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('бегу');
                                this._model.circulatory.changeHeartbeat(0.5);
                                this._model.circulatory.changePressure(0.2);
                                this._model.muscular.changeSpeed(-0.4);
                                this._model.muscular.changeWeight(-0.5);
                                return [4, this.mySleep(2)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            return StateRun;
        }(States.State));
        States.StateRun = StateRun;
    })(States = StateMachines.States || (StateMachines.States = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var States;
    (function (States) {
        var StateSit = (function (_super) {
            __extends(StateSit, _super);
            function StateSit(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) { isEndPoint = false; }
                if (routeEngine === void 0) { routeEngine = null; }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateSit.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('сижу');
                                this._model.muscular.changeSpeed(0.5);
                                this._model.muscular.changeWeight(0.7);
                                this._model.circulatory.changeHeartbeat(-0.3);
                                return [4, this.mySleep(2)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            return StateSit;
        }(States.State));
        States.StateSit = StateSit;
    })(States = StateMachines.States || (StateMachines.States = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var States;
    (function (States) {
        var StateSleep = (function (_super) {
            __extends(StateSleep, _super);
            function StateSleep(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) { isEndPoint = false; }
                if (routeEngine === void 0) { routeEngine = null; }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateSleep.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('сплю');
                                this._model.muscular.changeSpeed(0.5);
                                this._model.muscular.changeWeight(0.7);
                                this._model.circulatory.changeHeartbeat(-0.3);
                                return [4, this.mySleep(2)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            return StateSleep;
        }(States.State));
        States.StateSleep = StateSleep;
    })(States = StateMachines.States || (StateMachines.States = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var States;
    (function (States) {
        var StateStand = (function (_super) {
            __extends(StateStand, _super);
            function StateStand(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) { isEndPoint = false; }
                if (routeEngine === void 0) { routeEngine = null; }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateStand.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('стою');
                                this._model.muscular.changeSpeed(0.5);
                                this._model.muscular.changeWeight(0.7);
                                this._model.circulatory.changeHeartbeat(-0.3);
                                return [4, this.mySleep(2)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            return StateStand;
        }(States.State));
        States.StateStand = StateStand;
    })(States = StateMachines.States || (StateMachines.States = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var States;
    (function (States) {
        var StateStart = (function (_super) {
            __extends(StateStart, _super);
            function StateStart(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) { isEndPoint = false; }
                if (routeEngine === void 0) { routeEngine = null; }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateStart.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('Начал жить');
                                this._model.circulatory.changeHeartbeat(0.001);
                                this._model.circulatory.changePressure(0.001);
                                this._model.muscular.changeSpeed(0.001);
                                this._model.muscular.changeWeight(0.001);
                                return [4, this.mySleep(2)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            return StateStart;
        }(States.State));
        States.StateStart = StateStart;
    })(States = StateMachines.States || (StateMachines.States = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var States;
    (function (States) {
        var PatternState = (function (_super) {
            __extends(PatternState, _super);
            function PatternState(name, model, routeEngine, states) {
                if (routeEngine === void 0) { routeEngine = null; }
                if (states === void 0) { states = []; }
                var _this = _super.call(this, name, model, routeEngine) || this;
                _this._states = states;
                return _this;
            }
            PatternState.prototype.add = function (state) {
                this._states.push(state);
            };
            PatternState.prototype.run = function (model) {
                var state = this._states[0];
                while (state) {
                    this._state = state;
                    state.run(model);
                }
            };
            PatternState.prototype.getName = function () {
                if (!this._state) {
                    throw new Error('Current state not initialized...');
                }
                return this._state.getName();
            };
            return PatternState;
        }(States.State));
        States.PatternState = PatternState;
    })(States = StateMachines.States || (StateMachines.States = {}));
})(StateMachines || (StateMachines = {}));
var StateMachines;
(function (StateMachines) {
    var States;
    (function (States) {
        var PrimitiveState = (function (_super) {
            __extends(PrimitiveState, _super);
            function PrimitiveState(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) { isEndPoint = false; }
                if (routeEngine === void 0) { routeEngine = null; }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            PrimitiveState.prototype.run = function () {
                throw new Error('No implementation status...');
            };
            return PrimitiveState;
        }(States.State));
        States.PrimitiveState = PrimitiveState;
    })(States = StateMachines.States || (StateMachines.States = {}));
})(StateMachines || (StateMachines = {}));
var lion = {
    name: 'Лев',
    systems: [
        {
            type: Animals.Systems.SystemTypes.muscular,
            scalesType: [
                { type: Animals.Scales.ParameterScaleTypes.speed },
                { type: Animals.Scales.ParameterScaleTypes.speed },
                { type: Animals.Scales.ParameterScaleTypes.weight }
            ],
        },
        {
            type: Animals.Systems.SystemTypes.circulatory,
            scalesType: [
                { type: Animals.Scales.ParameterScaleTypes.pressure },
                { type: Animals.Scales.ParameterScaleTypes.heartbeat }
            ],
        },
        {
            type: Animals.Systems.SystemTypes.navigation,
            scalesType: [
                { type: Animals.Scales.ParameterScaleTypes.speedSavvy },
                { type: Animals.Scales.ParameterScaleTypes.radiusVision },
                { type: Animals.Scales.ParameterScaleTypes.radiusSmell },
                { type: Animals.Scales.ParameterScaleTypes.radiusHearing },
                { type: Animals.Scales.ParameterScaleTypes.radiusTouch },
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
                    type: Animals.Scales.ParameterScaleTypes.pressure,
                    behavior: Animals.Communications.BehaviorScaleTypes.increase,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.18
                    ]
                },
                {
                    type: Animals.Scales.ParameterScaleTypes.weight,
                    behavior: Animals.Communications.BehaviorScaleTypes.increase,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.18
                    ]
                },
                {
                    type: Animals.Scales.ParameterScaleTypes.heartbeat,
                    behavior: Animals.Communications.BehaviorScaleTypes.increase,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.18
                    ]
                },
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
                },
                {
                    type: Animals.Scales.ParameterScaleTypes.pressure,
                    behavior: Animals.Communications.BehaviorScaleTypes.increase,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.1
                    ]
                },
                {
                    type: Animals.Scales.ParameterScaleTypes.radiusTouch,
                    behavior: Animals.Communications.BehaviorScaleTypes.increase,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.1
                    ]
                },
                {
                    type: Animals.Scales.ParameterScaleTypes.radiusVision,
                    behavior: Animals.Communications.BehaviorScaleTypes.decrease,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.1
                    ]
                }
            ],
        },
        {
            type: Animals.Scales.ParameterScaleTypes.heartbeat,
            link: [
                {
                    type: Animals.Scales.ParameterScaleTypes.pressure,
                    behavior: Animals.Communications.BehaviorScaleTypes.increase,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.1
                    ]
                },
                {
                    type: Animals.Scales.ParameterScaleTypes.speedSavvy,
                    behavior: Animals.Communications.BehaviorScaleTypes.increase,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.1
                    ]
                }
            ],
        },
        {
            type: Animals.Scales.ParameterScaleTypes.speedSavvy,
            link: [
                {
                    type: Animals.Scales.ParameterScaleTypes.radiusVision,
                    behavior: Animals.Communications.BehaviorScaleTypes.increase,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.1
                    ]
                }
            ],
        },
        {
            type: Animals.Scales.ParameterScaleTypes.radiusTouch,
            link: [
                {
                    type: Animals.Scales.ParameterScaleTypes.speed,
                    behavior: Animals.Communications.BehaviorScaleTypes.increase,
                    functions: Animals.Functions.FunctionTypes.line,
                    params: [
                        0.5,
                        0.1
                    ]
                }
            ],
        },
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
                        probability: 0.1
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
                        probability: 0.1
                    }
                ]
            },
            {
                type: StateMachines.TypesState.run,
                link: [
                    {
                        type: StateMachines.TypesState.die,
                        probability: 0.06
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
//# sourceMappingURL=build-ts.js.map