import {Animal, Graph, Elephant, Lion, Zebra, Mouse, Hyena} from './animal-behaviour/animal-behaviour';

var animal = new Elephant();
var a=animal;
console.log(a);
animal.scaleAgeActs();
var b=animal;
console.log(b);
animal.scaleSpeedActs();
var c=animal;
animal.scaleTimeToSleepActs();
var d=animal;
animal.scaleWeightActs();
console.log(c);
console.log(d);
console.log(animal);
