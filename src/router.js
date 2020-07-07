/*****************************************************
 * 
 * @license MIT
 * @author Nahim Aniss
 * @version 1.0.0
 * All rights recived 2020
 * This file can't be used with out a giving license
 * ---------------------------------------------------
 * Router API manage routes and satats and making 
 * SPA more easy to build
 *****************************************************/

/**
 * Router Object Definition
 * @param {string} host - representing the url origin of the application 
 */

const Router = function(host){
    this.tree = new Tree(host);
}

/**
 *  Send request to the nodeRoute path
 *  Call the action nodeRoute or resolve and display error on reject
 *  This function is only available in the Router Object
 *  @param {nodeRoute} route - nodeRoute Object
 */

Router.fetchRoute = function(route){
    // Set the url we want to fectch
    // This instruction is hard coded and it will be removed 
    // when the back-end is build
    const urlToFetch = route.data.url.origin+'/src/pages'+route.data.url.pathname+'.html';

    // send the appropriate request to the server  using the appropriate method
    http[route.data.method](urlToFetch)
    .then(response => response.text())
    .then(content => { 
        // call the appropriate action when content is recived
        route.data.action(content); 
    }).catch(err => console.log(err));
}

// Creating instance of Router
let route = new Router('http://127.0.0.1:5500/');

/**
 * Subscribe new route, accessible only with GET request
 * @param {pathName , callback}
 */

Router.prototype.get = function (pathName, callback){
    this.tree.add({
        url    : new URL(this.tree.root.data.url.origin + pathName),
        method : 'get',
        action : callback
    });
}

/**
 * Get a subscrubed route by giving his path
 * @param {String} path - registred pathname
 * @return {nodeRoute} - false if the route dosen't exist
 */

Router.prototype.getRoute = function(path){
    return this.tree.find(path);
}

/**
 *  The watch method handels the routing process 
 *  getRoute then fetchRoute + showContent
 *  and keeps track of the histoy state
 *  if the route dosen't exist it will display NOT FOUND page
 */
Router.prototype.watch = function(){
    // get the bady container
    let app = document.getElementById('app');
    // store the current instace route ( can be avoid with arrow function )
    const self = this;
    // Event delegation
    app.addEventListener('click', function(e){
        e.preventDefault();
        // check if the clicked element has a route attribute
        if(e.target.getAttribute('route')){
            // get the selected path
            const selectedPath = e.target.getAttribute('route');
            // get the appropiate nodeRoute of the selected path
            const selectedRoute = self.getRoute(selectedPath);
            //console.log(self.getRoute(selectedPath));
            if(selectedRoute){
                // fetch route and returns response
                Router.fetchRoute(selectedRoute);
                // set the stateObject for the next history
                const stateObj = { path : selectedRoute.data.url.pathname };
                // push the new state to the brawser session history stack 
                history.pushState(stateObj, '', selectedRoute.data.url.pathname);
            }else{
                let stateObj = { path : location.pathname };
                // route the user to not found view
                history.pushState(stateObj, '', '/notFound');
                // Render not fount page
                document.body.innerHTML = `<h2>Page not found</h2><h3>404</h3>`
            }
        }
    });
}

/**
 * For the back button of the brawsor's window
 */
window.addEventListener('popstate', function(e){
    if(e.state){
        // find the route
        let backRoute = route.getRoute(e.state.path);
        // fetch and call the action 
        Router.fetchRoute(backRoute);
    }else{
        // back to the original when state is null
        //console.log(event.state);
        console.log(history);
    }
})

/**
 * Debugger
 */
Router.prototype.routeList = function(){
    return {
       routes : this.subscribedRoutes
    }
}
// display content to the page
function render(content){
    let layout = document.getElementById('app-content');
    layout.innerHTML = content;
}