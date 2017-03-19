/**
 * Created by FIRCorp on 15.03.2017.
 */
var assert = require('assert');
function add(a) {
 return a*2;
}
describe('Closure', function () {

    it('should return 8 every time', function () {
        assert.equal(24,add(12));
    });
});