
var TouchDragger = cc.Class({
    extends: cc.Component,

    properties: {
        propagate: {
            default: false
        },
        maska:cc.Node,//маска насцене
        _startPos:null,
        _endPos:null,
        _amountPix:0,//количество пикселей
        sizeBox:0,//ширина бокса
        naprav:0,//0- вниз 1- вверх
        eps:0,//Эпсилон вычислений
        intevalDovoda:0.1,//интервал процедуры движения бокса
        stepDovoda:1,//шаг приращения бокса
        flagRazresheniyMove:{
            default: true
        },
        alfaBox:0,//Прозрачность бокса
        // ...
        worldMap:cc.Node,//главный скрипт сцены
    },

    // use this for initialization
    onLoad: function () {
        this._setPos();
        this.node.opacity = 160;
        this.node.on(cc.Node.EventType.TOUCH_START, function() {            
            this.opacity = 255;

        }, this.node);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.opacity = 255;
            
            var delta = event.touch.getDelta();
            
            if(this.getComponent(TouchDragger).worldMap.getComponent("WorldMapScene")._chekSoJobBtn(0)&&this.getComponent(TouchDragger).flagRazresheniyMove===true){
                this.getComponent(TouchDragger)._setNapravlenie(delta);
                this.getComponent(TouchDragger)._movePos(delta);     
                this.getComponent(TouchDragger)._checkPosBox();
            }
            if (this.getComponent(TouchDragger).propagate)
                event.stopPropagation();

        }, this.node);
       
       
        this.node.on(cc.Node.EventType.TOUCH_END, function() {
            this.getComponent(TouchDragger)._endSwipe()
            
        }, this.node);
    },
    /**Проверяет не зашеллибокс за грани доступного, ели зашел то ровняет его */
    _checkPosBox:function(){
         if(this.node.y>this._endPos.y+this.stepDovoda||this.node.y<this._startPos.y-this.stepDovoda){
                this._endSwipe();
                
            }
    },
    /**Движение бокса */
    _movePos:function(delta){
        if((this._endPos.y+this.stepDovoda+this.eps)>this.node.y&& (this._startPos.y-this.stepDovoda-this.eps)<this.node.y){
            if((this._endPos.y+this.stepDovoda+this.eps)>(this.node.y+delta.y)&& (this._startPos.y-this.stepDovoda-this.eps)<(this.node.y+delta.y)){               
               if(this.node.y>(this._endPos.y-this.stepDovoda)&&delta.y>0){
                   
               }
               else{
                this.node.y += delta.y; 
               }
            }else{
                this._endSwipe();
            }
        }       
    },
    /**Выполняет проверку и завершает движение бокса */
    _endSwipe:function(){
         this.flagRazresheniyMove=false;
        if( this.naprav===0){
            this.worldMap.getComponent("WorldMapScene")._find("Map",this.worldMap.getComponent("WorldMapScene").node).getComponent(cc.ScrollView).enabled=true; 
            this._dovodim(this._startPos);
            //this.node.opacity = 160;
        }else{
            this._dovodim(this._endPos);
            this.worldMap.getComponent("WorldMapScene")._find("Map",this.worldMap.getComponent("WorldMapScene").node).getComponent(cc.ScrollView).enabled=false; 
           
        }
       
   },

    /**доводит окошко до нужного состояния */
    _dovodim:function(coord){
      
        let callBack=function () {
                if(this.node.y>coord.y-this.stepDovoda-this.eps&&this.node.y<coord.y+this.stepDovoda+this.eps){
                    this.node.y=coord.y;
                    this.flagRazresheniyMove=true;
                    this.unschedule(callBack);						 
                }
                
                if(coord.y>this.node.y){
                    this.node.y+=this.stepDovoda;
                    
                }else{
                    this.node.y-=this.stepDovoda;
                }
               // this.node.opacity=this.alfaBox+(((255-this.alfaBox)*(this.node.y-this._startPos.y))/this._amountPix);
        }
        this.schedule(callBack,this.intevalDovoda);
    },
    /**Определяет направление движения */
    _setNapravlenie:function(delta){
        if(delta.y<0){
                this.naprav=0;
            }else if(delta.y>0){
                this.naprav=1;
            }

    },
    /**Устанавливает начальные позиции и производит вычисление длинны */
    _setPos:function(){
         let children = this.node.children;
        let bar=children[0].children[0];
        bar.width=this.worldMap.getComponent("WorldMapScene").sizeScreenX;
   
        this._startPos=cc.v2(this.node.x,this.node.y);
        this._endPos=cc.v2(this.node.x,this.node.y+this.sizeBox);
        this._amountPix=this._endPos.y-this._startPos.y;
    },
    /**Работа с маской карты  */
    _jobMaska:function(){
        let raz=this.node.y-this._startPos.y;
        if(raz>-this.eps){
        this.maska.opacity=(200*(raz))/this._amountPix;
        }

    },
    /**Работа с прозрачностью бокса */
    _opacityNode:function(){
        let opasity=this.alfaBox+(((255-this.alfaBox)*(this.node.y-this._startPos.y))/this._amountPix);
        if(opasity>255){
            opasity=255;
        }
         this.node.opacity=opasity;
    },

    update:function(dt){
        this._jobMaska();
        this._opacityNode();
       
    },
});