
var TouchDragger = cc.Class({
    extends: cc.Component,

    properties: {
        propagate: {
            default: false
        },
        //maska:cc.Node,//маска насцене
        _startPos:null,
        _endPos:null,
        _amountPix:0,//количество пикселей
        sizeBox: 0,//РАЗМЕР
        naprav:0,//0- закрыться 1- открыться
        eps:0,//Эпсилон вычислений
        intevalDovoda:0.1,//интервал процедуры движения бокса
        stepDovoda:1,//шаг приращения бокса
        alfaBox:0,//Прозрачность бокса
      
        // ...
        
    },
    
    // use this for initialization
    onLoad: function () {
        this._setPos();
        this.node.opacity = 160;
        this.node.on(cc.Node.EventType.TOUCH_START, ()=> {            
            this.opacity = 255;
        }, this.node);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
       
       
        this.node.on(cc.Node.EventType.TOUCH_END, function() {
            this.getComponent(TouchDragger)._endSwipe()
            
        }, this.node);
    },
    onTouchMove:function(event){
         this.opacity = 255;       
            console.log(this);
            console.log(this.node);
            console.log(event);
                
            var delta = event.touch.getDelta(),
            touchDragger = this.getComponent(TouchDragger);
          //  touchDragger._setNapravlenie(delta);
           this._setNapravlenie(delta);
            touchDragger._movePos(delta);     
            touchDragger._checkPosBox();            
            if (touchDragger.propagate)
                event.stopPropagation();
    },
    /**Проверяет не зашеллибокс за грани доступного, ели зашел то ровняет его */
    _checkPosBox:function(){
         if(this.node.x<this._endPos.x-this.stepDovoda||this.node.x>this._startPos.x+this.stepDovoda){
                this._endSwipe();
                
            }
    },
    /**Движение бокса */
    _movePos:function(delta){
        if ((this._endPos.x - this.stepDovoda - this.eps) < this.node.x && (this._startPos.x + this.stepDovoda + this.eps) > this.node.x) {
            if ((this._endPos.x - this.stepDovoda - this.eps) < (this.node.x + delta.x) && (this._startPos.x + this.stepDovoda + this.eps) > (this.node.x + delta.x)) {
                if (this.node.x < (this._endPos.x - this.stepDovoda) && delta.x > 0) {

                }
                else {
                    this.node.x += delta.x;
                }
            } else {
                this._endSwipe();
            }
        }       
    },
    /**Выполняет проверку и завершает движение бокса */
    _endSwipe:function(){
        // this.flagRazresheniyMove=false;
        if( this.naprav===0){
            this._dovodim(this._startPos);
        }else{
            this._dovodim(this._endPos);           
        }
       
   },

    /**доводит окошко до нужного состояния */
    _dovodim:function(coord){
      
        let callBack=function () {
            if(this.node.x>coord.x-this.stepDovoda-this.eps&&this.node.x<coord.x+this.stepDovoda+this.eps){
                this.node.x=coord.x;
                this.unschedule(callBack);						 
            }
            
            if(coord.x>this.node.x){
                this.node.x+=this.stepDovoda;
                
            }else{
                this.node.x-=this.stepDovoda;
            }
            
        }
        this.schedule(callBack,this.intevalDovoda);
    },

    /**Определяет направление движения дляслуча горизонтального бокса*/
    _setNapravlenie:function(delta){
        if(delta.x<0){
                this.naprav=1;
            }else if(delta.x>0){
                this.naprav=0;
            }

    },
  
    /**Устанавливает начальные позиции и производит вычисление длинны */
    _setPos:function(){
        let children = this.node.children;
        let bar=children[0].children[0];
       // bar.width=this.worldMap.getComponent("WorldMapScene").sizeScreenX;
        bar.height=50;
        bar.weight=50;
        this._startPos=cc.v2(this.node.x,this.node.y);
        this._endPos=cc.v2(this.node.x-this.sizeBox,this.node.y);
        this._amountPix=Math.abs(this._endPos.x-this._startPos.x);
    },
    /**Работа с маской карты  */
    _jobMaska:function(){
    /*    let raz=this.node.x-this._startPos.x;
        if(raz>-this.eps){
        this.maska.opacity=(200*(raz))/this._amountPix;
        }*/

    },
    /**Работа с прозрачностью бокса */
    _opacityNode:function(){
       let opasity=this.alfaBox+(((255-this.alfaBox)*(this._startPos.x-this.node.x))/this._amountPix);
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