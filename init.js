

_e = (function () {

	var _e = {

		mapPackages: {},

		initialise: function () {

			let aLonLat = [151.5, -33];

			var aCoord = window.ol.proj.transform(aLonLat, 'EPSG:4326', 'EPSG:3857');

			this.createMap('map', aCoord, 5);

		},

		viewStyle: function( aFeature ) {


			let aFill = new ol.style.Fill({
				color: 'rgba(255,255,255,0.4)'
			});

			let aStroke = new ol.style.Stroke({
				color: '#FF0000',
				width: 2.5
			});

			let aX = 0;
			let aY = 10;

			if ( aFeature.get( "text" ) == "top" )
				aY = -20;

			if ( aFeature.get( "text" ) == "right" ) {
				aY = 0;
				aX = 55;
			}

			let aStyle = new ol.style.Style({
				image: new ol.style.Circle({
					stroke: aStroke,
					fill: aFill,
					radius: 5
				}),
				stroke: aStroke,
				fill: aFill,

				text: new ol.style.Text({
					textAlign: 'center',
					textBaseline: 'hanging',
					font: 'bold 16px "Linotype Feltpen W02 Medium"',
					text: aFeature.get( 'name' ),
					fill: new ol.style.Fill({color: 'black'}),
					stroke: new ol.style.Stroke({color: 'white', width: 2}),
					offsetY: aY,
					offsetX: aX
				  })
								
				})


			return aStyle;
		},

		createMap: function (aName, aCenter, aZoom, aVector) {

			aStamenLayer = new ol.layer.Tile({
				source: new ol.source.Stamen({
					layer: 'watercolor'
					//layer: 'terrain'
				})
			});

			aStamenLayer.set('name', 'stamen');

			var someLayers = [];

			someLayers.push(aStamenLayer);


			var aLayer = new ol.layer.Vector({
				source: new ol.source.Vector({
					crossOrigin: 'anonymous',
					projection: 'EPSG:4326',
					format: new ol.format.GeoJSON(),
					url: "places.json"
				}),

				style: this.viewStyle.bind( this )

			});

			someLayers.push(aLayer);



			var aFeatureJson = {
				"type": "Feature",
				"id": "1",
				"properties": {
					"type": "orientate"
				},
				"geometry": {
					"type": "Point",
					"coordinates": [0, 0]
				}
			};

			var aFormat = new window.ol.format.GeoJSON();

			var aFeature = aFormat.readFeature(aFeatureJson, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			});


			aLayer.getSource().addFeature(aFeature);


			// Map..

			var aMap = new ol.Map({

				controls: [],
				layers: someLayers,

				target: aName,

				view: new ol.View({

					center: aCenter,

					zoom: aZoom,
					minZoom: 1,
					maxZoom: 22

				}),

				moveTolerance: 10

			});

			var aPackage = {};

			aPackage['map'] = aMap;
			aPackage['layers'] = someLayers;
			aPackage['feature'] = aFeature;

			this.mapPackages[aName] = aPackage;

		},

		launchHook: function () {

			this.launchHookCallback({});

		},

		launchHookCallback: function (someData) {

			this.initialise();

		}

	}

	return _e;

}());

document.addEventListener("DOMContentLoaded", function (event) {

	this.launchHook();

}.bind(_e));

