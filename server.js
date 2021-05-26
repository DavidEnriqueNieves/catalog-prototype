const mysql = require('mysql2');


var con = mysql.createConnection({
	  
	host: "localhost",
	  user: "debbido",
	  password: "debbido677357"

	  });

con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
});
 

