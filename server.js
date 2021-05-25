const mariadb = require('mariadb');
const pool = mariadb.createPool({
	     host: 'localhost', 
	     user:'root', 
	     password: 'debbido677357',
	     connectionLimit: 5
});
