/**
 * Created by FIRCorp on 04.05.2017.
 */

namespace StateMachines.States {

    /**
     * Состояние - Бежит
     * @class StateRun
     */
    export class StateRun extends State {

        /**
         * Creates an instance of StateRun.
         * @param name имя состояния
         * @param model модель животного
         * @param isEndPoint флаг заключительного состояния
         * @param routeEngine обработчик маршрутов между состояниями
         */
        constructor(name: string, model: Animals.Animal, isEndPoint: boolean = false, routeEngine: StateMachines.Routes.RouteEngine = null) {
            super(name, model, routeEngine, isEndPoint);
        }

        /**
         * Запуск состояния
         * @returns {Promise<void>}
         */
        async run(): Promise<void> {
            console.log('бегу');
            this._model.circulatory.changeHeartbeat(0.5);
             this._model.circulatory.changePressure(0.2);
            this._model.muscular.changeSpeed(-0.4);
            this._model.muscular.changeWeight(-0.5);

            console.log(this._model.navigation.A(cc.v2(8236,5900)));


            //создание новой цели для движения
            /*this.node.x=this.currentPos.x;
            this.node.y=this.currentPos.y;
            this.createEndPos();
            targ.setPosition( this.targetPos.x, this.targetPos.y);

            let list:any;
            list= this.correctPuth(this.A());//наложили фильтр сглаживания на путь до цели
            if(!list){
                return;
            }
            let endPos:any,pos:any;
            var actions:any =[];
            let time:any=0.4;
            while(list.length>0){
                pos=list.pop();
                endPos=this._map.getMapPos(pos);
                actions.push(cc.moveTo(time , endPos));

            }

            this.node.runAction(
                cc.sequence(...actions)
            );*/

            await this.mySleep(2);//Ожидание
        }
        /*
        //-Создание новой конечной точки пропитано быдло кодом
        _newPos(){
            this.targetPos=_getRandomCoordinat(this._map.sizeMap.width,this._map.sizeMap.height);
            this.targetPos=cc.v2(this.targetPos.x+this._map.worldTileSize.width/2,this.targetPos.y+this._map.worldTileSize.height/2);

        }
        //проверяем полученную точку на ряд условий
        createEndPos(){
            let param;
            do{
                this._newPos();
                param=this._map.getTilePos(this.targetPos);
                if(param.x>0&&param.y>0&&param.x<this._map.worldTileSize.width&&param.y<this._map.worldTileSize.height){
                    param=this._map.getAmountBarriier(param);
                    if(param===0){
                        break;
                    }
                }

            }while(true);
        }*/
    }
}