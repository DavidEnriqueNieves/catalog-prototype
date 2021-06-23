var gridOptions = {
	  columnDefs: [
		      { field: 'ItemNumber', filter: true },
		      { field: 'ALU', filter: 'agSetColumnFilter' },

		      { field: 'Attr', filter: 'agNumberColumnFilter' },
		      { field: 'Genero', filter: 'agNumberColumnFilter' },
 { field: 'SubGenero', filter: 'agNumberColumnFilter' },
 { field: 'Producto', filter: 'agNumberColumnFilter' },
 { field: 'Distribuidora', filter: 'agNumberColumnFilter' }



		    ],

	  defaultColDef: {
		      flex: 1,
		      minWidth: 100,
		      resizable: true,
		      floatingFilter: true,
		    },
};

	  var gridDiv = document.querySelector('#myGrid');
	  new agGrid.Grid(gridDiv, gridOptions);

	  agGrid
	    .simpleHttpRequest({
		    url: 'http://localhost:3000/currData',
		        })
	    .then(function (data) {
		          gridOptions.api.setRowData(data);
		        });


function clearData() {
	  gridOptions.api.setRowData([]);
}


function addItems(addIndex) {
	  clearData();
	    agGrid.simpleHttpRequest({
		    url: 'http://localhost:3000/currData',
		        })
	    .then(function (data) {
		          gridOptions.api.setRowData(data);
		        });

	 newItems = [];
	  var res = gridOptions.api.applyTransaction({
		      add: newItems,
		      addIndex: addIndex,
		    });
	  printResult(res);
}


function printResult(res) {
	  console.log('---------------------------------------');
	  if (res.add) {
		      res.add.forEach(function (rowNode) {
			            console.log('Added Row Node', rowNode);
			          });
		    }
	  if (res.remove) {
		      res.remove.forEach(function (rowNode) {
			            console.log('Removed Row Node', rowNode);
			          });
		    }
	  if (res.update) {
		      res.update.forEach(function (rowNode) {
			            console.log('Updated Row Node', rowNode);
			          });
		    }
}
