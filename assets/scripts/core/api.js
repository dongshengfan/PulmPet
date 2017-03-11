/**
 * Created by FIRCorp on 08.03.2017.
 */
export class API{
    static inst;
    constructor(){

    }

    static instance(){
        if(!this.inst){
            this.inst= new API();
        }
        return this.inst;
    }

    createAnimal(puthToModel){
        let model;
        return model;
    }
}