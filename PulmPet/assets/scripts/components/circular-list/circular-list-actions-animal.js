import { CircularList } from './circular-list';

/**
 * Настраивает круглое меню животного
 * @class CircularListActionsAnimal
 * @extends CircularList
 */
var CircularListActionsAnimal = cc.Class({
    extends: CircularList,

    /**
     * Настройка меню для конкретного животного. Настраивает радиус круга.
     * @method settings
     * @param {cc.Component} controllerAnimal контроллер животного.
     */
    settings(controllerAnimal){
        let node = controllerAnimal.node;

        this.radius = node.width * 1.75;
        if (this.radius > 150) {
            this.radius = 150;
        } else if (this.radius < 100) {
            this.radius = 100;
        }

        this._refreshMenu();
    },
});

export { CircularListActionsAnimal };