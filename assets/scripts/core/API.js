/**
 * Created by Shabanov on 12.02.2017.
 */

import { AnimalFactory } from './animal-behaviour/export-animal-behaviour';

export class API {
    constructor() {

    }

    createAnimal(json) {
        let factory = AnimalFactory.instance();
        return factory.create(json);
    }
}