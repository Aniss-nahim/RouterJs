/*****************************************************
 * 
 * @license MIT
 * @author Nahim Aniss
 * @version 1.0.0
 * All rights recived 2020
 * This file can't be used with out a giving license
 * ---------------------------------------------------
 * Http API for sending request using fetch Api
 * 
 *****************************************************/

const http = {
    /**
     * Send get request
     * @param {String} url - request url
     * @return {Promise} 
     */
    get : async function(url){
       const response = await fetch(url);
       if(response.status === 200){
           return response;
       }

       return Promise.reject('Get requiest failed !');
    },

    /**
     * Send Post request
     * @param {String} url - request url
     *  * @param {Object} data - data sended with the request
     * @return {Promise} 
     */
    post : async function(url,data){
        const response = await fetch(url,{
            method : 'POST',
            body : JSON.stringify(data),
            headers : {
                'content-type' : 'application/json',
            }
        });
        // Object created
        if(response.status === 201){
            return response;
        }
        // reject when faild request
        return Promise.reject('Post requiest failed !');
    },

    /**
     * Send Put request
     * @param {String} url - request url
     * @param {Object} data - data sended with the request
     * @return {Promise} 
     */
    put : async function(url,data){
        const response = await fetch(url,{
            method : 'put',
            body : JSON.stringify(data),
            headers : {
                'content-type' : 'application/json',
            }
        });
        // Object created
        if(response.status === 200){
            return response;
        }
        // reject when faild request
        return Promise.reject('Put requiest failed !');
    },

    /**
     * Send Delete request
     * @param {String} url - request url
     * @return {Promise} 
     */
    delete : async function(url){
        const response = await fetch(url,{
            method : 'delete',
            headers : {
                'content-type' : 'application/json',
            }
        });
        // Object created
        if(response.status === 204){
            return response.json();
        }
        // reject when faild request
        return Promise.reject('Delete requiest failed !');
    }
}