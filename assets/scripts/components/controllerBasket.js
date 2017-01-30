/**
 * Осуществляет работу с корзиной,
 * Анимации, частицы и прочее
 */
cc.Class({
    extends: cc.Component,
    
    onLoad(){
    },

    /**
     * Корзина запустилась
     */
    on(){
        this.node.active=true;
    },
    
    off(){
         this.node.active=false;  
    },

});

