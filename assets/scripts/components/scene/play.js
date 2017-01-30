
cc.Class({
    extends: cc.Component,
    
    properties: {
        textState:cc.Label,
        
        
    },

    onLoad() {
        
    },

    setText(str){
        this.textState.string=str;
    },
    



});