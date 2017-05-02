"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Animals;
(function (Animals) {
    var AnimalBuilder = function () {
        function AnimalBuilder() {}
        AnimalBuilder.instance = function () {
            if (!this.inst) {
                this.inst = new AnimalBuilder();
            }
            return this.inst;
        };
        AnimalBuilder.prototype.createSystems = function (systems) {
            var _this = this;
            var factory = Animals.Systems.Factories.SystemFactory.instance();
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
            var factory = Animals.Scales.Factories.ScaleFactory.instance();
            scales.forEach(function (item) {
                var typeScale = item.typeScale,
                    type = item.type,
                    params = item.params;
                params.type = type;
                _this.masScales[type] = factory.create(typeScale, params);
            });
            return this;
        };
        AnimalBuilder.prototype.createCommunicator = function (communocation) {
            var communicatorBuild = new Animals.Communications.Builders.CommunicatorBuilder(this.masScales);
            communocation.forEach(function (item) {
                communicatorBuild.add(item);
            });
            return communicatorBuild.build();
        };
        AnimalBuilder.prototype.createStates = function (states) {
            var _this = this;
            var factory = Animals.StateMachine.FactoryState.StateFactory.instance();
            var paramState = [];
            var state = states.state,
                links = states.links;
            state.forEach(function (item) {
                paramState[item.type] = factory.create(item.type, item.name, _this._animal, item.isEnd);
            });
            links.forEach(function (item) {
                var massStates = [];
                item.link.forEach(function (state) {
                    massStates.push(new Animals.StateMachine.Routes.Route(paramState[state.type], function (model, probability) {
                        if (state.probability > probability) {
                            return true;
                        }
                        return false;
                    }));
                });
                paramState[item.type].setRouteEngine(new Animals.StateMachine.Routes.Engines.ProbabilityRouteEngine(massStates));
            });
            return new Animals.StateMachine.StateMachine(paramState[Animals.StateMachine.FactoryState.TypesState.startLife]);
        };
        AnimalBuilder.prototype.create = function (model) {
            var name = model.name,
                systems = model.systems,
                scales = model.scales,
                communication = model.communication,
                states = model.states;
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
    }();
    Animals.AnimalBuilder = AnimalBuilder;
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Animal = function () {
        function Animal(params) {
            this.muscular = params[Animals.Systems.SystemTypes.muscular];
            this.circulatory = params[Animals.Systems.SystemTypes.circulatory];
            this.navigation = params[Animals.Systems.SystemTypes.navigation];
            this.muscular._linkToAnimal = this;
            this.circulatory._linkToAnimal = this;
            this.navigation._linkToAnimal = this;
        }
        Object.defineProperty(Animal.prototype, "muscular", {
            get: function get() {
                return this._muscular;
            },
            set: function set(param) {
                if (param) {
                    this._muscular = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "circulatory", {
            get: function get() {
                return this._circulatory;
            },
            set: function set(param) {
                if (param) {
                    this._circulatory = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "navigation", {
            get: function get() {
                return this._navigation;
            },
            set: function set(param) {
                if (param) {
                    this._navigation = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "communicator", {
            get: function get() {
                return this._communicator;
            },
            set: function set(param) {
                this._communicator = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "stateMachine", {
            get: function get() {
                return this._stateMachine;
            },
            set: function set(param) {
                this._stateMachine = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "id", {
            get: function get() {
                return this._id;
            },
            set: function set(param) {
                this._id = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "name", {
            get: function get() {
                return this._name;
            },
            set: function set(param) {
                this._name = param;
            },
            enumerable: true,
            configurable: true
        });
        Animal.prototype.moveToPoint = function (point) {};
        Animal.prototype.runLife = function () {
            console.log(this);
            this._stateMachine.run();
        };
        Animal.prototype.getCharacteristics = function () {
            var params = [{
                name: 'Скорость',
                value: 89,
                unit: 'м/с'
            }, {
                name: 'Возраст',
                value: 12,
                unit: 'лет'
            }, {
                name: 'Вес',
                value: 12,
                unit: 'кг'
            }, {
                name: 'Выносливость',
                value: 12,
                unit: 'ед.'
            }, {
                name: 'Система кровообращения',
                value: 89,
                unit: '%'
            }, {
                name: 'Система памяти',
                value: 59,
                unit: '%'
            }, {
                name: 'Система дыхания',
                value: 89,
                unit: '%'
            }];
            return {
                name: this._name,
                currentState: 'Бегу',
                param: params
            };
        };
        return Animal;
    }();
    Animals.Animal = Animal;
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        var Builders;
        (function (Builders) {
            var CommunicatorBuilder = function () {
                function CommunicatorBuilder(scales) {
                    this._scales = scales;
                    this._communicator = new Communications.Communicator();
                    this._factoryFunction = Animals.Functions.Factories.FunctionFactory.instance();
                }
                CommunicatorBuilder.prototype.add = function (param) {
                    var _this = this;
                    param.link.forEach(function (communication) {
                        var type = communication.type,
                            behavior = communication.behavior,
                            functions = communication.functions,
                            params = communication.params;
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
            }();
            Builders.CommunicatorBuilder = CommunicatorBuilder;
        })(Builders = Communications.Builders || (Communications.Builders = {}));
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        var Communicator = function () {
            function Communicator() {
                this._netLinks = [];
                this._sensitivity = 0.1;
            }
            Object.defineProperty(Communicator.prototype, "sensitivity", {
                get: function get() {
                    return this._sensitivity;
                },
                set: function set(param) {
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
                } else {
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
        }();
        Communications.Communicator = Communicator;
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        (function (BehaviorScaleTypes) {
            BehaviorScaleTypes[BehaviorScaleTypes["increase"] = 1] = "increase";
            BehaviorScaleTypes[BehaviorScaleTypes["decrease"] = 2] = "decrease";
        })(Communications.BehaviorScaleTypes || (Communications.BehaviorScaleTypes = {}));
        var BehaviorScaleTypes = Communications.BehaviorScaleTypes;
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var Factories;
        (function (Factories) {
            var FunctionFactory = function () {
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
            }();
            Factories.FunctionFactory = FunctionFactory;
        })(Factories = Functions.Factories || (Functions.Factories = {}));
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        (function (FunctionTypes) {
            FunctionTypes[FunctionTypes["line"] = 1] = "line";
            FunctionTypes[FunctionTypes["quadratic"] = 2] = "quadratic";
        })(Functions.FunctionTypes || (Functions.FunctionTypes = {}));
        var FunctionTypes = Functions.FunctionTypes;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var LineFunction = function () {
            function LineFunction(params) {
                this._coefficient = params[0] || 0;
                this._free = params[1] || 0;
            }
            Object.defineProperty(LineFunction.prototype, "coefficient", {
                get: function get() {
                    return this._coefficient;
                },
                set: function set(param) {
                    this._coefficient = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineFunction.prototype, "free", {
                get: function get() {
                    return this._free;
                },
                set: function set(param) {
                    this._free = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            LineFunction.prototype.calculate = function (param) {
                return this._coefficient * param + this._free;
            };
            return LineFunction;
        }();
        Functions.LineFunction = LineFunction;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var QuadraticFunction = function () {
            function QuadraticFunction(params) {
                this._coefficientA = params[0] || 0;
                this._coefficientB = params[1] || 0;
                this._free = params[2] || 0;
            }
            Object.defineProperty(QuadraticFunction.prototype, "coefficientA", {
                get: function get() {
                    return this._coefficientA;
                },
                set: function set(param) {
                    this._coefficientA = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadraticFunction.prototype, "coefficientB", {
                get: function get() {
                    return this._coefficientB;
                },
                set: function set(param) {
                    this._coefficientB = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadraticFunction.prototype, "free", {
                get: function get() {
                    return this._free;
                },
                set: function set(param) {
                    this._free = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            QuadraticFunction.prototype.calculate = function (param) {
                return this._coefficientA * Math.pow(param, 2) + this._coefficientB * param + this._free;
            };
            return QuadraticFunction;
        }();
        Functions.QuadraticFunction = QuadraticFunction;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var AScale = function () {
            function AScale() {}
            Object.defineProperty(AScale.prototype, "name", {
                get: function get() {
                    return this._name;
                },
                set: function set(param) {
                    this._name = param;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "min", {
                get: function get() {
                    return this._min;
                },
                set: function set(param) {
                    this._min = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "max", {
                get: function get() {
                    return this._max;
                },
                set: function set(param) {
                    this._max = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "current", {
                get: function get() {
                    return this._current;
                },
                set: function set(param) {
                    this._current = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "percent", {
                get: function get() {
                    return this._percent;
                },
                set: function set(param) {
                    this._percent = param;
                    this.getCurrentValueOnScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "type", {
                get: function get() {
                    return this._type;
                },
                set: function set(param) {
                    this._type = param;
                },
                enumerable: true,
                configurable: true
            });
            AScale.prototype.getPercentageInScale = function () {
                this._percent = (this._current - this._min) * 100 / (this._max - this._min);
            };
            AScale.prototype.getCurrentValueOnScale = function () {
                this._current = (this._max - this._min) / 100 * this._percent + this._min;
            };
            return AScale;
        }();
        Scales.AScale = AScale;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var Factories;
        (function (Factories) {
            var ScaleFactory = function () {
                function ScaleFactory() {
                    this._factories = [];
                    this._factories[Scales.ScaleTypes.system] = Animals.Scales.TypeScales.SystemScale;
                    this._factories[Scales.ScaleTypes.argument] = Animals.Scales.TypeScales.ArgumentScale;
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
                ScaleFactory.prototype.create = function (functionType, params) {
                    return new this._factories[functionType](params);
                };
                return ScaleFactory;
            }();
            Factories.ScaleFactory = ScaleFactory;
        })(Factories = Scales.Factories || (Scales.Factories = {}));
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
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
        })(Scales.ParameterScaleTypes || (Scales.ParameterScaleTypes = {}));
        var ParameterScaleTypes = Scales.ParameterScaleTypes;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        (function (ScaleTypes) {
            ScaleTypes[ScaleTypes["system"] = 0] = "system";
            ScaleTypes[ScaleTypes["argument"] = 1] = "argument";
        })(Scales.ScaleTypes || (Scales.ScaleTypes = {}));
        var ScaleTypes = Scales.ScaleTypes;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var TypeScales;
        (function (TypeScales) {
            var ArgumentScale = function (_super) {
                __extends(ArgumentScale, _super);
                function ArgumentScale(params) {
                    _super.call(this);
                    this._name = params.name || "No name";
                    this._min = params.min || 0;
                    this._max = params.max || 100;
                    this._current = params.current || this._max;
                    this._responseDelay = params.responseDelay || 1000;
                    this._type = params.type || 0;
                    this.getPercentageInScale();
                }
                Object.defineProperty(ArgumentScale.prototype, "responseDelay", {
                    get: function get() {
                        return this._responseDelay;
                    },
                    set: function set(param) {
                        this._responseDelay = param ? param : 1000;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ArgumentScale.prototype, "communicator", {
                    get: function get() {
                        return this._communicator;
                    },
                    set: function set(param) {
                        this._communicator = param;
                    },
                    enumerable: true,
                    configurable: true
                });
                ArgumentScale.prototype.trigger = function (params) {
                    var event = params > 0 ? Animals.Communications.BehaviorScaleTypes.increase : Animals.Communications.BehaviorScaleTypes.decrease;
                    var pack = {
                        behavior: event,
                        type: this._type
                    };
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
            }(Scales.AScale);
            TypeScales.ArgumentScale = ArgumentScale;
        })(TypeScales = Scales.TypeScales || (Scales.TypeScales = {}));
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var TypeScales;
        (function (TypeScales) {
            var SystemScale = function (_super) {
                __extends(SystemScale, _super);
                function SystemScale(params) {
                    _super.call(this);
                    this._name = params.name || "No name";
                    this._min = params.min || 0;
                    this._max = params.max || 100;
                    this._current = params.current || this._max;
                    this._type = params.type || 0;
                    this.getPercentageInScale();
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
            }(Scales.AScale);
            TypeScales.SystemScale = SystemScale;
        })(TypeScales = Scales.TypeScales || (Scales.TypeScales = {}));
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var Factories;
        (function (Factories) {
            var SystemFactory = function () {
                function SystemFactory() {
                    this._factories = [];
                    this._factories[Systems.SystemTypes.muscular] = Animals.Systems.TypeSystems.Muscular;
                    this._factories[Systems.SystemTypes.circulatory] = Animals.Systems.TypeSystems.Circulatory;
                    this._factories[Systems.SystemTypes.navigation] = Animals.Systems.TypeSystems.Navigation;
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
                SystemFactory.prototype.create = function (functionType, params) {
                    return new this._factories[functionType](params);
                };
                return SystemFactory;
            }();
            Factories.SystemFactory = SystemFactory;
        })(Factories = Systems.Factories || (Systems.Factories = {}));
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        (function (SystemTypes) {
            SystemTypes[SystemTypes["muscular"] = 1] = "muscular";
            SystemTypes[SystemTypes["circulatory"] = 2] = "circulatory";
            SystemTypes[SystemTypes["memory"] = 3] = "memory";
            SystemTypes[SystemTypes["navigation"] = 4] = "navigation";
        })(Systems.SystemTypes || (Systems.SystemTypes = {}));
        var SystemTypes = Systems.SystemTypes;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var TypeSystems;
        (function (TypeSystems) {
            var Circulatory = function () {
                function Circulatory(scales) {
                    this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.TypeScales.SystemScale([]);
                    ;
                    this.heartbeat = scales[Animals.Scales.ParameterScaleTypes.heartbeat];
                    this.pressure = scales[Animals.Scales.ParameterScaleTypes.pressure];
                }
                Object.defineProperty(Circulatory.prototype, "heartbeat", {
                    get: function get() {
                        return this._heartbeat;
                    },
                    set: function set(param) {
                        if (param) {
                            this._heartbeat = param;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Circulatory.prototype, "pressure", {
                    get: function get() {
                        return this._pressure;
                    },
                    set: function set(param) {
                        if (param) {
                            this._pressure = param;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Circulatory.prototype.changeHeartbeat = function (delta) {
                    this._heartbeat.change(delta);
                    this.analysis();
                };
                Circulatory.prototype.changePressure = function (delta) {
                    this._pressure.change(delta);
                    this.analysis();
                };
                Circulatory.prototype.analysis = function () {
                    this.state.analysis([]);
                };
                return Circulatory;
            }();
            TypeSystems.Circulatory = Circulatory;
        })(TypeSystems = Systems.TypeSystems || (Systems.TypeSystems = {}));
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var TypeSystems;
        (function (TypeSystems) {
            var Muscular = function () {
                function Muscular(scales) {
                    this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.TypeScales.SystemScale([]);
                    this.speed = scales[Animals.Scales.ParameterScaleTypes.speed];
                    this.weight = scales[Animals.Scales.ParameterScaleTypes.weight];
                }
                Object.defineProperty(Muscular.prototype, "speed", {
                    get: function get() {
                        return this._speed;
                    },
                    set: function set(param) {
                        if (param) {
                            this._speed = param;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Muscular.prototype, "weight", {
                    get: function get() {
                        return this._weight;
                    },
                    set: function set(param) {
                        if (param) {
                            this._weight = param;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Muscular.prototype, "currentPoint", {
                    get: function get() {
                        return this._currentPoint;
                    },
                    set: function set(param) {
                        this._currentPoint.x = param.x;
                        this._currentPoint.y = param.y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Muscular.prototype.changeSpeed = function (delta) {
                    this._speed.change(delta);
                    this.analysis();
                };
                Muscular.prototype.changeWeight = function (delta) {
                    this._weight.change(delta);
                    this.analysis();
                };
                Muscular.prototype.analysis = function () {
                    this.state.analysis([]);
                };
                return Muscular;
            }();
            TypeSystems.Muscular = Muscular;
        })(TypeSystems = Systems.TypeSystems || (Systems.TypeSystems = {}));
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var TypeSystems;
        (function (TypeSystems) {
            var Navigation = function () {
                function Navigation(scales) {
                    this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.TypeScales.SystemScale([]);
                    this.speedSavvy = scales[Animals.Scales.ParameterScaleTypes.speedSavvy];
                    this.radiusHearing = scales[Animals.Scales.ParameterScaleTypes.radiusHearing];
                    this.radiusSmell = scales[Animals.Scales.ParameterScaleTypes.radiusSmell];
                    this.radiusVision = scales[Animals.Scales.ParameterScaleTypes.radiusVision];
                    this.radiusTouch = scales[Animals.Scales.ParameterScaleTypes.radiusTouch];
                }
                Object.defineProperty(Navigation.prototype, "speedSavvy", {
                    get: function get() {
                        return this._speedSavvy;
                    },
                    set: function set(param) {
                        if (param) {
                            this._speedSavvy = param;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Navigation.prototype, "radiusVision", {
                    get: function get() {
                        return this._radiusVision;
                    },
                    set: function set(param) {
                        if (param) {
                            this._radiusVision = param;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Navigation.prototype, "radiusHearing", {
                    get: function get() {
                        return this._radiusHearing;
                    },
                    set: function set(param) {
                        if (param) {
                            this._radiusHearing = param;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Navigation.prototype, "radiusSmell", {
                    get: function get() {
                        return this._radiusSmell;
                    },
                    set: function set(param) {
                        if (param) {
                            this._radiusSmell = param;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Navigation.prototype, "radiusTouch", {
                    get: function get() {
                        return this._radiusTouch;
                    },
                    set: function set(param) {
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
                    this.state.analysis([]);
                };
                return Navigation;
            }();
            TypeSystems.Navigation = Navigation;
        })(TypeSystems = Systems.TypeSystems || (Systems.TypeSystems = {}));
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var APICore = function () {
    function APICore() {}
    APICore.instance = function () {
        if (!this.inst) {
            this.inst = new APICore();
        }
        return this.inst;
    };
    APICore.prototype.createAnimal = function (putToModel, id) {
        var factory = Animals.AnimalBuilder.instance();
        var animal = factory.create(lion);
        animal.id = id;
        return animal;
    };
    return APICore;
}();
var Map;
(function (Map_1) {
    var Map = function () {
        function Map() {}
        Map.instance = function () {
            if (!this._inst) {
                this._inst = new Map();
            }
            return this._inst;
        };
        Object.defineProperty(Map.prototype, "world", {
            get: function get() {
                return this._world;
            },
            set: function set(map) {
                if (map) {
                    this._world = map;
                    this._initializationWorld();
                } else {
                    throw new Error('World was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "obstaclesLayer", {
            set: function set(layer) {
                if (layer) {
                    this._obstaclesLayer = layer;
                } else {
                    throw new Error('Layer obstacle was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "waterLayer", {
            set: function set(layer) {
                if (layer) {
                    this._waterLayer = layer;
                } else {
                    throw new Error('Layer water was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "treeLayer", {
            set: function set(layer) {
                if (layer) {
                    this._treeLayer = layer;
                } else {
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
            this.obstaclesLayer = this._world.getLayer('obstacle');
            this.waterLayer = this._world.getLayer('water');
            this.treeLayer = this._world.getLayer('tree');
        };
        Map.prototype._getSizeMapPixel = function () {
            var sizeX = this._sizeMapTiled.width * this._sizeTiled.width;
            var sizeY = this._sizeMapTiled.height * this._sizeTiled.height;
            return cc.v2(sizeX, sizeY);
        };
        Map.prototype.convertTiledPos = function (posInPixel) {
            var x = Math.floor(posInPixel.x / this._sizeTiled.width);
            var y = Math.floor((this._sizeMapPixel.y - posInPixel.y) / this._sizeTiled.height);
            return cc.v2(x, y);
        };
        Map.prototype.convertPixelPos = function (posInTiled) {
            var x = posInTiled.x * this._sizeTiled.width + this._sizeTiled.width / 2;
            var y = this._sizeMapPixel.y - posInTiled.y * this._sizeTiled.height - this._sizeTiled.height / 2;
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
    }();
    Map_1.Map = Map;
})(Map || (Map = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine_1) {
        var StateMachine = function () {
            function StateMachine(state) {
                this._state = state;
            }
            StateMachine.prototype.run = function () {
                var _this = this;
                this._state.run().then(function () {
                    if (!_this._state.isEndPoint()) {
                        _this._state = _this._state.getNextState();
                        _this.run();
                    }
                }, function () {
                    throw new Error('Error in state... (StateMachine)');
                });
            };
            return StateMachine;
        }();
        StateMachine_1.StateMachine = StateMachine;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var States;
        (function (States) {
            var State = function () {
                function State(name, model, routeEngine, isEndPoint) {
                    if (routeEngine === void 0) {
                        routeEngine = null;
                    }
                    if (isEndPoint === void 0) {
                        isEndPoint = false;
                    }
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
                return State;
            }();
            States.State = State;
        })(States = StateMachine.States || (StateMachine.States = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var States;
        (function (States) {
            var TypesState;
            (function (TypesState) {
                var PatternState = function (_super) {
                    __extends(PatternState, _super);
                    function PatternState(name, model, routeEngine, states) {
                        if (routeEngine === void 0) {
                            routeEngine = null;
                        }
                        if (states === void 0) {
                            states = [];
                        }
                        _super.call(this, name, model, routeEngine);
                        this._states = states;
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
                }(States.State);
                TypesState.PatternState = PatternState;
            })(TypesState = States.TypesState || (States.TypesState = {}));
        })(States = StateMachine.States || (StateMachine.States = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var States;
        (function (States) {
            var TypesState;
            (function (TypesState) {
                var PrimitiveState = function (_super) {
                    __extends(PrimitiveState, _super);
                    function PrimitiveState(name, model, isEndPoint, routeEngine) {
                        if (isEndPoint === void 0) {
                            isEndPoint = false;
                        }
                        if (routeEngine === void 0) {
                            routeEngine = null;
                        }
                        _super.call(this, name, model, routeEngine, isEndPoint);
                    }
                    PrimitiveState.prototype.run = function () {
                        throw new Error('No implementation status...');
                    };
                    return PrimitiveState;
                }(States.State);
                TypesState.PrimitiveState = PrimitiveState;
            })(TypesState = States.TypesState || (States.TypesState = {}));
        })(States = StateMachine.States || (StateMachine.States = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var Routes;
        (function (Routes) {
            var Engines;
            (function (Engines) {
                var RouteEngine = function () {
                    function RouteEngine(routes, nextEngine) {
                        if (routes === void 0) {
                            routes = [];
                        }
                        if (nextEngine === void 0) {
                            nextEngine = null;
                        }
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
                }();
                Engines.RouteEngine = RouteEngine;
            })(Engines = Routes.Engines || (Routes.Engines = {}));
        })(Routes = StateMachine.Routes || (StateMachine.Routes = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var Routes;
        (function (Routes) {
            var Engines;
            (function (Engines) {
                var SimpleRouteEngine = function (_super) {
                    __extends(SimpleRouteEngine, _super);
                    function SimpleRouteEngine(routes, nextEngine) {
                        if (routes === void 0) {
                            routes = [];
                        }
                        if (nextEngine === void 0) {
                            nextEngine = null;
                        }
                        _super.call(this, routes, nextEngine);
                    }
                    SimpleRouteEngine.prototype.getRoute = function () {
                        var _this = this;
                        var routes = this._routes.filter(function (route) {
                            return route.isAvailable(_this._model);
                        });
                        return routes.length > 0 ? routes[0] : this._nextRouteEngine();
                    };
                    return SimpleRouteEngine;
                }(Engines.RouteEngine);
                Engines.SimpleRouteEngine = SimpleRouteEngine;
            })(Engines = Routes.Engines || (Routes.Engines = {}));
        })(Routes = StateMachine.Routes || (StateMachine.Routes = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var Routes;
        (function (Routes) {
            var Engines;
            (function (Engines) {
                var ProbabilityRouteEngine = function (_super) {
                    __extends(ProbabilityRouteEngine, _super);
                    function ProbabilityRouteEngine(routes, nextEngine) {
                        if (routes === void 0) {
                            routes = [];
                        }
                        if (nextEngine === void 0) {
                            nextEngine = null;
                        }
                        _super.call(this, routes, nextEngine);
                    }
                    ProbabilityRouteEngine.prototype.getRoute = function () {
                        var _this = this;
                        var probability = Math.random();
                        var routes = this._routes.filter(function (route) {
                            return route.isAvailable(_this._model, probability);
                        });
                        return routes.length > 0 ? routes[0] : this._nextRouteEngine();
                    };
                    return ProbabilityRouteEngine;
                }(Engines.RouteEngine);
                Engines.ProbabilityRouteEngine = ProbabilityRouteEngine;
            })(Engines = Routes.Engines || (Routes.Engines = {}));
        })(Routes = StateMachine.Routes || (StateMachine.Routes = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var Routes;
        (function (Routes) {
            var Route = function () {
                function Route(state, availability) {
                    this._state = state;
                    this._availability = availability;
                }
                Route.prototype.isAvailable = function (model, probability) {
                    if (probability === void 0) {
                        probability = 1.0;
                    }
                    return this._availability && this._availability(model, probability) ? this._state : null;
                };
                Route.prototype.getState = function () {
                    return this._state;
                };
                return Route;
            }();
            Routes.Route = Route;
        })(Routes = StateMachine.Routes || (StateMachine.Routes = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StatesLib;
        (function (StatesLib) {
            var StateDie = function (_super) {
                __extends(StateDie, _super);
                function StateDie(name, model, isEndPoint, routeEngine) {
                    if (isEndPoint === void 0) {
                        isEndPoint = false;
                    }
                    if (routeEngine === void 0) {
                        routeEngine = null;
                    }
                    _super.call(this, name, model, isEndPoint, routeEngine);
                }
                StateDie.prototype.run = function () {
                    var resolveFn, rejectFn;
                    var promise = new Promise(function (resolve, reject) {
                        resolveFn = resolve;
                        rejectFn = reject;
                    });
                    console.log('умер');
                    setTimeout(function () {
                        resolveFn();
                    }, 4000);
                    return promise;
                };
                return StateDie;
            }(Animals.StateMachine.States.TypesState.PrimitiveState);
            StatesLib.StateDie = StateDie;
        })(StatesLib = StateMachine.StatesLib || (StateMachine.StatesLib = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StatesLib;
        (function (StatesLib) {
            var StateRun = function (_super) {
                __extends(StateRun, _super);
                function StateRun(name, model, isEndPoint, routeEngine) {
                    if (isEndPoint === void 0) {
                        isEndPoint = false;
                    }
                    if (routeEngine === void 0) {
                        routeEngine = null;
                    }
                    _super.call(this, name, model, isEndPoint, routeEngine);
                }
                StateRun.prototype.run = function () {
                    var resolveFn, rejectFn;
                    var promise = new Promise(function (resolve, reject) {
                        resolveFn = resolve;
                        rejectFn = reject;
                    });
                    console.log('бегу');
                    this._model.muscular.changeSpeed(-0.4);
                    this._model.muscular.changeWeight(-0.5);
                    setTimeout(function () {
                        resolveFn();
                    }, 4000);
                    return promise;
                };
                return StateRun;
            }(Animals.StateMachine.States.TypesState.PrimitiveState);
            StatesLib.StateRun = StateRun;
        })(StatesLib = StateMachine.StatesLib || (StateMachine.StatesLib = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StatesLib;
        (function (StatesLib) {
            var StateStand = function (_super) {
                __extends(StateStand, _super);
                function StateStand(name, model, isEndPoint, routeEngine) {
                    if (isEndPoint === void 0) {
                        isEndPoint = false;
                    }
                    if (routeEngine === void 0) {
                        routeEngine = null;
                    }
                    _super.call(this, name, model, isEndPoint, routeEngine);
                }
                StateStand.prototype.run = function () {
                    var resolveFn, rejectFn;
                    var promise = new Promise(function (resolve, reject) {
                        resolveFn = resolve;
                        rejectFn = reject;
                    });
                    console.log('стою');
                    this._model.muscular.changeSpeed(0.5);
                    this._model.muscular.changeWeight(0.7);
                    setTimeout(function () {
                        resolveFn();
                    }, 4000);
                    return promise;
                };
                return StateStand;
            }(Animals.StateMachine.States.TypesState.PrimitiveState);
            StatesLib.StateStand = StateStand;
        })(StatesLib = StateMachine.StatesLib || (StateMachine.StatesLib = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StatesLib;
        (function (StatesLib) {
            var StateStart = function (_super) {
                __extends(StateStart, _super);
                function StateStart(name, model, isEndPoint, routeEngine) {
                    if (isEndPoint === void 0) {
                        isEndPoint = false;
                    }
                    if (routeEngine === void 0) {
                        routeEngine = null;
                    }
                    _super.call(this, name, model, isEndPoint, routeEngine);
                }
                StateStart.prototype.run = function () {
                    var resolveFn, rejectFn;
                    var promise = new Promise(function (resolve, reject) {
                        resolveFn = resolve;
                        rejectFn = reject;
                    });
                    console.log('Начал жить');
                    this._model.muscular.changeSpeed(0.001);
                    this._model.muscular.changeWeight(0.001);
                    setTimeout(function () {
                        resolveFn();
                    }, 4000);
                    return promise;
                };
                return StateStart;
            }(Animals.StateMachine.States.TypesState.PrimitiveState);
            StatesLib.StateStart = StateStart;
        })(StatesLib = StateMachine.StatesLib || (StateMachine.StatesLib = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var FactoryState;
        (function (FactoryState) {
            var StateFactory = function () {
                function StateFactory() {
                    this._factories = [];
                    this._factories[FactoryState.TypesState.startLife] = Animals.StateMachine.StatesLib.StateStart;
                    this._factories[FactoryState.TypesState.stand] = Animals.StateMachine.StatesLib.StateStand;
                    this._factories[FactoryState.TypesState.run] = Animals.StateMachine.StatesLib.StateRun;
                    this._factories[FactoryState.TypesState.die] = Animals.StateMachine.StatesLib.StateDie;
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
            }();
            FactoryState.StateFactory = StateFactory;
        })(FactoryState = StateMachine.FactoryState || (StateMachine.FactoryState = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var FactoryState;
        (function (FactoryState) {
            (function (TypesState) {
                TypesState[TypesState["startLife"] = 1] = "startLife";
                TypesState[TypesState["stand"] = 2] = "stand";
                TypesState[TypesState["run"] = 3] = "run";
                TypesState[TypesState["die"] = 4] = "die";
            })(FactoryState.TypesState || (FactoryState.TypesState = {}));
            var TypesState = FactoryState.TypesState;
        })(FactoryState = StateMachine.FactoryState || (StateMachine.FactoryState = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var lion = {
    name: 'Лев',
    systems: [{
        type: Animals.Systems.SystemTypes.muscular,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.speed }, { type: Animals.Scales.ParameterScaleTypes.speed }, { type: Animals.Scales.ParameterScaleTypes.weight }]
    }, {
        type: Animals.Systems.SystemTypes.circulatory,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.pressure }, { type: Animals.Scales.ParameterScaleTypes.heartbeat }]
    }, {
        type: Animals.Systems.SystemTypes.navigation,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.speedSavvy }, { type: Animals.Scales.ParameterScaleTypes.radiusVision }, { type: Animals.Scales.ParameterScaleTypes.radiusSmell }, { type: Animals.Scales.ParameterScaleTypes.radiusHearing }, { type: Animals.Scales.ParameterScaleTypes.radiusTouch }]
    }],
    scales: [{
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.heartbeat,
        params: {
            name: 'Сердцебиение',
            current: 9,
            min: 0,
            max: 100,
            responseDelay: 0.12
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.pressure,
        params: {
            name: 'Давление',
            current: 8,
            min: 0,
            max: 10,
            responseDelay: 0.13
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.speed,
        params: {
            name: 'Скорость',
            current: 9,
            min: 0,
            max: 100,
            responseDelay: 0.12
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.weight,
        params: {
            name: 'Вес',
            current: 8,
            min: 0,
            max: 10,
            responseDelay: 0.1
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.speedSavvy,
        params: {
            name: 'Время смекалки',
            current: 8,
            min: 0,
            max: 10,
            responseDelay: 0.1
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.radiusTouch,
        params: {
            name: 'Радиус осязания',
            current: 9,
            min: 0,
            max: 10,
            responseDelay: 0.1
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.radiusVision,
        params: {
            name: 'Радиус зрения',
            current: 40,
            min: 0,
            max: 80,
            responseDelay: 0.1
        }
    }],
    communication: [{
        type: Animals.Scales.ParameterScaleTypes.speed,
        link: [{
            type: Animals.Scales.ParameterScaleTypes.weight,
            behavior: Animals.Communications.BehaviorScaleTypes.increase,
            functions: Animals.Functions.FunctionTypes.line,
            params: [0.5, 0.18]
        }]
    }, {
        type: Animals.Scales.ParameterScaleTypes.weight,
        link: [{
            type: Animals.Scales.ParameterScaleTypes.speed,
            behavior: Animals.Communications.BehaviorScaleTypes.decrease,
            functions: Animals.Functions.FunctionTypes.line,
            params: [0.5, 0.1]
        }]
    }],
    states: {
        state: [{
            name: 'Старт',
            type: Animals.StateMachine.FactoryState.TypesState.startLife,
            isEnd: false
        }, {
            name: 'Бегу',
            type: Animals.StateMachine.FactoryState.TypesState.run,
            isEnd: false
        }, {
            name: 'Стою',
            type: Animals.StateMachine.FactoryState.TypesState.stand,
            isEnd: false
        }, {
            name: 'Умер',
            type: Animals.StateMachine.FactoryState.TypesState.die,
            isEnd: true
        }],
        links: [{
            type: Animals.StateMachine.FactoryState.TypesState.startLife,
            link: [{
                type: Animals.StateMachine.FactoryState.TypesState.run,
                probability: 0.7
            }, {
                type: Animals.StateMachine.FactoryState.TypesState.stand,
                probability: 0.7
            }, {
                type: Animals.StateMachine.FactoryState.TypesState.die,
                probability: 0.01
            }]
        }, {
            type: Animals.StateMachine.FactoryState.TypesState.stand,
            link: [{
                type: Animals.StateMachine.FactoryState.TypesState.run,
                probability: 0.7
            }, {
                type: Animals.StateMachine.FactoryState.TypesState.die,
                probability: 0.01
            }]
        }, {
            type: Animals.StateMachine.FactoryState.TypesState.run,
            link: [{
                type: Animals.StateMachine.FactoryState.TypesState.die,
                probability: 0.6
            }, {
                type: Animals.StateMachine.FactoryState.TypesState.stand,
                probability: 0.9
            }, {
                type: Animals.StateMachine.FactoryState.TypesState.run,
                probability: 0.1
            }]
        }]
    }
};
//# sourceMappingURL=build-ts.js.map