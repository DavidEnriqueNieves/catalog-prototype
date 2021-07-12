var gridOptions = {
	columnDefs: [
		{ 
			field: 'Checkout', 
			cellRenderer: 'TotalValueRenderer', 
			cellRendererParams: {
//				clicked: function(e) {
//					alert(`${e}` + " added to cart");
//				}
			},
			minWidth: 150
		},
		{ field: 'ItemNumber', filter: 'agTextColumnFilter' },
		{ field: 'ALU', filter: 'agTextColumnFilter' },

		{ field: 'Attr', filter: 'agTextColumnFilter' },
		{ field: 'Genero', filter: 'agTextColumnFilter' },
		{ field: 'SubGenero', filter: 'agTextColumnFilter' },
		{ field: 'Producto', filter: 'agTextColumnFilter' },
		{ field: 'Distribuidora', filter: 'agTextColumnFilter', cellRenderer: function(params) {
			var distribLinks = {"Serafin" : "https://www.serafinwholesalepr.com/"};
			return '<a href=\"' + distribLinks[params.value]+ '\" target="_blank">'+ params.value+'</a>'
		}}



	],

	defaultColDef: {
		flex: 1,
		minWidth: 100,
		resizable: true,
		floatingFilter: true,
	},
	components: {
		btnCellRenderer: BtnCellRenderer
	}
};


function checkout(data)
{
	alert("Data is " + String(data));
}

function checkoutCellRenderer(params)
{
       this.eGui = document.createElement('div');

	 params.$scope.ageClicked = ageClicked;
	 this.eGui.innerHTML = `
         <span>
             <span class="my-value"></span>
             <button class="btn-simple">Push For Total</button>
         </span>
      `;



}
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



function BtnCellRenderer() {}

BtnCellRenderer.prototype.init = function(params) {
	this.params = params;

	this.eGui = document.createElement('button');
	this.eGui.innerHTML = 'Cart';

	this.btnClickedHandler = this.btnClickedHandler.bind(this);
	this.eGui.addEventListener('click', this.btnClickedHandler);
}

BtnCellRenderer.prototype.getGui = function() {
	return this.eGui;
}

BtnCellRenderer.prototype.destroy = function() {
	this.eGui.removeEventListener('click', this.btnClickedHandler);
}

BtnCellRenderer.prototype.btnClickedHandler = function(event) {
	this.params.clicked(this.params.value);
}

function updateTable(prod)
{

	console.log("Updating table!");
	$.ajax({
		url: 'http://localhost:3000/data2',
		type: 'GET',
		dataType: 'json',
		data : {"prod" : prod},
		success: function(data) {


		}

	});

	//$('#data_table').DataTable().ajax.reload();
	console.log("Success!");
	addItems(2);

}


class TotalValueRenderer {
  // gets called once before the renderer is used
  init(params) {
    // create the cell
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `
          <span>
              <span class="my-value"></span>
              <button class="btn-simple">Push For Total</button>
          </span>
       `;

    // get references to the elements we want
    this.eButton = this.eGui.querySelector('.btn-simple');
    this.eValue = this.eGui.querySelector('.my-value');

    // set value into cell
    this.cellValue = this.getValueToDisplay(params);
    this.eValue.innerHTML = this.cellValue;

    // add event listener to button
    this.eventListener = () => alert(`${this.cellValue} medals won!`);
    this.eButton.addEventListener('click', this.eventListener);
  }

  getGui() {
    return this.eGui;
  }

  // gets called whenever the cell refreshes
  refresh(params) {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
    this.eValue.innerHTML = this.cellValue;

    // return true to tell the grid we refreshed successfully
    return true;
  }

  // gets called when the cell is removed from the grid
  destroy() {
    // do cleanup, remove event listener from button
    if (this.eButton) {
      // check that the button element exists as destroy() can be called before getGui()
      this.eButton.removeEventListener('click', this.eventListener);
    }
  }

  getValueToDisplay(params) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}










































