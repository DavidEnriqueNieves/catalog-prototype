const mysql = require('mysql2');
const express = require('express');
const path  = require('path');
const app = express();
const {spawn} = require('child_process');

var fs = require('fs');
var parse = require('csv-parse');
//var parse = require('csv-parse/lib/sync');
var csvData=[];
var reset=false;
var database_name = "prototype";
var table_name = database_name + "_table";


const absolute_path = __dirname.toString() + "/public";
app.use((express.static(__dirname + '/public')));
app.use(express.json());


var con = mysql.createConnection({

	host: "localhost",
	user: "debbido",
	password: "debbido677357",
	database: database_name
});

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

		query = "CREATE TABLE " + table_name+ " (";
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
		      ingest_query = "INSERT INTO " + table_name + " (" 
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
create_tree2();

function create_tree2()
{
 const python = spawn('python3', ['createTree.py']);


}

function create_tree()
{

	var tree = {"name" : "todo"};
	var gen_query  = "SELECT DISTINCT Genero FROM " + table_name;
	con.connect(function(err) {
			if (err) throw err;
			con.query(gen_query, function (err, gen_result, fields) {
				if (err) throw err;
				console.log(gen_result);
				console.log
				var tree = {"name" : "todo"};
				fs.truncateSync("public/data/sql_tree.json", 0, function(err) {console.log(err);});
				fs.appendFileSync('public/data/sql_tree.json', '{"name" : "todo", "_children" : [');
				for(i=0; i<gen_result.length; i++)
				{
					for (const [gen_key, gen_value] of Object.entries(gen_result[i])) 
					{
						fs.appendFileSync('public/data/sql_tree.json', '\n\t{ "name" : ' + gen_value + ', "_children" : [{');
						console.log("Key " + gen_key + " - Value " + gen_value);
						var subgen_query = "SELECT DISTINCT SubGenero FROM " + table_name + " WHERE Genero=\"" + gen_value + "\""; 
						 con.connect(function(err) {
							if (err) throw err;
								con.query(subgen_query, function (err, subgen_result, fields) {
								if (err) throw err;
								console.log(subgen_result);
								for(p = 0; p< subgen_result.length; p++)
								{
									for (const [subgen_key, subgen_value] of Object.entries(subgen_result[p])) 
									{
										fs.appendFileSync('public/data/sql_tree.json', '\n\t\t{ "name" : ' + subgen_value + ', "_children" : [{');
										var prod_query = "SELECT DISTINCT Producto FROM " + table_name + " WHERE Genero=\"" + gen_value + "\" AND SubGenero=\"" + subgen_value + "\""; 
										con.connect(function(err) {
											if (err) throw err;
											con.query(prod_query).then(prod_result => {
												for(k = 0; k < prod_result.length; k++)
												{

													for (const [prod_key, prod_value] of Object.entries(prod_result[k])) 
													{	
														//fs.appendFileSync('public/data/sql_tree.json', '\n\t\t{ "name" : ' + prod_value);
														console.log(prod_value);
													}
//												if(k == prod_result.length - 1 )
//												{
//													 fs.appendFileSync('public/data/sql_tree.json', '\n\t\t}');
//												}
//												else
//												{
//													fs.appendFileSync('public/data/sql_tree.json', '\n\t\t},');
//										}



												}
											});
										});

									}
									if(p == subgen_result.length - 1 )
									{
										 fs.appendFileSync('public/data/sql_tree.json', '\n\t\t}]}');
									}
									else
									{
										 fs.appendFileSync('public/data/sql_tree.json', '\n\t\t}]},');
									}

								}
							});
						});
					

					}

						if(i==gen_result.length - 1)
						{

							fs.appendFileSync('public/data/sql_tree.json', '\n}]\n}]}');
						}
						else
						{

							fs.appendFileSync('public/data/sql_tree.json', '\n},\n');
						}


				}
				console.log("Outerloop done");

				console.log("Tree is ");
				console.log(tree);
			});

	});
	console.log("Tree is ");
	console.log(tree);

}



app.get('/' , function(req, res){
	res.sendFile(path.join(__dirname, '/cloudtable.html'));
})

app.get('/catalog' , function(req, res){
	res.sendFile(path.join(__dirname, 'public/data/flares.json'));
})

app.get("/data", function(req, res){


	query = "SELECT * FROM " + table_name;
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

