'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CircularListActionsAnimal = undefined;

var _circularList = require('./circular-list');

/**
 * Настраивает круглое меню животного
 * @class CircularListActionsAnimal
 * @extends CircularList
 */
var CircularListActionsAnimal = cc.Class({
    extends: _circularList.CircularList,

    /**
     * Настройка меню для конкретного животного. Настраивает радиус круга.
     * @method settings
     * @param {cc.Component} controllerAnimal контроллер животного.
     */
    settings: function settings(controllerAnimal) {
        var node = controllerAnimal.node;

        this.radius = node.width * 1.75;
        if (this.radius > 150) {
            this.radius = 150;
        } else if (this.radius < 100) {
            this.radius = 100;
        }

        this._refreshMenu();
    }
});

exports.CircularListActionsAnimal = CircularListActionsAnimal;