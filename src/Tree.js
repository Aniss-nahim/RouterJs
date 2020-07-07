/**********************************************************
 * 
 * @license MIT
 * @author Nahim Aniss
 * @version 1.0.0
 * All rights recived 2020
 * This file can't be used with out a giving license
 * ---------------------------------------------------
 * Tree with multipl child data stuctur for managing routes
 * This Api Tree build with URL Api and Map Api
 * 
 **********************************************************/

/**
 * Node data structur 
 * A node can have multipl childs but only one father
 * Each nodeRoute containes a data object describing the route
 * The data route Object :
 * {
 *      url    : URL object,
 *      method : methode string name GET|POST|PUT|DELETE,
 *      action : callback response
 * }
 * @param {Object} data - data route object
 */
const nodeRoute = function(data){
    this.data = data;
    this.children = new Map(); // Map of nodeRoutes
}

/**
  * Tree data structur
  * @param {string} host - the host is the origin adresse server   
  */

const Tree = function(host){
    this.root = new nodeRoute({
        url : new URL(host),
        method : 'get',
        action : null
    });
}
 
 /**
 * Takes a URL and splic the pathname
 * This method is only available on the Tree Object
 * @param {String} url - a valide url
 * @return {Array} 
 */

Tree.splitPath = function(path){
    // clean pathname by removing / from the start and the end, returned string is insensitive case
    let cleanPathname = path.replace(/\/+/g,'/');
    cleanPathname = cleanPathname.replace(/^\/|\/$/g,'').toLowerCase();
    // splic the cleeanPathname
    return cleanPathname.split('/');
}

/**
 * Add new node to the Tree route structur
 * @param {Object} data - data route object
 */

Tree.prototype.add = function ( data ){
     // get the steps from the URL pathname
     let steps = Tree.splitPath(data.url.pathname);
     // set the stating node
     let currentNode = this.root;
     // while the node exists we move forward
     while(currentNode.children.has(steps[0])){
        currentNode = currentNode.children.get(steps[0]);
        steps.shift();
     }
     // if we still have steps then
     if(steps.length){
         // Loop through the remaning steps and create nodeRoutes with undefined data
         steps.forEach(function(step){
             // create and add node with null data 
             let newNode = new nodeRoute(null);
             currentNode.children.set(step,newNode);
             currentNode = newNode;
        });
        currentNode.data = data;
     }
 }

 /**
  * Find route node in the Tree route structur
  * @param {String} path - pathname
  * @return {nodeRoute} - node exists false if not
  */

Tree.prototype.find = function(path){
    // strating node
    let currentNode = this.root;
    // Array steps
    let steps = Tree.splitPath(path);
    // looping on steps
    for(index in steps){
        if(!currentNode.children.has(steps[index])){
            return false;
        }
        currentNode = currentNode.children.get(steps[index]);
    }
    // node routes with null data are not valide ones
    return currentNode.data ? currentNode:false;
}