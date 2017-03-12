/**
 * Created by FIRCorp on 19.02.2017.
 */


/**
 * Создает цель для движения на карте не являющуюся препятствием
 * @returns {cc.Vec2} координата цели для движения
 */
/**getNewPointInMap(): cc.Vec2 {
    let point: any;
    do {
        point = _getRandomCoordinat(this._sizeMapPixel.x, this._sizeMapPixel.y);
        if (!this.isCheсkObstacle(this.convertTiledPos(point))) {
            break;
        }
    } while (true);
    return point;
}*/

function  _getRandomInt(min:any, max:any):any {
    return Math.floor(Math.random() * (max - min)) + min;
}

function  _getRandomCoordinat(maxPosx:any,maxPosy:any):any{
    return cc.v2(_getRandomInt(0,maxPosx),_getRandomInt(0,maxPosy));
}
/*
 _animal.publish({
 behavior: Animals.Communications.Factorys.BehaviorScaleTypes.increase,
 type: Animals.Scales.Factorys.ParameterScaleTypes.speed
 }, 0.8);*/