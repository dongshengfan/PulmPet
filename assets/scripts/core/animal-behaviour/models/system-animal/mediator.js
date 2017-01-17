/**
 * Класс централизует сообщения между системами , упрощает их общение между собой
 * 
 * @export
 * @class Mediator
 */
export class Mediator {
    /**
     * Круг общения медиатора))
     * 
     * @type {Array}  
     * @memberOf Mediator
     */
    _miniNet;
    constructor() {
        this._miniNet = [];
    }
    /**
     * Регистрирует системы в отдельную конфу/сеть (можно сделать по названию) 
     * 
     * @param {class} system отдельная система
     * 
     * @memberOf Mediator
     */
    register(system) {
            this._miniNet.push(system);
            system._miniNet = this;
    }
 
    /**
     * Публикует изменения 
     * 
     * @param {XZ} message сообщение которое публикуется
     * @param {class} from система которая публикует 
     * 
     * @memberOf Mediator
     */
    publisher(message,from) {     
        this._miniNet.forEach((item)=>{ 
            if(item!=from){
                console.log(item);
                item._update(message);      
            } 
        });            
    }
    
}