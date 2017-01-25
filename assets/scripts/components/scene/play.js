const animals={
    Lion : 0,
    Mouse : 1
};

cc.Class({
    extends: cc.Component,
    
    properties: {
        arr:{
            default: [],
            type:cc.Prefab
        },
        
    },

    onLoad: function () {
        
    },

    /**
     * 
     * 
     * @param {Event} event
     */
    onCreatePrefabAnimal: function (event){        
          cc.log(event.target._name);

    },



});