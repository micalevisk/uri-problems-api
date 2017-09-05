const restify = require('restify');
const problems = require('./problems');
const PORT = process.env.PORT || 3000;

const server = restify.createServer({
  name: 'URI Problems API'
});


/* feedback das requisições
server.use((req, res, next) => {
  console.log(req.method, req.url);
  return next();
});
*/

server.use(restify.plugins.bodyParser());
// ======= end points para ~/api ======= //
server.get('api/problems', problems.get);
server.get('api/problems/:id', problems.getById);
server.post('api/problems', problems.post);
server.del('api/problems/:id', problems.delete);


server.listen(PORT, () => {
  console.log('URI Problems API is running at:', PORT);
});