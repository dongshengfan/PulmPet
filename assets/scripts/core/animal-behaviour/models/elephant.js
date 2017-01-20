import { Animal } from './animal';

export class Elephant extends Animal { 
    constructor(){
        super();      
        this.muscular._speed.max=30;
        this.muscular._speed.min=10;
        this.muscular._speed.current=20;
        
        this.muscular._weight.max=8000;
        this.muscular._weight.min=1000;
        this.muscular._weight.current=2000;
        
        this.circulatory._pressure.max=200;
        this.circulatory._pressure.min=40;
        this.circulatory._pressure.current=120;

        this.circulatory._heartbeat.max=100;
        this.circulatory._heartbeat.min=20;
        this.circulatory._heartbeat.current=60;
    }
    
    
}