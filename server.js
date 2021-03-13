const {createServer } = require('http');
const next = require('next');

//Creates new app instance, passing configuration object
const app = next({
    //specifies whether running in production or development mode
    //tells application to look for global environment variable called NODE_ENV
    dev: process.env.NODE_ENV !== 'production'
});
//get defined routes
const routes = require('./routes');
const handler = routes.getRequestHandler(app);

//tell app to listen on specific port: 3000
app.prepare().then(() => {
    createServer(handler).listen(3000, err => {
        if (err) throw err;
        console.log('Ready on localhost:3000');
    })
})