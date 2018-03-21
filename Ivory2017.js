/*******************************/
/********  1. MAP  *************/
/*******************************/
//{
//Map with start-bounding box and context-menu:
var map = L.map('map', {
		minZoom: 3,
		maxBounds: [[-90, -180], [90, 180]],
		maxBoundsViscosity: 1,
		worldCopyJump: true,
		contextmenu: true,
		contextmenuWidth: 140,
		contextmenuItems: [{
				text: 'Show coordinates',
				callback: showCoordinates
			}, {
				text: 'Center map here',
				callback: centerMap
			}, '-', {
				text: 'Zoom in',
				icon: 'https://zebris.cloud/geoserver/www/LeafletLib/images/zoom-in.png',
				callback: zoomIn
			}, {
				text: 'Zoom out',
				icon: 'https://zebris.cloud/geoserver/www/LeafletLib/images/zoom-out.png',
				callback: zoomOut
			}
		]
	}).fitBounds([[7.607541397477437, -5.624099634796304], [10.541716872427033, -1.7484363452010563]]);

/*******************************/
/****  2.1. Leaflet Photo  *****/
/*******************************/

/*******************************/
/****  2.1. Leaflet Photo  *****/
/*******************************/

var photoLayer = L.Photo.Cluster().on('click', function (evt) {
		var photo = evt.layer.photo,
			template = '<img src="{url}"/></a><p>{caption}</p>';

		if (photo.video && (!!document.createElement('video').canPlayType('video/mp4; codecs=avc1.42E01E,mp4a.40.2'))) {

			template = '<video autoplay controls poster="{url}"><source src="{video}" type="video/mp4"/></video>';

		}; 

		evt.layer.bindPopup(L.Util.template(template, photo), {

			className: 'leaflet-popup-photo',

			minWidth: 400

		}).openPopup();

	});

	reqwest({

		url: 'https://picasaweb.google.com/data/feed/api/user/118196887774002693676/albumid/6052628080819524545?alt=json-in-script',

		type: 'jsonp',

		success: function (data) {

			var photos = [];

			data = data.feed.entry;
			for (var i = 0; i < data.length; i++) {

				var photo = data[i];

				if (photo['georss$where']) {

					var pos = photo['georss$where']['gml$Point']['gml$pos']['$t'].split(' ');

					photos.push({

						lat: pos[0],

						lng: pos[1],

						url: photo['media$group']['media$content'][0].url,

						caption: photo['media$group']['media$description']['$t'],

						thumbnail: photo['media$group']['media$thumbnail'][0].url,

						video: (photo['media$group']['media$content'][1] ? photo['media$group']['media$content'][1].url : null) 

					});

				};

			}		

			photoLayer.add(photos).addTo(map);

			map.fitBounds(photoLayer.getBounds());

		}

	});

/*** End**/



/*** End**/

//}

/*******************************/
/********  2. BASEMAPS  ********/
/*******************************/
//{
/***** 1. Base Maps ************/
//{
/** Esri WorldTopoMap: **/
var esriTopo = L.esri.basemapLayer("Topographic", {
		noWrap: true,
		zIndex: 0
	});

/** Esri WorldImagery **/
//Add both to get images and labels:
var esriImages = L.esri.basemapLayer("Imagery", {
		noWrap: true,
		zIndex: 0
	});
var esriImagesLabels = L.esri.basemapLayer("ImageryLabels", {
		noWrap: true,
		zIndex: 0
	});

/** Esri NatGeoWorldMap **/
var esriNatGeo = L.esri.basemapLayer("NationalGeographic", {
		noWrap: true,
		zIndex: 0
	});

/** Open Street Maps: **/
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.TileLayer(osmUrl, {
		minZoom: 1,
		maxZoom: 18,
		noWrap: true,
		zIndex: 0,
		attribution: osmAttrib
	});
//}
/***** 2. Satellite Images *****/
//{
/**Landsat 8 (from 2015) **/
var esriLSUrl1 = "https://landsat2.arcgis.com/arcgis/rest/services/Landsat8_Views/ImageServer";
var esriLSAttrib1 = "Esri Landsat Service";
var esriLS1 = L.esri.imageMapLayer({
		url: esriLSUrl1,
		position: 'back',
		pane: 'tilePane',
		attribution: esriLSAttrib1,
		zIndex: 0,
		noWrap: true
	});

/**Normalized Difference Moisture Index **/
var renderingRule2 = {
	"rasterFunction": "Normalized Difference Moisture Index Colorized",
};
var esriLS2 = L.esri.imageMapLayer({
		url: esriLSUrl1,
		position: 'back',
		pane: 'tilePane',
		attribution: esriLSAttrib1,
		zIndex: 0,
		noWrap: true,
		renderingRule: renderingRule2
	});

/** ESRI Landsat True color 15 m **/
var esriLSUrl3 = "https://landsat2.arcgis.com/arcgis/rest/services/Landsat8_PanSharpened/ImageServer";
var esriLS3 = L.esri.imageMapLayer({
		url: esriLSUrl3,
		position: 'back',
		pane: 'tilePane',
		attribution: esriLSAttrib1,
		zIndex: 0,
		noWrap: true
	});

/** Normalized Burn Ratio **/
var renderingRule4 = {
	"rasterFunction": "NBR Raw",
};
var esriLS4 = L.esri.imageMapLayer({
		url: esriLSUrl1,
		position: 'back',
		pane: 'tilePane',
		attribution: esriLSAttrib1,
		noWrap: true,
		zIndex: 0,
		renderingRule: renderingRule4
	});

/** NDVI: **/
var renderingRule5 = {
	"rasterFunction": "NDVI Colorized",
};
var esriLS5 = L.esri.imageMapLayer({
		url: esriLSUrl1,
		position: 'back',
		pane: 'tilePane',
		attribution: esriLSAttrib1,
		noWrap: true,
		zIndex: 0,
		renderingRule: renderingRule5
	});


var listLS = new Array();
listLS.push(esriLS1, esriLS2, esriLS3, esriLS4, esriLS5);


//}
/***** CHANGE BASE LAYER ********/
//{
var baseMap = esriTopo;
function SetBaseMap(layer) {
	if (baseMap == null)
		window.alert("nulL");
	map.removeLayer(baseMap);
	map.addLayer(layer);
	showWaitCursor(layer);
	baseMap = layer;

	//Old method (baseLayerChange):

	//2nd layer for labels:
	map.removeLayer(esriImagesLabels);

	landsatActive = false;
	modisActive = false;

	//For MODIS-Layer:
	if (baseMap == modisLayerObject) {
		modisActive = true;
	} else if (IsLS(baseMap)) {
		//window.alert("Landsat");
		landsatActive = true;

		lastLSLayer = baseMap;

		//Zoom in, no data for low zoom levels:
		if (map.getZoom() < 10)
			map.setZoom(10);

	} else if (baseMap == esriImages) {
		//Also add layer for labels:
		esriImagesLabels.addTo(map);
		wasLandsat = false;
	} else {
		wasLandsat = false;
	}
	showSlider();
}

//Save the last used Landsat-Layer:
var lastLSLayer = esriLS1;

//Is given layer a Landsat-layer ?
function IsLS(layer) {
	var result = false;
	for (var i = 0; i < listLS.length; i++) {
		if (listLS[i] == layer) {
			result = true;
		}
	}

	return result;
}
//}
//}




/*******************************/
/********  3. CONTROLS  ********/
/*******************************/
//{
/***** a. Layer Control ************/
//{
//Add or remove layer:
function LayerControl(checkBox, layer) {
	if (checkBox.checked) {
		map.addLayer(layer);
		showWaitCursor(layer);

		//2 special layers for Ivory:
		if (layer == layerLandcover) {
			var legendIMG = "Landcover:<br>";
			legendIMG += "<img id='legendLC' src='https://zebris.cloud/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image%2Fpng&WIDTH=20&HEIGHT=20&LAYER=zebris:ivorynew-LandcoverIvoryWGS&STYLE=ivorylandcover'>";
			document.getElementById("legendLandcover").innerHTML = legendIMG;
		}

		if ((layer == layer2017) || (layer == layer2018))
		{
			var legendIMG = "Burned Areas 2017/2018<br>";
			legendIMG += "<img id='legend2016' src='https://zebris.cloud/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image%2Fpng&WIDTH=20&HEIGHT=20&LAYER=zebris:ivorylive-SentinelLandsat_2017&STYLE=ivory1718'>";
			document.getElementById("legend1718").innerHTML = legendIMG;
		}

		if ((layer == modisFires) || (layer == viirsFires)) {
			modisFiresActive = true;
			showSlider();
		}
	} else {
		map.removeLayer(layer);

		//2 special layers for Ivory:
		if (layer == layerLandcover) {
			document.getElementById("legendLandcover").innerHTML = "";
		}

		if ((layer == layer2017) || (layer == layer2018))
		{
			document.getElementById("legend1718").innerHTML = "";
		}


		if ((layer == modisFires) || (layer == viirsFires)) {
			modisFiresActive = false;
			showSlider();
		}
	}
}
//}
/***** b. Context Menü ************/
//{
//Status of popup and sidebar:
var popupIsOpen = false;
var sidebarIsOpen = false;

//Functions for context-menu:
function showCoordinates(e) {
	alert("Latitude: " + e.latlng.lat + "\r\n" + "Longitude: " + e.latlng.lng);
}

function centerMap(e) {
	map.panTo(e.latlng);
}

function zoomIn(e) {
	map.zoomIn();
}

function zoomOut(e) {
	map.zoomOut();
}

function GetInfos(e) {
	GetInfo(e);
}
//}
/***** c. Zoom ************/
//{
//Zoom-Level changed:
function zoomChange(e) {
	var zoom = map.getZoom();
	//document.title = "Zoom: " + zoom + ", wasLandsat=" + wasLandsat + ", landsatActive=" + landsatActive;

	//Landsat only available on high zoom-levels:
	if ((zoom < 10) && (landsatActive)) {
		//window.alert("Deactivating Landsat");
		wasLandsat = true;
		SetBaseMap(modisLayerObject);
	}

	//Restore Landsat ?
	if ((zoom >= 10) && (wasLandsat)) {
		wasLandsat = false;
		SetBaseMap(lastLSLayer);
	}

	//window.alert(map.getZoom());
}
map.on('zoomend', zoomChange);
//}
/***** d. Popup ************/
//{
//Hide slider when opening popup:
function popupOpen(e) {
	//window.alert("open");
	popupIsOpen = true;
	hideSlider();
}
map.on('popupopen', popupOpen);

//Show slider again ?
function popupClose(e) {
	//window.alert("close");
	popupIsOpen = false;
	if (!sidebarIsOpen)
		showSlider();
}
map.on('popupclose', popupClose);
//}
/***** e. Sidebar ************/
//{
//Sidebar:
var sidebar = L.control.sidebar('sidebar').addTo(map);
sidebar.on('opening', sideBarOpen);
sidebar.on('closing', sideBarClose);

function sideBarOpen() {
	//alert("open");
	sidebarIsOpen = true;
	hideSlider();
}

function sideBarClose() {
	//alert("close");
	sidebarIsOpen = false;
	if (!popupIsOpen)
		showSlider();
}
//}
/***** f. Leaflet Conrols ************/
//{
//Maßstab:
L.control.scale({
	imperial: false,
	maxWidth: 200,
	position: 'bottomright'
}).addTo(map);

//Tool for measures:
var measureControl = new L.Control.Measure({
		primaryLengthUnit: 'meters',
		secondaryLengthUnit: 'kilometers',
		primaryAreaUnit: 'hectares',
		secondaryAreaUnit: undefined,
		decPoint: '.',
		thousandsSep: ','
	});
measureControl.addTo(map);
//}
/***** g. Hourglass ************/
//{
//Turn mouse into Hourglass during the layer is loading:
function showWaitCursor(layer)
{
	//document.body.className = 'wait';
	//layer.on('load', function () {
	//	document.body.classList.remove("wait");
	//});
}
//}
//}

/*******************************/
/********  4. TIMESLIDER  ******/
/*******************************/
//{

/***** a. Time Helper Funcitons ************/
//{
//Add method to Date-object:
Date.prototype.yyyymmdd = function () {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
	var dd = this.getDate().toString();
	return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]); // padding
};

//Get as YYYY-MM-DD:
function getDayString(day) {
	return day.yyyymmdd();
}
//}

/***** b. Set Up Time ************/
//{
//Day set in slider:
var modisDay;
//Start with today:
var today = new Date();
modisDay = new Date(today.getTime());

//Get Year for list:
var start = new Date(today.getFullYear(), 0, 1);
document.getElementById('yearlist').value = today.getFullYear();
//Get DOY for slider-value:
var doy = today.getTime() - start.getTime();
doy = doy / 1000; //s
doy = doy / 60; //m
doy = doy / 60; //h
doy = doy / 24; //days
doy = Math.floor(doy); //round to lower number
//Skip last doy to get one day before today (=full image):
//doy = doy + 1;
//Set to january:
modisDay.setMonth(0);
//set doy (>31 = next months):
modisDay.setDate(doy);
//}

/***** c. Slider Helper Functions ************/
//{
//Year changed:
function YearChanged() {
	//Set to 1.1. in the new year:
	$("#day-slider").slider("value", 1);
}

//Hide slider (for popups):
function hideSlider() {
	var mydiv = document.getElementById('day-panel');
	mydiv.style.display = (mydiv.style.display = 'none');
}

//Show MODIS-Box and list in it ?
function showSlider() {
	var mydiv = document.getElementById('day-panel');
	var mydiv2 = document.getElementById('layerList');
	var label2 = document.getElementById('label2');

	if ((modisActive) || (modisFiresActive) || (landsatActive)) {
		if ((!popupIsOpen) && (!sidebarIsOpen)) {
			//Show box:
			mydiv.style.display = (mydiv.style.display = 'block');

			//Show list ?
			if (modisActive) {
				mydiv2.style.display = (mydiv2.style.display = 'block');
				label2.style.display = (label2.style.display = 'none');
			} else {
				mydiv2.style.display = (mydiv2.style.display = 'none');
				label2.style.display = (label2.style.display = 'block');
			}
		}
	}

	if ((!modisActive) && (!modisFiresActive) && (!landsatActive)) {
		//Hide box:
		mydiv.style.display = (mydiv.style.display = 'none');
	}

	setModisLayer();
}


//}

/***** d. MODIS ************/
//{


//Start and end for Landsat:
var lsDate1 = null;
var lsDate2 = null;
//MODIS:
var modisLayerObject = null;
//For slider-status:
var modisActive = false;
var modisFiresActive = false;
var landsatActive = false;
var wasLandsat = false;

var sliderMax = 366 * 2;

//Update MODIS-background-layer:
function setModisLayer() {
	var modisDate = getDayString(modisDay);

	//Get Layer-name from list:
	var modisLayer = 'ATReal';
	var list = document.getElementById("MODISLayer");
	if (list != null)
		modisLayer = list.options[list.selectedIndex].value;

	//Special layers with 2 steps per day:
	//(Change nothing if neither Landsat nor MODIS is activated)
	var doubleMax = false;
	var position = $("#day-slider").slider("option", "value");
	//Refresh first or sec. image per day:
	var sliderSwitch = position % 2;
	if ((modisLayer == "ATReal") || (modisLayer == "ATFalse")) {
		doubleMax = true;
	}

	//Switch to 366 if Landsat is active:
	if ((!modisActive) && (landsatActive)) {
		doubleMax = false;
	}

	//Switch to 366 if only MODIS-fires are active:
	if ((!modisActive) && (modisFiresActive)) {
		doubleMax = false;
	}

	//Change to special layer ?
	if (doubleMax) {
		if (sliderMax != 366 * 2) {
			//Change max:
			$("#day-slider").slider("option", "max", 366 * 2);
			sliderMax = 366 * 2;

			//Change position:
			position = position * 2;
			$("#day-slider").slider("option", "value", position);

			//Modulo always = 0 because of *2 before:
			sliderSwitch = 0;
		}
	} else {
		//Back to normal layer ?
		if (sliderMax != 366) {
			//Change max:
			$("#day-slider").slider("option", "max", 366);
			sliderMax = 366;

			//Change position:
			position = Math.floor((position + sliderSwitch) / 2);
			$("#day-slider").slider("option", "value", position);
		}
	}

	//Set source for special layers:
	if (modisLayer == "ATReal") {
		//First Terra, then Aqua:
		if (sliderSwitch == 1)
			modisLayer = "MODIS_Terra_CorrectedReflectance_TrueColor";
		else if (sliderSwitch == 0)
			modisLayer = "MODIS_Aqua_CorrectedReflectance_TrueColor";
	} else if (modisLayer == "ATFalse") {
		//First Terra, then Aqua:
		if (sliderSwitch == 1)
			modisLayer = "MODIS_Terra_CorrectedReflectance_Bands721";
		else if (sliderSwitch == 0)
			modisLayer = "MODIS_Aqua_CorrectedReflectance_Bands721";
	}

	//Build URLs for MODIS-layer:
	var modisMatrixSet = 'GoogleMapsCompatible_Level9';
	var nativeZoom = 9;

	var modisUrl = 'https://map1{s}.vis.earthdata.nasa.gov/wmts-webmerc/' + modisLayer + '/default/' + modisDate + '/' + modisMatrixSet + '/{z}/{y}/{x}.jpg';
	var modisAttrib = '<a href="https://wiki.earthdata.nasa.gov/display/GIBS">NASA EOSDIS GIBS</a>';

	if (modisLayerObject == null) {
		//Create new object:
		modisLayerObject = new L.TileLayer(modisUrl, {
				minZoom: 1,
				maxZoom: 18,
				maxNativeZoom: nativeZoom,
				zIndex: 0,
				tileSize: 256,
				noWrap: true,
				bounds: [[-89.9999, -179.9999], [89.9999, 179.9999]],
				attribution: modisAttrib
			});
	} else {
		//Only refresh some options:
		modisLayerObject.setUrl(modisUrl);
		modisLayerObject.options.maxNativeZoom = nativeZoom;
	}

	//Update label:
	var dateStr = "Date: " + modisDate;
	if (sliderMax == 366 * 2) {
		if (sliderSwitch == 1)
			dateStr += " (Morning)";
		else if (sliderSwitch == 0)
			dateStr += " (Noon)";
	}



	//SetSliderLabel:
	$("#day-label").html(dateStr);
	if (landsatActive) {
		//Show Landsat-dates in slider-label:
		$("#label2").html("LS: " + lsDate1.toLocaleDateString() + " - " + lsDate2.toLocaleDateString()); //setLandsatLabel
	} else {
		$("#label2").html(""); //setLandsatLabel
	}
}

//Slider for MODIS:
$("#day-slider").slider({
	value: doy * 2, //Starting with Terra/Aqua-layer!
	min: 1,
	max: sliderMax, //366: 31.12. for leap-years, 1.1. next year otherwise
	step: 1,
	change: function (event, ui) {
		//Calculate current DOY:
		var now = new Date();
		var start = new Date(now.getFullYear(), 0, 0);
		var diff = now - start;
		var oneDay = 1000 * 60 * 60 * 24;
		var nowDOY = Math.floor(diff / oneDay);

		//Get year:
		var year = 2015;
		var list = document.getElementById("yearlist");
		if (list != null)
			year = list.options[list.selectedIndex].value;

		//1.1. + 1h
		var newDay = new Date(year, 0, 1, 1, 0, 0);
		//Add days:
		var sliderPos = ui.value;
		if (sliderMax == 366 * 2) {
			sliderPos = Math.round(sliderPos / 2);
		}

		//Prevent day in future:
		if (year == now.getFullYear())
			if (sliderPos > nowDOY)
				sliderPos = nowDOY;

		newDay.setDate(sliderPos);
		modisDay = newDay;

		//Refresh Landsat-layer:
		lsDate1 = new Date(year, 0, 1, 1, 0, 0);
		lsDate2 = new Date(year, 0, 1, 1, 0, 0);

		if (year < 2015) {
			lsDate1.setDate(sliderPos - 100);
			lsDate2.setDate(sliderPos + 100);
		} else {
			lsDate1.setDate(sliderPos - 16);
			lsDate2.setDate(sliderPos + 1); //Needed to get images from that day, maybe because 00:00 is meant ?
		}

		for(var i=0; i<5; i++){
			//listLS[0] = esriLS1 etc.
			listLS[i].setTimeRange(lsDate1, lsDate2);
			showWaitCursor(listLS[i]);
		}

		//set Fire Layers:
		var modisDate = getDayString(modisDay);
		viirsFires.setUrl("https://firms.modaps.eosdis.nasa.gov/wms/?REQUEST=GetMap&TIME=" + modisDate);
		modisFires.setUrl("https://firms.modaps.eosdis.nasa.gov/wms/?REQUEST=GetMap&TIME=" + modisDate);

		//Refresh layer-objects:
		setModisLayer();

	}
});

//}

//}

/*******************************/
/********  5. LAYERS  **********/
/*******************************/
//{
/***** 3. Burned areas Landsat/Sentinel *****/
//{

var layer2017 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
			layers: 'zebris:ivorylive-SentinelLandsat_2017',
			tileSize: 256,
			format: 'image/png',
			styles: 'ivory1718',
			transparent: true,
			version: '1.1.0',
			noWrap: true,
			zIndex: 21,
			attribution: "Zebris"
		});
map.addLayer(layer2017);
showWaitCursor(layer2017);

var layer2018 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
			layers: 'zebris:ivorylive-SentinelLandsat_2018',
			tileSize: 256,
			format: 'image/png',
			styles: 'ivory1718',
			transparent: true,
			version: '1.1.0',
			noWrap: true,
			zIndex: 21,
			attribution: "Zebris"
		});
map.addLayer(layer2018);
showWaitCursor(layer2018);

//}
/***** 7.Protected Areas ********/
//{

var layer1 = L.tileLayer.wms("https://zebris.cloud/geoserver/zebris/wms", {
			layers: 'zebris:ivorylive-SubsetsIvory',
			tileSize: 256,
			format: 'image/png',
			styles: 'legendProtected',
			transparent: true,
			version: '1.1.0',
			noWrap: true,
			zIndex: 10,
			attribution: "Zebris"
		});
map.addLayer(layer1);
showWaitCursor(layer1);

//Landcover-layer for Ivory:
var layerLandcover = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorynew-LandcoverIvoryWGS',
		tileSize: 256,
		format: 'image/png',
		styles: 'ivorylandcover',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});


//Hillshade:
var layerHillshade = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {layers: 'zebris:ivorylive-Hillshade',tileSize:256,format: 'image/png',transparent: true,version: '1.1.0',noWrap:true,zIndex: 11,opacity:0.8,attribution: "Zebris"});

//}

/***** 8.ECMWF ********/
//{
var ecmwfAttrib = 'ECMWF';
//Biomass burning aerosol optical depth at 550 nm
var ecmwf1 = L.tileLayer.wms("https://apps.ecmwf.int/wms/?token=public", {
				layers: 'composition_bbaod550',
				format: 'image/png',
				transparent: true,
	          	maxZoom: 18,
	          	crs: L.CRS.EPSG4326,
	          	noWrap: true,
	          	zIndex: 19,
				attribution: ecmwfAttrib
	});

//Carbon Monoxide at surface
var ecmwf2 = L.tileLayer.wms("https://apps.ecmwf.int/wms/?token=public", {
				layers: 'composition_co_surface',
				format: 'image/png',
				transparent: true,
	          	maxZoom: 18,
	          	crs: L.CRS.EPSG4326,
	          	noWrap: true,
	          	zIndex: 19,
				attribution: ecmwfAttrib
	});

//Fine particulate matter (PM2.5)
var ecmwf3 = L.tileLayer.wms("https://apps.ecmwf.int/wms/?token=public", {
				layers: 'composition_pm2p5',
				format: 'image/png',
				transparent: true,
	          	maxZoom: 18,
	          	crs: L.CRS.EPSG4326,
	          	noWrap: true,
	          	zIndex: 19,
				attribution: ecmwfAttrib
	});


//Coarse Particulate matter (PM 10)
var ecmwf4 = L.tileLayer.wms("https://apps.ecmwf.int/wms/?token=public", {
				layers: 'composition_pm10',
				format: 'image/png',
				transparent: true,
	          	maxZoom: 18,
	          	crs: L.CRS.EPSG4326,
	          	noWrap: true,
	          	zIndex: 19,
				attribution: ecmwfAttrib
	});

//}
/***** 9.Daily Fire Detections ********/
//{

//Layer for MODIS fires:
var firesAttrib = '<a href="https://firms.modaps.eosdis.nasa.gov/">Fire Informations</a>';
var modisFires = L.tileLayer.wms("https://firms.modaps.eosdis.nasa.gov/wms/?REQUEST=GetMap&TIME=" + getDayString(modisDay), {
		layers: 'fires_modis',
		format: 'image/png',
		transparent: true,
		maxZoom: 18,
		noWrap: true,
		zIndex: 25,
		attribution: firesAttrib
	});
map.addLayer(modisFires);

//Layer for VIIRS fires:
var viirsFiresAttrib = '<a href="https://firms.modaps.eosdis.nasa.gov/">Fire Informations</a>';
var viirsFires = L.tileLayer.wms("https://firms.modaps.eosdis.nasa.gov/wms/?REQUEST=GetMap&TIME=" + getDayString(modisDay), {
		layers: 'fires_viirs',
		format: 'image/png',
		transparent: true,
		maxZoom: 18,
		noWrap: true,
		zIndex: 25,
		attribution: viirsFiresAttrib
	});
map.addLayer(viirsFires);

//}

//Mosaics:
var mosaic2017121921 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe2017121921FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2017122426 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe2017122426FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2017122931 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe2017122931FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2017121416 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe2017121416FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018010305 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe2018010305FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018010810 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe2018010810FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018011315 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe20180113_20180115FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018011518 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe220180115_20180118FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018011820 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe20180118_20180120FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018012325 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe20180123_20180125FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018012830 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe20180128_20180130FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018020204 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe20180202_20180204FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018020709 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe20180207_20180209FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018021214 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe20180212_20180214FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018021719 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe20180217_20180219FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018022701 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe20180227_20180301FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018030406 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe20180304_20180306FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

var mosaic2018030911 = L.tileLayer.wms("https://zebris.cloud/geoserver/gwc/service/wms", {
		layers: 'zebris:ivorylive-Mosaiccomoe20180309_20180311FALSE1',
		tileSize: 256,
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		noWrap: true,
		zIndex: 11,
		attribution: "Zebris"
	});

//}


/*******************************/
/********  6. GET INFO  ********/
/*******************************/
//{
var marker;

//Call a servlet as GetFeatureInfo (via context-menu):
function GetInfo(e) {
	//Set marker at last click position:
	if (map.hasLayer(marker))
		map.removeLayer(marker);
	marker = L.marker(e.latlng);
	marker.addTo(map);

	var url = 'https://zebris.cloud/GetFeatureInfo/servlet?';
	url = url + 'longitude=' + e.latlng.lng.toFixed(3);
	url = url + '&latitude=' + e.latlng.lat.toFixed(3);
	url = url + '&studyarea=ivorylive';
	url = url + '&print=false';

	var countLayers = 0;
	url = url + '&layers=';
	var lay = "layer2";
	//Auto-Code for layers:
	for(var i = 1; i<18; i++){
		var layername = "layer" + i;
		var layerurl = "";
		if(i==1){
			layerurl = 'zebris:ivorylive-SubsetsIvory';
		}else if(i>1 && i<9){
			var nr = i-2;
			layerurl = 'zebris:ivorylive-MCD64MODIS6Combined-201' + nr;
		}else if(i==9){
			layerurl = 'zebris:ivorylive-SentinelMODIS6Combined-2016';
		}else if(i==10){
			layerurl = 'zebris:ivorylive-LandsatMODIS6Combined-2017';
		}else if(i>10 && i<18){
			var nr = i-11;
			layerurl = 'zebris:ivorylive-MODIS6fires201' + nr;
		}else{
			console.log("layername out of range");
		}

		if (map.hasLayer(window[layername])) {
			if (countLayers > 0)
				url = url + 'SPLIT';
			url = url + layerurl;
			countLayers = countLayers + 1;
		}

	}

	if (countLayers > 0) {
		if ((map.getSize().x < 400) || (map.getSize().y < 300)) {
			//var popup = L.popup({maxWidth: 300, maxHeight: 300});
			//popup.setLatLng(e.latlng);
			//popup.setContent("Your screen is to small to show GetInfo().");
			//map.openPopup(popup);
			//Open in new Tab on very small screens:
			window.open(url);
		} else {
			var maxWidth = map.getSize().x - 210;
			var maxHeight = map.getSize().y - 100;

			//For paning the map:
			var moveRight = 20;
			var moveTop = 40;

			if (maxWidth > 1200)
				maxWidth = 1200;

			if (maxHeight > 800)
				maxHeight = 800;

			//Use maximum popup for smaller screens ?
			//(looks ugly, but is more readable..)
			if (maxWidth < 500) {
				//window.alert("width");
				maxWidth = map.getSize().x - 40;
				moveRight = -30;
			}
			if (maxHeight < 500) {
				//window.alert("height");
				maxHeight = map.getSize().y - 25;
				moveTop = -20;
			}

			//Show in Popup:
			var popup = L.popup({
					maxWidth: maxWidth,
					maxHeight: maxHeight,
					offset: L.point(0, 0),
					autoPan: false
				});
			popup.setLatLng(e.latlng);
			//Content in IFrame:
			popup.setContent("<iframe src='" + url + "' width='" + maxWidth + "' height='" + maxHeight + "' frameborder='0'></iframe>");

			//Pan map:
			var point = map.latLngToLayerPoint(e.latlng);
			point.y = point.y - (map.getSize().y / 2) + moveTop;
			//Move to the right because of the legend-popup:
			point.x = point.x - moveRight;
			var point2 = map.layerPointToLatLng(point);
			map.flyTo(point2);

			map.openPopup(popup);
		}
	} else {
		var popup = L.popup({
				maxWidth: 650,
				maxHeight: 400
			});
		popup.setLatLng(e.latlng);
		popup.setContent("No Layers selected.");
		map.openPopup(popup);
	}
}
//}



//Start BaseMap:
SetBaseMap(esriTopo);
//Init slider:
$("#day-slider").slider("option", "value", doy * 2);

//Block slider until MODIS is activated:
showSlider();

/*******************************/
/******** 7. HTML HELPERS  *****/
/*******************************/
//{
//Show or hide DIV (used for layer-Control):
function toggledisplay(id) {
	if (document.getElementById) {
		var mydiv = document.getElementById(id);
		mydiv.style.display = (mydiv.style.display == 'block' ? 'none' : 'block');
	}
}

//Change-event in layer-list:
function BandChanged() {
	setModisLayer();
}

//}

/************ UNUSED ***********/
//{


/*
//Set label for Slider:
function SetSliderLabel(text) {
	$("#day-label").html(text);
}

function SetLandsatLabel(text) {
	$("#label2").html(text);
}

//Show Landsat-dates in slider-label:
function ShowLandsatDates() {
	$("#label2").html("LS: " + lsDate1.toLocaleDateString() + " - " + lsDate2.toLocaleDateString()); //setLandsatLabel
}



//Update fire-layer:
function setFireLayers() {
	var modisDate = getDayString(modisDay);
	modisFires.setUrl("https://firms.modaps.eosdis.nasa.gov/wms-t/?TIME=" + modisDate);
	viirsFires.setUrl("https://firms.modaps.eosdis.nasa.gov/wms-t/viirs/?TIME=" + modisDate);
}
*/
//}


function startGuide(){
$('body').chardinJs('start');
}

//window.setTimeout(startGuide, 500);

var measureBtn = document.querySelector("a.leaflet-control-measure-toggle");
 measureBtn.setAttribute("data-intro", "Measure distances and areas");
 measureBtn.setAttribute("data-position", "left");

 var measurementDiv = document.getElementsByClassName('leaflet-control-measure leaflet-control');

 var guideDiv = document.createElement('div');
guideDiv.id= "guideDiv";
var guideBtn = document.createElement("input");
    guideBtn.type = "button";
	guideBtn.value="i";
	guideBtn.setAttribute("title", "Startguide");
	guideBtn.id="guideButton";
	guideBtn.classList.add("leaflet-control");
	guideBtn.classList.add("leaflet-bar");
	guideBtn.classList.add("flat-btn");
	guideBtn.onclick = startGuide;
	guideBtn.setAttribute("data-intro", "Start this guide again");
	guideBtn.setAttribute("data-position", "left");
guideDiv.appendChild(guideBtn);
measurementDiv[0].parentNode.appendChild(guideDiv);


//document.querySelector('a[role]')[1].click();
document.getElementById("layertab").click();