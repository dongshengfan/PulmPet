import {APICore} from '../../core/api-core';
var ControllerAnimal=cc.Class({
    extends:cc.Component,
    
    properties: {
        _model:null,
        _id:null,
        manadger:cc.Node,
    },

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },  

    onTouchStart(event){
        // cc.log('меня заметили мне наждо показаться ему во всей красе!');
        this.node.parent.parent.getComponent('play').onAnimalClickStart(this._id);

    },

    onTouchMove(event){
        // cc.log('Отменя что-то хотят');
        var delta = event.touch.getDelta();
        this.node.x+=delta.x;
        this.node.y+=delta.y;
        this.manadger.active=false;
    },

    onTouchEnd(event){
        // cc.log('отпустили(');
    },

    vizibleManadger(){
        this.manadger.active=!this.manadger.active;
    },
    /**
     * сборка животного
     */
    create(json){
        let API=APICore.instance();
        this._model=API.createAnimal(json);
        let leng=this.node.parent.parent.getComponent('play')._massNodeAnimal.length;
        this._id=leng;
        this.node.parent.parent.getComponent('play')._massNodeAnimal.push(this.node);
        this.node.parent.parent.getComponent('play')._massAnimal.push(this._model);
        this._model.run();
        this.node.parent.parent.getComponent('play').onAnimalClickStart(this._id);
    },


   
});