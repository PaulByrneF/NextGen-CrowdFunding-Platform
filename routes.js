const routes = require('next-routes')(); // second set of parantheses. First set returns function and second invokes that function.

// Route user to create Campaign Page
routes.add('/campaigns/new', '/campaigns/new')

//arg[0] - Pattern = /campaigns/wildcard - To find wildcard use :'variable'
//arg[1] - What Component to show from pages directory
routes.add('/campaigns/:address', '/campaigns/show')
routes.add('/campaigns/:address/requests', '/campaigns/requests/index')
routes.add('/campaigns/:address/requests/new', '/campaigns/requests/new')

//Exports object containing helpers that allow users to navigate around application.
module.exports = routes;