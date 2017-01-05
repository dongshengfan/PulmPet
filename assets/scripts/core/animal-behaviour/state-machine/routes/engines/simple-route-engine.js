import { RouteEngine } from './route-engine';

export class SimpleRouteEngine extends RouteEngine { 
    constructor(nextEngine, routes = []) { 
        super(nextEngine, routes);
    }

    getRoute() { 
        return this._routes[0];
    }
}