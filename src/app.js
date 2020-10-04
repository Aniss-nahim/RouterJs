
// import Router from 'Routerr';

 // display content to the page
 function render(content){
    let layout = document.getElementById('app-content');
    layout.innerHTML = content;
}


Router.get('/about', function(res) { render(res); });

Router.get('/home', function(res) { render(res); });

Router.get('/foo', function(res) { render(res); });

