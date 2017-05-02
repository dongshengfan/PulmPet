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
        AnimalBuilder.prototype.create = function (model) {
            var systems = model.systems,
                scales = model.scales,
                communication = model.communication;
            this.masScales = [];
            this.masSystems = [];
            var communicator = this.createScales(scales).createSystems(systems).createCommunicator(communication);
            var animal = new Animals.Animal(this.masSystems);
            animal.communicator = communicator;
            return animal;
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
        }
        Object.defineProperty(Animal.prototype, "muscular", {
            set: function set(param) {
                if (param) {
                    this._muscular = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "circulatory", {
            set: function set(param) {
                if (param) {
                    this._circulatory = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "navigation", {
            set: function set(param) {
                if (param) {
                    this._navigation = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "communicator", {
            set: function set(param) {
                this._communicator = param;
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
        Animal.prototype.moveToPoint = function (point) {};
        Animal.prototype.getCharacteristics = function () {
            return {
                name: 'Животное',
                currentState: 'Бегу',
                param: [{
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
                }]
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
                    var event = Math.sign(params) ? Animals.Communications.BehaviorScaleTypes.increase : Animals.Communications.BehaviorScaleTypes.decrease;
                    var pack = {
                        behavior: event,
                        type: this._type
                    };
                    this.communicator.publish(pack, params);
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
var lion = {
    systems: [{
        type: Animals.Systems.SystemTypes.muscular,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.speed }, { type: Animals.Scales.ParameterScaleTypes.speed }, { type: Animals.Scales.ParameterScaleTypes.weight }]
    }, {
        type: Animals.Systems.SystemTypes.circulatory,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.pressure }, { type: Animals.Scales.ParameterScaleTypes.heartbeat }]
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
    }]
};
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
//# sourceMappingURL=build-ts.js.map