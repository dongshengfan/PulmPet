/**
 * Created by FIRCorp on 02.05.2017.
 */
namespace Animals.StateMachine {

    /**
     * Состояние - Запустился
     * @class StateDie
     */
    export class StateStart extends State {

        /**
         * Creates an instance of StateStart.
         * @param name имя состояния
         * @param model модель животного
         * @param isEndPoint флаг заключительного состояния
         * @param routeEngine обработчик маршрутов между состояниями
         */
        constructor(name: string, model: Animal, isEndPoint: boolean = false, routeEngine: Animals.StateMachine.RouteEngine = null) {
            super(name, model, routeEngine,isEndPoint);
        }

        /**
         * Запуск состояния
         * @returns any
         * @param next
         */
        run(next:any): any {
            /* let resolveFn: any, rejectFn: any;

             var promise:any = new Promise((resolve, reject) => {
             resolveFn = resolve;
             rejectFn = reject;
             });*/
            console.log('Начал жить');

            /*this._model.circulatory.changeHeartbeat(0.001);
             this._model.circulatory.changePressure(0.001);*/
            this._model.muscular.changeSpeed(0.001);
            this._model.muscular.changeWeight(0.001);
            let k=0;
            for(let i=0;i<10000000;i++){
                k+=1;
            }
            next.finishState();
            // setTimeout(() => { resolveFn(); }, 4000);
            //return promise;
           // setTimeout(() => { next.finishState(); }, 4000)
        }
    }
}