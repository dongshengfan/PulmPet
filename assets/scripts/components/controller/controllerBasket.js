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
        this.node.active=true
        this.jobWithOpacity(240,1);
    },
    
    /**
     * выключение корзины
     */
    off(){
        this.jobWithOpacity(10,1);  
    },

    /**
     * Реакция корзины на выброшеное в неё животное
     */
    onReactionToAnimal(){
        
    },

    /**
     * Работает с прозрачностью этой корзины 
     * 
     * @param {any} opacity нужно достич этой прозрачности
     * @param {any} time за столько секунд
     */
    jobWithOpacity(opacity,time){
        let intevalIncrements=time/Math.abs(this.node.opacity-opacity);
        this.unschedule(this.callBackOpacity);
        this.callBackOpacity = () => {
            if (this.node.opacity===opacity) {
                if(this.node.opacity<125) this.node.active=false;
                this.unschedule(this.callBackOpacity);
            }
            if (opacity > this.node.opacity) {
                this.node.opacity+=1;
            } else {
                this.node.opacity-=1;
            }
        }
        this.schedule(this.callBackOpacity, intevalIncrements);
    },

});

