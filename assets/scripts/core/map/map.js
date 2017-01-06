
let instance = null;

export class Maps{  
    constructor() {
        if(!instance){
              instance = new Map();
        }
        return instance;
      }
}

class Map{
    constructor() {       
    }

}


