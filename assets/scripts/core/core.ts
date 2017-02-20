/**
 * Created by FIRCorp on 19.02.2017.
 */
let factoryF=Animal.Function.Factory.FunctionFactory.instance();
let fu = factoryF.create(0,[]);
fu.free=9;
console.log(fu.free);

let factoryS=Animal.Scale.Factory.ScaleFactory.instance();
let sc = factoryS.create(0,{max:90});
sc.max=100;
console.log(sc);