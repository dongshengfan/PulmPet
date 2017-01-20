/**
 * Класс отец систем
 * {Состояние системы в целом, впечатлительность системы}
 * @export
 * @class Systems
 */
export class Systems{
    /**
     * Процент влияния системы или впечатлительность системы
     * 
     * @type {number} процент не болше 100 не меньше 0
     * @memberOf Systems
     */
    percentageImpact; 
    /**
     * Приватная cеть в которой состоит данная система . Для влияния на других подписчиков
     * 
     * 
     * @memberOf Systems
     */
    _miniNet;
    /**
     * @typedef System
     * @type {Object} 
     * @property {number} current текущее едениц состояния
     * @property {number} min минимальное количество единиц состояния
     * @property {number} max максимальное количество единиц состояния
     * @property {number} scale шкала состояния
     */   
    /**
     * состояние системы в целом
     * @type {System} объект скорости
     */
    _system;

    constructor(){
        this._system={
            current:0,
            min:0,
            max:0,
            scale:0
        }
    }

 



    /**
     * Отдает процент прогресса на основе интервала и текущего значения
     * 
     * @param {number} current текущее значение
     * @param {number} max максимальное значение
     * @param {number} min минимальное значение
     * @returns {number} процент
     * 
     * @memberOf Systems
     */
    _getPercentageInScale(current,max,min){
        return ((current-min)*100)/(max-min);
    }
    /**
     * Отдает текущее значение по прогрессу и интервалу
     * 
     * @param {number} scale прогресс
     * @param {number} max максимальное значение
     * @param {number} min минимальное значение
     * @returns {number} текущее значение
     * 
     * @memberOf Systems
     */
    _getCurrentValueOnScale(scale,max,min){
        return (((max-min)/100)*scale)+min;
    }
    /**
     * Обновление системы на какую то часть от обновления другой системы  
     *  
     * @param {number} value дельта изменения какого-то параметра какой-то системы 
     * 
     * @memberOf Systems
     */
    _update(value){
        
    }
    /**
     * Публикует в своем сектанском круге свои изменения
     * 
     * @param {number} message дельта изменения того или иного параметра
     * 
     * @memberOf Systems
     */
    _publisher(message){     
        this._miniNet.publisher(message,this);
    }
}