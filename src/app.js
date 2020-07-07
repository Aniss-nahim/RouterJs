
// import route from 'router';

route.get('/about', function(res) { render(res); });

route.get('/home', function(res) { render(res); });

route.get('/foo', function(res) { render(res); });


window.onload = function(){
    route.watch();
}

