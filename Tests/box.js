/**
 * Created by FIRCorp on 15.03.2017.
 */

var assert = require('assert');
//var ModuleBox = require('../assets/scripts/components/boxes/box-samples/box');
//
var Core = require('../PulmPet/assets/scripts/build-ts');



describe('navigation', () => {
    describe('Проверка роботоспособности поиска пути', () => {

        it('Проверка на наличие системы навигации', () => {
            var factori= Core.instance();//ядро
            var lion=factori.createAnimal('lion',0);//лев

            assert.equal(true,lion._navigation!=null);
        });

        it('Проверка наличия шкалы реакции системы навигации намоделе лев', () => {
            var factori= Core.instance();//ядро
            var lion=factori.createAnimal('lion',0);//лев
            var navigation= lion._navigation;

            assert.equal(true,navigation._speedSavvy!=null);
        });
    });
});

describe('muscular', () => {
    describe('Проверка роботоспособности мускул', () => {

        it('Проверка на наличие системы мускулаторной активности', () => {
            var factori= Core.instance();//ядро
            var lion=factori.createAnimal('lion',0);//лев

            assert.equal(true,lion._muscular!=null);
        });

        it('Проверка наличия шкалы скорости системы мускул на моделе лев', () => {
            var factori= Core.instance();//ядро
            var lion=factori.createAnimal('lion',0);//лев
            var muscular= lion._muscular;

            assert.equal(true,muscular._speed!=null);
        });
        it('Проверка наличия шкалы веса системы мускул на моделе лев', () => {
            var factori= Core.instance();//ядро
            var lion=factori.createAnimal('lion',0);//лев
            var muscular= lion._muscular;

            assert.equal(true,muscular._weight!=null);
        });
    });
});

describe('circulatory', () => {
    describe('Проверка роботоспособности кровиностной системы в целом', () => {

        it('Проверка на наличие кровиностной системы ', () => {
            var factori= Core.instance();//ядро
            var lion=factori.createAnimal('lion',0);//лев

            assert.equal(true,lion._circulatory!=null);
        });

        it('Проверка наличия шкалы давления в кровиностной системе на моделе лев', () => {
            var factori= Core.instance();//ядро
            var lion=factori.createAnimal('lion',0);//лев
            var muscular= lion._circulatory;

            assert.equal(true,muscular._pressure!=null);
        });
        it('Проверка наличия шкалы сердцебиения в кровиностной системе на моделе лев', () => {
            var factori= Core.instance();//ядро
            var lion=factori.createAnimal('lion',0);//лев
            var muscular= lion._circulatory;

            assert.equal(true,muscular._heartbeat!=null);
        });
    });
});

describe('animal', () => {
    describe('Проверка роботоспособности функции возврата характеристик', () => {

        it('Проверка работоспособности отправки характеристик в моделе лев', () => {
            var factori= Core.instance();//ядро
            var lion=factori.createAnimal('lion',0);//лев

            var characteristic= lion.getCharacteristics();

            assert.equal("Лев",characteristic.name);
            assert.equal("Старт",characteristic.currentState);
            assert.equal(10,characteristic.param.length);
        });
    });
});