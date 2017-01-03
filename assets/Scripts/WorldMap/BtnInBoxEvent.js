var BtnBox=cc.Class({
    extends: cc.Component,

    properties: {
        propagate: {
            default: false
        },

    },

    // use this for initialization
    onLoad: function () {
   
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (this.getComponent(BtnBox).propagate)
                event.stopPropagation();

        }, this.node);
       
       
      /*  this.node.on(cc.Node.EventType.TOUCH_END, function() {
            this.getComponent(TouchDragger)._endSwipe()
            
        }, this.node);*/
    },
   
});