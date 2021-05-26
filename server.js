const mysql = require('mysql2');
var fs = require('fs');
var parse = require('csv-parse');
//var parse = require('csv-parse/lib/sync');


var con = mysql.createConnection({
	  
	host: "localhost",
	  user: "debbido",
	  password: "debbido677357"

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
		    console.log(i);
		    console.log(arr[i].trim());
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
	    console.log(arr);
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

				    query = "CREATE TABLE prototype (";
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

				    console.log("query is " + query);
				    
      con.connect(function(err) {
      if (err) throw err;
      con.query(query, function (err, result, fields) {
      if (err) throw err;
	      console.log(result);
						        });
				    });


	                                    });
