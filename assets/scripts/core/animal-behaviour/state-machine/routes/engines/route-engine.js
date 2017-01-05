import { Route } from '../route';

export class RouteEngine {
    _routes;
    _nextEngine;
    
    constructor(nextEngine, routes = []) { 
        this._routes = routes;
        this._nextEngine = nextEngine;
    }

    add(routes) {
        this._routes.push(...routes);
    }

    /**
     * @returns {Route}
     */
    getRoute() {
        throw new Error('Not implemented yet...');
    }

    setNextEngine(engine) {
        this._nextEngine = engine;
    }
    
    _nextRouteEngine() {
        if (this._nextEngine) { 
            return this._nextEngine.getRoute();
        }
        return null;
    }
}