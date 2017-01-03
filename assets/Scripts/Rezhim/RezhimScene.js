cc.Class({
    extends: cc.Component,

    properties: {
        myLoad:cc.Node,//скрипт загрузки
        pnlrezhimBox:cc.Node,//панель списка режимов
        surprize:cc.Node,//Анимированный ролик загрузки
        pnlName:cc.Node,//Окно имени сцены
    },

    // use this for initialization
    onLoad: function () {
        this.brain=false;//Думаетли сцена если да то не реагирует на нажатия если нет то реагирует
    },
    /**
     * Клик на один из режимов
     * @param event событие нажатия
     * @returns 
     */
    clikOnRezhim(event){
        if(this.brain===false){
            this.brain=true;
            let btn=event.currentTarget;
            let name=btn.name;
            let id="";
            for(let i=0;i<name.length;i++){
                if(i>5){
                    id+=name[i];
                }
            }
            id= parseInt(id); 
            var ls = cc.sys.localStorage
            ls.setItem("rezhimId", id);
            this._loadScene();

        }
    },
    /**
     * Загрузка Сцены
     */
    _loadScene(){
        this.myLoad.getComponent("Load").addLoad(
            [
                cc.url.raw("resources/audio/AddBall.mp3"),              
                
            ]
        );
        this.myLoad.getComponent("Load").addElement(
            [
                this.pnlrezhimBox,
                this.pnlName,
            ]
        ); 
        this.myLoad.getComponent("Load").addElementForUpOpacity(
            [
            
                
                this.surprize,
                

            ]
        );
        this.myLoad.getComponent("Load").setBar(true);
       
        this.myLoad.getComponent("Load").setTimeZaderzhka(1);     
        this.myLoad.getComponent("Load").loadMap('WorldMap');
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
