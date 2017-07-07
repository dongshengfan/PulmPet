cc.Class({
    extends: cc.Component,

    properties: {
        collider: {
            default: [],
            type: cc.PolygonCollider,
        },

        worldMap: cc.Node,
    },

    onLoad: function () {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: (touch, event) => {
                let touchLoc = touch.getLocation();
                let _isContinent = false;
                for (let i = 0; i < this.collider.length; i++) {
                    if (cc.Intersection.pointInPolygon(touchLoc, this.collider[i].world.points)) {
                        _isContinent = true;//Дляопреелениянажатия наконтинент
                        let myEvent = new cc.Event.EventCustom(this.collider[i].node.name, true);
                        touchLoc.x -= this.node.parent.x;
                        touchLoc.y -= this.node.parent.y;
                        myEvent.detail = {
                            point: touchLoc,
                        };
                        this.node.dispatchEvent(myEvent);
                    }
                }
                if (!_isContinent) {
                    let myEvent = new cc.Event.EventCustom('touchOnWater', true);
                    myEvent.detail = {};
                    this.node.dispatchEvent(myEvent);
                }
                return true;
            },
        }, this.node);
    },

    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },

});
