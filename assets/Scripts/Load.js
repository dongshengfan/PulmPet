const i18n = require('i18n');

cc.Class({
    extends: cc.Component,

    properties: {

       //@region Load
     /*   progressBar: {
            default: null,
            type: cc.ProgressBar
        },

        loadBar:cc.Node,
       
        progressTips: {
            default: null,
            type: cc.Label
        },*/
          loadBar:cc.Node,
        textFact:{
            default: null,
            type: cc.Label
        },
       //#
     
       //@region Btn
        
        element:{
            default: [],
            type: cc.Node
        },
        _time:0,//Время задержки
        _flag:false,//Отображается либар
        
       //#

    },

    onLoad() {
        
        /**Что-то грузим музыку звуки */
        this._urls = [
            /*cc.url.raw("resources/audio/AddBall.mp3")*/
        ];
        this.progress=0;
        this._targetMap="";
        this.element=[];//массив элементов активацию которыхстот спрятать
        this.resource = null;
      //  this.progressBar.progress = 0;
        this._time=0;//Времязадержи перед прогрузки сцены
       // this._flag=false;//Используется ли бар
        this.amountFacts=0;
        this.loadFacts();
        this.elementForUpopacity=[];//массив элементов прозрачность которых стоит увеличивать
        

           
    },
    /**
     * Загрузка количества фактов
     */
    loadFacts(){
        let ls = cc.sys.localStorage;
        this.amountFacts = ls.getItem("amountFactAnimal");
    },
    /**
     * Выбирает 1 факт из базы фактов */
    _textFactFind(){
        let number= Math.floor(Math.random() * (this.amountFacts)) ;
        let name="StartPlay/LoadBar/TextFactAnimal"+(number+1).toString();
        this.textFact.textKey = i18n.t(name);
    },
    /**
     * Добавляет елементы которые необходимо отключить 
     * @param matrix массив элементов которые необходимо плавно выключить*/
    addElement(matrix){
        for(let i=0;i<matrix.length;i++){
            this.element.push(matrix[i]);
        }
    
    },
    /**
     * Добавляет элементы прохрачностькоторых стоит увеличивать
     */
    addElementForUpOpacity(matrix){
        for(let i=0;i<matrix.length;i++){
            this.elementForUpopacity.push(matrix[i]);
        }
    },
    /**
     * Добавляет то что необходимо прогузить 
     * @param matrix массив элементов для загрузки*/
    addLoad(matrix){
        
            for(let i=0;i<matrix.length;i++){
                this._urls.push(matrix[i]);
            }
        
    },
  
    /**
     * Устанавливает время задержки
     * @param amount количество секунд задержки
     */
    setTimeZaderzhka(amount){
        this._time=amount;//Врем загрузки
    },
    /**
     * Устанавливает надо лии отображать бар загрузки 
     * @param flag-true/false(показывать ли бар загрузки)
    */
  /*  setBar(flag){
        this._flag=flag;
    },*/

    /**
     * Загружает сцену по имени с настройкми. Отображение бокса снизуили нет
     * @param name Имя сцены
     */
    loadMap(name){
        
        this._targetMap=name;
      
        this._clearAll();
       //То что необходимо спрятать
        for(let i=0;i<this.element.length;i++){
             let btn=this.element[i].getComponent(cc.Button);
             if(btn){
                 btn.enabled=false;
             }
             let callBack=function () {
                if(this.element[i].opacity<11){
                   // this.element[i].opacity=0;  
                    this.element[i].active=false;  
                    this.unschedule(callBack);						 
                }
                this.element[i].opacity-=10;
             }
             this.schedule(callBack,0.001); 
                      
        }
        //то что необходимо стелать видимым
        for(let i=0;i<this.elementForUpopacity.length;i++){
             let btn=this.elementForUpopacity[i].getComponent(cc.Button);
             if(btn){
                 btn.enabled=false;
             }
             let callBack=function () {
                if(this.elementForUpopacity[i].opacity>=245){
               //     this.elementForUpopacity[i].opacity=254;  
                 //   this.elementForUpopacity[i].active=true;  
                    this.unschedule(callBack);						 
                }
                this.elementForUpopacity[i].opacity+=5;
             }
             this.schedule(callBack,0.001); 
                      
        }

        //бар стал активным 
        this.loadBar.active=true;
         this._textFactFind();
      /*  if(this._flag){
           
            this.loadBar.opacity=255;

        }else{
            this.loadBar.opacity=0;
        }*/
        //  console.log(this._urls); 
        //console.log(this.element);
      
        cc.loader.load(this._urls, this._progressCallback.bind(this), this._completeCallback.bind(this));
    },

    _clearAll() {
        for (var i = 0; i < this._urls.length; ++i) {
            var url = this._urls[i];
            cc.loader.release(url);
        }
        
    },

    _progressCallback(completedCount, totalCount, res) {
        //console.log(this);
        this.progress = completedCount / totalCount;
        this.resource = res;
        this.completedCount = completedCount;
        this.totalCount = totalCount;
    },

    _completeCallback(error, res) {

    },

    // called every frame, uncomment this function to activate update callback
    update(dt) {
        if (!this.resource) {
            return;
        }
      
        var progress = this.progress;
        if (progress >= 1) {
            this.scheduleOnce(function(){ cc.director.loadScene(this._targetMap);},this._time);//
           
            return;
        }

        if (progress < this.progress) {
            progress += dt;
        }
       
        this.progress = progress;
       // this.progressTips.textKey =" (" + this.completedCount + "/" + this.totalCount + ")";
    }
});
