import { Animal } from './animal';

export class Elephant extends Animal { 
    constructor(){
        super();
        //this.name="Слон";
        //this._maxSpeed=100;
        //this._minSpeed=20;
        this.food.init(40,0,50,0);
    //    this.identification.init(2,false,30,12);
        
    }
    
    
}