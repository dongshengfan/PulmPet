import { Box, Movement } from './Box';

var TouchDragger = cc.Class({
    extends: Box,

    properties: {
    },
    
    onTouchMove: function (event) { 
        this.opacity = 255;            
        var delta = event.touch.getDelta(); 

        this._setMovement(delta)._moveBox(delta)._checkBoxPosition();
        if (this.propagate)
            event.stopPropagation();
    },

    onTouchStart: function (event) { 
         this.opacity = 255;
    },

    onTouchEnd: function (event) { 
        this._endSwipe()
    },

    /**Проверяет не зашеллибокс за грани доступного, ели зашел то ровняет его */
    _checkBoxPosition:function(){
        if(this.node.y>this._endPos.y+this.stepDovoda||this.node.y<this._startPos.y-this.stepDovoda){
            this._endSwipe();
        }
        return this;
    },

    /**Движение бокса */
    _moveBox:function(delta){
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
        return this;
    },

    /**Выполняет проверку и завершает движение бокса */
    _endSwipe:function(){
        // this.flagRazresheniyMove=false;
        if( this.naprav === Movement.toClose){
            this._dovodim(this._startPos);
        }else{
            this._dovodim(this._endPos);           
        }
   },

    /**доводит окошко до нужного состояния */
    _dovodim:function(coord){
        let callBack = () => {
            if(this.node.y>coord.y-this.stepDovoda-this.eps&&this.node.y<coord.y+this.stepDovoda+this.eps){
                this.node.y=coord.y;
                this.unschedule(callBack);						 
            }
            
            if(coord.y>this.node.y){
                this.node.y+=this.stepDovoda;
                
            }else{
                this.node.y-=this.stepDovoda;
            }
            
        }
        this.schedule(callBack,this.intevalDovoda);
    },

    /**Определяет направление движения дляслуча горизонтального бокса*/
    _setMovement: function (delta) {
        this.naprav = delta.y < 0 ? Movement.toClose : Movement.toOpen;
        return this;
    },
  
    /**Устанавливает начальные позиции и производит вычисление длинны */
    _setPosition:function(){
        let children = this.node.children;
        let bar=children[0].children[0];
       // bar.width=this.worldMap.getComponent("WorldMapScene").sizeScreenX;
        bar.height=50;
        bar.weight=50;
        this._startPos=cc.v2(this.node.x,this.node.y);
        this._endPos=cc.v2(this.node.x,this.node.y+this.sizeBox);
        this._amountPix=Math.abs(this._endPos.y-this._startPos.y);
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
        this._opacityNode();
    },
});