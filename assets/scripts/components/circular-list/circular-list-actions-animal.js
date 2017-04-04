import { CircularList } from './circular-list';

var CircularListActionsAnimal = cc.Class({
    extends: CircularList,

    properties: {
        amountVisible: 7,//количество видимых листов
    },

    settings(controllerAnimal){
        let node = controllerAnimal.node;
        let model = controllerAnimal._model;

        this.radius = node.width * 1.75;//на определенномрастоянии от животного
        if (this.radius > 150) {
            this.radius = 150;
        } else if (this.radius < 100) {
            this.radius = 100;
        }
    
        this.updatePos();
    },
});

export { CircularListActionsAnimal };