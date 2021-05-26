const mysql = require('mysql2');
const express = require('express');
const path  = require('path');
const app = express();


var fs = require('fs');
var parse = require('csv-parse');
//var parse = require('csv-parse/lib/sync');


const absolute_path = __dirname.toString() + "/public";
app.use(express.urlencoded());
app.use(express.json());


var con = mysql.createConnection({
	  
	host: "localhost",
	  user: "debbido",
	  password: "debbido677357",
	database: "prototype"
	  });



//(async function () {
//	    const fileContent = await fs.readFile("/home/debbido/Desktop/prototype/annual-enterprise-survey-2019-financial-year-provisional-csv.csv"
//);
//	    const records = parse(fileContent, {columns: true});
//	    console.log(records);
//})();
//
//con.connect(function(err) {
//	  if (err) throw err;
//	  console.log("Connected!");
//});
 
var csvData=[];
fs.createReadStream("/home/debbido/Desktop/prototype/cities.csv")
    .pipe(parse({delimiter: '\n', quote: ''}))
    .on('data', function(csvrow) {
	            //console.log(csvrow);
	            //do something with csvrow
	    //i
	    var row = String(csvrow[0]);
	    console.log(typeof(csvrow));
	    var arr = row.split(",");
	    for(i = 0; i < arr.length; i++)
	    {
	//	    console.log(i);
	//	    console.log(arr[i].trim());
		    if(!isNaN(arr[i]))
		    {
			    arr[i] = parseInt(arr[i]);
		    }
		    else
		    {
			 arr[i] = arr[i].trim();

		    }
	    }
//	    var arr = row.split(",");
	  //  console.log(arr);
           csvData.push(arr);        

	           //csvData.push(row.split(","));        
//	    console.log("Row is " + row);
	                })
	                    .on('end',function() {
	                          //do something with csvData
				        console.log("CSV data is ")
	                                console.log(csvData.length);
				        console.log(csvData[0]);

				    var arr = csvData[1];

				    query = "CREATE TABLE prototype_table (";
				    var sql_type = [];

	    for(i = 0; i < arr.length; i++)
	    {
		    if(!isNaN(arr[i]))
		    {
			    if(arr[i]%1 == 0)
			    {
				    sql_type[i] = "INT(10)";
			    }
			    else
			    {
				    sql_type[i] = "FLOAT(10)";
			    }
		    }
		    else
		    {
			 sql_type[i] = "VARCHAR(30)";
		    }
		    query+= "\n" + csvData[0][i].replace('/\"/ig', "")  + " " + sql_type[i];
		    if(i == arr.length - 1)
		    {
			    query+="\n )"
		    }
		    else
		    {
			    query+=",\n"
		    }

	    }


				    
//      con.connect(function(err) {
//      if (err) throw err;
//      con.query(query, function (err, result, fields) {
//      if (err) throw err;
//	      console.log(result);
//						        });
//				    });
				    //
				    //
				   
				  

      con.connect(function(err) {
      if (err) throw err;
      for(let i = 0 ; i< 35; i++)
{
	ingest_query = ""
      ingest_query = "INSERT INTO prototype_table (" 
      pre_ingest_query = ""
      post_ingest_query = ""
	//console.log(csvData[i]);
	for(p = 0;  p < csvData[i].length; p++)
	{
		post_ingest_query += "'" + csvData[i][p] + "'";
		pre_ingest_query +=  csvData[0][p].replace('/\"/ig', "");
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

    console.log(ingest_query);
	if(i!=0)
	{

	 con.query(ingest_query, function (err, result, fields) {
      if (err) throw err;
	      //console.log(result);
	        });
	}



	}


    });

});

app.use('/static', express.static(absolute_path))
app.get('/' , function(req, res){
		res.sendFile(path.join(__dirname, '/index.html'));
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

