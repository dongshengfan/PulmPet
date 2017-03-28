/**
 * Created by FIRCorp on 15.03.2017.
 */
var cc = require('engine');
var assert = require('assert');
var ModuleBox = require('../assets/scripts/components/boxes/box-samples/box');
var Box = ModuleBox.Box;

describe('ClassBox', () => {
    describe('Проверка роботоспособности переключения состояний', () => {

        it('Должен вернуть 0', () => {
            assert.equal(0, Box._movement.toClose);
        });
        it('Должен вернуть 1', () => {
            assert.equal(0, Box._movement.toOpen);
        });
    });
});