function MetOffice() {
	var matrixVersion = 1;
	var dimension = Math.pow(2, matrixVersion);
	var tileEdgeLength = 256;
//	var baseUrl = "http://datapoint.metoffice.gov.uk/public/data/inspire/view/wmts?REQUEST=gettile&LAYER=RADAR_UK_Composite_Highres&FORMAT=image/png&TILEMATRIXSET=EPSG:29903&TILEMATRIX=EPSG:29903:" + matrixVersion;
	
	var metOfficeDataUrl = new metOfficeUrl();
	metOfficeDataUrl.tileMatrixValue = matrixVersion;

	var rows = dimension;
	var columns = dimension;
	
	this.buildImage = function() {
		var canvas = document.createElement("canvas");
		canvas.width = tileEdgeLength * columns;
		canvas.height = tileEdgeLength * rows;
		var context = canvas.getContext("2d");

		var numberOfTiles = columns * rows;
		var x, y, tileIndex = 0;
		var mapTiles = new Array();
		var mapTile;
		for (y = 0; y < rows; y++) {
			for (x = 0; x < columns; x++) {
				metOfficeDataUrl.tileRowValue = y;
				metOfficeDataUrl.tileColValue = x;
				mapTile = new Image();
				mapTile.src = metOfficeDataUrl.completeUrl();
				mapTile.crossOrigin = "anonymous";
				mapTile.onload = wrapDrawImage(mapTile, context, x, y, canvas);
				console.log("Drawing a tile originating at x:" + (x % dimension) * tileEdgeLength + " y:" + (y % dimension) * tileEdgeLength + "\t with URL:" + metOfficeDataUrl.completeUrl());
				mapTiles[tileIndex++] = mapTile;
			}
		}
		return canvas;
	}

	var wrapDrawImage = function(mapTile, context, x, y, canvas) {
		return function() {
					context.drawImage(mapTile, (x % dimension) * tileEdgeLength, (y % dimension) * tileEdgeLength);
				};
	}
}

function metOfficeUrl() {
	this.baseUrl ='http://datapoint.metoffice.gov.uk/public/data/inspire/view/wmts?';
	this.requestTileKey = 'REQUEST=';
	this.layerKey = '&LAYER=';
	this.formatKey = '&FORMAT=';
	this.tileMatrixSetKey = '&TILEMATRIXSET=';
	this.tileMatrixKey = '&TILEMATRIX=';
	this.tileRowKey = '&TILEROW=';
	this.tileColKey = '&TILECOL=';
	this.dimRunKey = '&DIM_RUN=';
	this.keyKey = '&key=';
	
	this.requestTileValue = 'gettile';
	this.layerValue = 'RADAR_UK_Composite_Highres';
	this.formatValue = 'image/png';
	this.tileMatrixSetValue = 'EPSG:29903';
	this.tileMatrixValue = '0';
	this.tileRowValue = '0';
	this.tileColValue = '0';
	this.dimRunValue = '2017-11-25T15:30:00Z';
	this.keyValue = '5b2b0c85-7f41-47a6-9b53-87f842d08ca5';
	
	this.completeUrl = function() {
		return (
			this.baseUrl +
			this.requestTileKey +
			this.requestTileValue +
			this.layerKey +
			this.layerValue +
			this.formatKey +
			this.formatValue +
			this.tileMatrixSetKey +
			this.tileMatrixSetValue +
			this.tileMatrixKey +
			(this.tileMatrixSetValue + ':' + this.tileMatrixValue) +
			this.tileRowKey +
			this.tileRowValue +
			this.tileColKey +
			this.tileColValue +
			this.dimRunKey +
			this.dimRunValue +
			this.keyKey +
			this.keyValue
		)
	}
}