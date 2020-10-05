/*****************************************************
 *  @license MIT
 * @author Nahim Aniss
 * @version 1.0.0
 * All rights recived 2020
 * This file can't be used with out a giving license
 * ---------------------------------------------------
 * Router API manage routes, stats and history
 * all to make SPA more easy to build
 *****************************************************/
'use-strict';

const Router = (function(){
   
    /**********************************************************
     * TreeRoute with multipl child NoudeRoute for managing routes
     * This Api TreeRoute build with URL Api and Map Api
     **********************************************************/

    /**
     * Route class constructor 
     * @param {String} url
     * @param {String} method Get | Post | put | Delete
     * @param {Function} action
     * @return {Route}
     */
    const Route = function (url, method=null, action=null){
        this.url = new URL(url);
        this.methods = {};
        if(typeof method === 'string' && method !== ''){
            this.methods[method] = action;
        }
    }

    /**
     * NodeRoute class constructor
     * a nodeRoute object can have multipl childs but only one father
     * Each nodeRoute containes a route object describing the route
     * @param {String} url
     * @param {String} method
     * @param {Function} action
     * @return {NodeRoute}
     */
    const NodeRoute = function(url, method=null, action=null){
        Route.call(this, url, method, action);
        this.children = new Map();
    }

    /**
     * Tree class constructor
     * @param {String} host - the host is the origin adresse server
     * @param {String} rootMethod
     * @param {Function} rootAction
     * @return {Tree}
     */
    const Tree = function(host, rootMethod, rootAction){
        this.host = host;
        this.root = new NodeRoute(host, rootMethod, rootAction);
    }
    
    /**
     * Takes a URL and splic the pathname
     * @param {String} path
     * @return {Array}
     */
    Tree.prototype.splitPath = function(path){
        // clean pathname by removing / from the start and the end, returned string is insensitive case
        let cleanPathname = path.replace(/\/+/g,'/');
        cleanPathname = cleanPathname.replace(/^\/|\/$/g,'').toLowerCase();
        // splic the cleeanPathname
        return cleanPathname.split('/');
    }

    /**
     * Register new NodeRoute
     * @param {NodeRoute} nodeRoute - data route object
     */
    Tree.prototype.register = function ( nodeRoute ){
        // get the steps from the URL pathname
        let steps = this.splitPath(nodeRoute.url.pathname);
        // set the stating node
        let currentNode = this.root;
        // while the node exists we move forward
        while(currentNode.children.has(steps[0])){
            currentNode = currentNode.children.get(steps[0]);
            steps.shift();
        }
        // if we still have steps then
        if(steps.length){
            let pathName = '';
            // Loop through the remaning steps and create nodeRoutes with undefined route
            for(let index in steps){
                pathName = '/'+steps[index];
                // create and add nodeRoure without method and action 
                let newNode = new NodeRoute(router.host+pathName);
                currentNode.children.set(steps[index],newNode);
                currentNode = newNode;
            }
        }
        // last NodeRoute should define the method and action
        for(let key in nodeRoute.methods){
            currentNode.methods[key] = nodeRoute.methods[key];
        }
    }

    /**
     * Find NodeRoute in the Tree
     * @param {String} path pathname
     * @return {NodeRoute} NodeRoute node exists false if not
     */
    Tree.prototype.find = function(path){
        // strating node
        let currentNode = this.root;
        // Array steps
        let steps = this.splitPath(path);
        // looping on steps
        for(let index in steps){
            if(!currentNode.children.has(steps[index])){
                return false;
            }
            currentNode = currentNode.children.get(steps[index]);
        }
        // node routes with null data are not valide ones
        return currentNode.methods ? currentNode:false;
    }

    /*----------------------------------------------------------------------------------------------------*/

    /**
     * Router class constructor
     * @param {String} host - representing the url origin of the application
     * @param {String} rootMethod
     * @param {Function} rootAction
     */
    const Router = function(host, rootMethod, rootAction){
        Tree.call(this, host, rootMethod, rootAction);
    }
    Router.prototype = Object.create(Tree.prototype);

    Object.defineProperty(Router.prototype, 'constructor', {
        value : Router,
        enumerable : false,
        writable : true
    });

    // Hold the singleton instance of Router class
    let router = new Router(location.origin);

    /**
     * Subscribe new route, accessible only with GET method
     * @param {string} pathName
     * @param {string} method
     * @param {function} callback
     */
    Router.prototype.get = function (pathName, callback){
        this.register(new NodeRoute(this.host+pathName, 'get', callback));
    }

    /**
     * Get a subscrubed route by giving his path
     * @param {String} path - registred pathname
     * @return {NodeRoute} - false if the route dosen't exist
     */
    Router.prototype.getRoute = function(path){
        return this.find(path);
    }

    /**
     *  Send request to the NodeRoute path
     *  Call the action nodeRoute on resolve and display error on reject
     *  @param {NodeRoute} route - nodeRoute Object
     */
    Router.prototype.fetchRoute = function(nodeRoute, fetchMethod = 'get'){
        // Set the url we want to fectch
        // This instruction is hard coded and it will be removed 
        const urlToFetch = nodeRoute.url.origin+'/src/pages'+nodeRoute.url.pathname+'.html';
        // check if the nodeRoute support the method
        if(typeof nodeRoute.methods[fetchMethod] === 'function'){
            // send the appropriate request to the server  using the appropriate method
            http[fetchMethod](urlToFetch)
            .then(response => response.text())
            .then(content => { 
                // call the appropriate action when content is recived
                nodeRoute.methods[fetchMethod](content); 
            }).catch(err => console.log(err));
        }else{
            console.error(nodeRoute.url.pathname + " : Doesn't support "+fetchMethod+" method");
        }
    }

    /**
     * DOM manipulation
     */
    // get the bady container
    const app = document.getElementById('app');

    /**
     * Event hundler
     */
    app.addEventListener('click', changeRoute);
    window.addEventListener('popstate', backInHistory);


    /**
     * Event functions 
     */
    // these two function hundl the app state and history
    function changeRoute(event){
        event.preventDefault();
        if(event.target.getAttribute('route')){

            const selectedPath = event.target.getAttribute('route');
            const selectedNodeRoute = router.getRoute(selectedPath);
            if(selectedNodeRoute){
                // fetch route and returns response
                router.fetchRoute(selectedNodeRoute);
                // set the stateObject for the next history
                const stateObj = { path : selectedNodeRoute.url.pathname };
                // push the new state to the brawser session history stack 
                history.pushState(stateObj, '', selectedNodeRoute.url.pathname);
            }else{
                let stateObj = { path : location.pathname };
                // route the user to not found view
                history.pushState(stateObj, '', '/notFound');
                // Render not fount page
                document.body.innerHTML = `<h2>Page not found</h2><h3>404</h3>`
            }
        }
    }

    function backInHistory(e){
        if(e.state){
            let backRoute = router.getRoute(e.state.path);
            // fetch and call the action 
            router.fetchRoute(backRoute);
        }
    }

    /**
     * Debugger
     */
    Router.prototype.routeList = function(){
        return {
        routes : this.subscribedRoutes
        }
    }

    return {
        get : router.get.bind(router),
        routeList : router.routeList.bind(router),

    }

 })();
