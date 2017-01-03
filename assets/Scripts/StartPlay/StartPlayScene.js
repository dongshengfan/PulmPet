

cc.Class({
    extends: cc.Component,

    properties: {
        myLoad:cc.Node, 

        pnlInfo:cc.Node,
        btnPlay:cc.Node,

        moneyAmount:cc.Label,
        starAmount:cc.Label,
       
       
       
       //@region Date
        amountFactAnimal:0,
        amountContinent:0,
      //  amountStar:0,
      //  amountMoney:0,
        amountRezhim:0,
        amountAchiv:0,
        amountAnimal:0,
       //# 
    },

    onLoad: function () {
        this._save();
        this._setting();
        
           
    },
     /**
     *Установка количества звезд и денег у игрока  
     */
    _setting(){
        let ls = cc.sys.localStorage;
        let _money = ls.getItem("money");//сколько монет
        let _star=ls.getItem("allStar");//сколько звезд вообще
        //   ls.setItem("money", 0);
        if(_money===null){
            _money=0;
            ls.setItem("money", 0);
       
        }
        if(_star===null){
            _star=0;
            ls.setItem("allStar", 0);
        }
        //console.log(_money);
        this.setAmountStarAndMoney(_star,_money);
        
    },
    _save(){
        let ls = cc.sys.localStorage;
        ls.setItem("amountAchiv", this.amountAchiv);
        ls.setItem("amountRezhim", this.amountRezhim);
        ls.setItem("amountFactAnimal", this.amountFactAnimal);
        ls.setItem("amountContinent", this.amountContinent);
        ls.setItem("amountAnimal", this.amountAnimal);
    },
    /**Устанавливает значение количества звезд и монет у игрока */
    setAmountStarAndMoney:function(star,money){
      //   cc.log(money);
        this.starAmount.string=star;
        this.moneyAmount.string=money;
    },
  
    /**Загрузка мировой карты */
    loadWorldMap:function(){
        this.myLoad.getComponent("Load").addLoad(
            [
                cc.url.raw("resources/audio/AddBall.mp3"),
                cc.url.raw("resources/audio/AddBall.mp3"),
                cc.url.raw("resources/audio/AddBall.mp3"),
                cc.url.raw("resources/audio/AddBall.mp3")
                
            ]
        );
        this.myLoad.getComponent("Load").addElement(
            [
                this.pnlInfo,
                this.btnPlay

            ]
        );      
        this.myLoad.getComponent("Load").setTimeZaderzhka(3);
       // this.myLoad.getComponent("Load").setBar(true);
       // this.myLoad.getComponent("Load").setAmountFacts(3);
        this.myLoad.getComponent("Load").loadMap('WorldMap');
    },

    
});
