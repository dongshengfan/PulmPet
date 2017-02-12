import { lionParams } from './lion-params';
import { API } from  './API';
let facade = new API();
let lion = facade.createAnimal(lionParams);
lion.run();
console.log(lion);
