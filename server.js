const mysql = require('mysql2');
const express = require('express');
const path  = require('path');
const app = express();


var fs = require('fs');
var parse = require('csv-parse');
//var parse = require('csv-parse/lib/sync');
var csvData=[];
var reset=false;


const absolute_path = __dirname.toString() + "/public";
app.use((express.static(__dirname + '/public')));
app.use(express.json());


var con = mysql.createConnection({

	host: "localhost",
	user: "debbido",
	password: "debbido677357",
	database: "prototype"
});

var database_name = "prototype";
function ingest()
{
fs.createReadStream("/home/debbido/Desktop/prototype/public/data/listadoSWD.csv")
	.pipe(parse({delimiter: '\n', quote: ''}))
	.on('data', function(csvrow) {
		//console.log(csvrow);
		//do something with csvrow
		//i
		var row = String(csvrow[0]);
		var arr = row.split(",");
		for(i = 0; i < arr.length; i++)
		{
			if(!isNaN(arr[i]))
			{
				arr[i] = parseInt(arr[i]);
			}
			else
			{
				arr[i] = arr[i].trim();
			}
		}
		csvData.push(arr);        
	})
	.on('end',function() {
		//do something with csvData
		var arr = csvData[1];

		query = "CREATE TABLE prototype_table (";
		var sql_type = [];

		for(i = 0; i < arr.length; i++)
		{
			sql_type[i] = "VARCHAR(100)";
			query+= "\n" + csvData[0][i]  + " " + sql_type[i];
			if(i == arr.length - 1)
			{
				query+="\n )"
			}
			else
			{
				query+=",\n"
			}

		}


		console.log(query);
		con.connect(function(err) {
			if (err) throw err;
			con.query(query, function (err, result, fields) {
				if (err) throw err;
				console.log(result);
			});
		});


		      con.connect(function(err) {
		      if (err) throw err;
		      for(let i = 0 ; i<csvData.length; i++)
		{
			ingest_query = ""
		      ingest_query = "INSERT INTO prototype_table (" 
		      pre_ingest_query = ""
		      post_ingest_query = ""
			for(p = 0;  p < csvData[i].length; p++)
			{
				var adder = csvData[i][p]
				if(Number.isNaN(csvData[i][p]))
				{
					adder = " ";
				}
				post_ingest_query += "'" + adder + "'";
				pre_ingest_query +=  csvData[0][p];
				if(p< csvData[i].length - 1)
				{
					pre_ingest_query+=",";
		                        post_ingest_query+=",";
				}
				else
				{
					pre_ingest_query+=")";
					post_ingest_query+=")";
				}
			}
			ingest_query = ingest_query + pre_ingest_query + " VALUES (" + post_ingest_query;
		
			if(i!=0)
			{
			 con.query(ingest_query, function (err, result, fields) {
		      if (err) throw err;

			      console.log(result);
				 console.log(ingest_query);
			        });
			}
		
		
		
			}
		
		
		    });
		
	});
}

if(reset==true)
{
	ingest();
}





app.get('/' , function(req, res){
	res.sendFile(path.join(__dirname, '/cloudtable.html'));
})

app.get('/catalog' , function(req, res){
	res.sendFile(path.join(__dirname, 'public/data/flares.json'));
})

app.get("/data", function(req, res){


	query = "SELECT * FROM prototype_table";
	con.connect(function(err) {
		if (err) throw err;
		con.query(query, function (err, result, fields) {
			if (err) throw err;
			console.log(result);
			res.send(result);

		});
	});

});

app.listen(3000);

