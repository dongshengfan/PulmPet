cc.Class({
    extends: cc.Component,

    properties: {
        collider: {
            default: [],
            type: cc.PolygonCollider,
        },

       

        worldMap:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
       cc.director.getCollisionManager().enabled = true;
       // cc.director.getCollisionManager().enabledDebugDraw = true;

        cc.eventManager.addListener({
            
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: (touch, event) => {
                var touchLoc = touch.getLocation();
               
                for(let i=0;i<this.collider.length;i++){
                    if (cc.Intersection.pointInPolygon(touchLoc, this.collider[i].world.points)) {
                      //  if(Math.abs(event.touch.getLocationY()-touchLoc.y)<10&&Math.abs(event.touch.getLocationX()-touchLoc.x)<10){
                        
                      
                         this.worldMap.getComponent("WorldMapScene").clikMap(event.currentTarget,touchLoc,i);
                        
                        
                    }
                }

                return true;
            },
        }, this.node);
    },
    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
 
    // },
});
