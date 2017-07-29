import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import ol from 'openlayers'
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import { wfsQueryBuilder } from "../helpers/helpers.jsx"
import UltimatePaginationMaterialUi from './MaterialPagination';
import Spinner from "react-spinkit"
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back.js"
import IconButton from 'material-ui/IconButton';
import {
	Table,
	TableBody,
	TableFooter,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn
} from 'material-ui/Table';
import WMSService from '@boundlessgeo/sdk/services/WMSService';
const image = new ol.style.Circle({
	radius: 5,
	fill: null,
	stroke: new ol.style.Stroke({ color: 'black', width: 2 })
});
const styles = {
	'Point': new ol.style.Style({ image: image }),
	'LineString': new ol.style.Style({
		stroke: new ol.style.Stroke({ color: 'green', width: 1 })
	}),
	'MultiLineString': new ol.style.Style({
		stroke: new ol.style.Stroke({ color: 'green', width: 1 })
	}),
	'MultiPoint': new ol.style.Style({ image: image }),
	'MultiPolygon': new ol.style.Style({
		stroke: new ol.style.Stroke({ color: 'yellow', width: 1 }),
		fill: new ol.style.Fill({ color: 'rgba(255, 255, 0, 0.1)' })
	}),
	'Polygon': new ol.style.Style({
		stroke: new ol.style.Stroke({ color: 'blue', lineDash: [4], width: 3 }),
		fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.1)' })
	}),
	'GeometryCollection': new ol.style.Style({
		stroke: new ol.style.Stroke({ color: 'magenta', width: 2 }),
		fill: new ol.style.Fill({ color: 'magenta' }),
		image: new ol.style.Circle({
			radius: 10,
			fill: null,
			stroke: new ol.style.Stroke({ color: 'magenta' })
		})
	}),
	'Circle': new ol.style.Style({
		stroke: new ol.style.Stroke({ color: 'red', width: 2 }),
		fill: new ol.style.Fill({ color: 'rgba(255,0,0,0.2)' })
	})
};
const styleFunction = ( feature ) => {
	return styles[feature.getGeometry( ).getType( )];
};

const isWMSLayer = ( layer ) => {
	return layer.getSource( )instanceof ol.source.TileWMS || layer.getSource( )instanceof ol.source.ImageWMS;
}
const getWMSLayer = ( name, layers ) => {
	var wmsLayer = null;
	layers.forEach(( layer ) => {
		if ( layer instanceof ol.layer.Group ) {
			wmsLayer = getWMSLayer(name, layer.getLayers( ));
		} else if ( isWMSLayer( layer ) && layer.getSource( ).getParams( ).LAYERS == name ) {
			wmsLayer = layer;
		}
		if ( wmsLayer ) {
			return false
		}
	});
	return wmsLayer;
};
export default class FeatureList extends React.Component {

	constructor( props ) {
		super( props );
		this.state = {
			features: [],
			loading: true,
			totalFeatures: 0,
			selectMode: false,
			selectedFeatures: [],
			perPage: 50,
			currentPage: 1,
			selectionLayerAdded: false
		};
		this.featureCollection = new ol.Collection( );
		this.selectLayer = new ol.layer.Vector({
			source: new ol.source.Vector({ features: this.featureCollection }),
			style: styleFunction,
			title: "Selected Features",
			zIndex: 1000,
			format: new ol.format.GeoJSON({defaultDataProjection: this.props.map.getView( ).getProjection( ), featureProjection: this.props.map.getView( ).getProjection( )})
		});
	}
	init( map ) {
		map.on('singleclick', ( e ) => {
			WMSService.getFeatureInfo(getWMSLayer(appConfig.layer, map.getLayers( ).getArray( )), e.coordinate, map, 'application/json', ( result ) => {
				console.log(map.getView( ).calculateExtent(map.getSize( )));
				this.setState({ selectedFeatures: result.features, selectMode: true })
				console.log(this.props.map.getView( ).getProjection( ));
				this.zoomToFeature(result.features[0])
				// this.state.features = this.state.features.concat( result.features );
				// result.features.forEach(f => f.set("_layerTitle", result.layer.get( 'title'
				// ))) this.setState({ features: this.state.features, busy: false });
			});
		});
	}
	getLayers( layers ) {
		var children = [ ];
		layers.forEach(( layer ) => {
			if ( layer instanceof ol.layer.Group ) {
				children = children.concat(this.getLayers(layer.getLayers( )));
			} else if (layer.getVisible( ) && isWMSLayer( layer )) {
				children.push( layer );
			}
		});
		return children;
	}
	loadfeatures( ) {
		let { loading } = this.state;
		if ( !loading ) {
			this.setState({ loading: true })
		}
		const url = wfsQueryBuilder(geoserver_url, {
			service: 'wfs',
			version: '2.0.0',
			request: 'GetFeature',
			typeNames: appConfig.layer,
			outputFormat: 'json',
			count: this.state.perPage,
			startIndex: this.state.perPage * ( this.state.currentPage - 1 )
		})
		fetch( url ).then(( response ) => response.json( )).then(( data ) => {
			let features = new ol.format.GeoJSON( ).readFeatures(data, {featureProjection: this.props.map.getView( ).getProjection( )})
			if ( this.state.totalFeatures == 0 ) {
				this.setState({ features: features, loading: false, totalFeatures: data.totalFeatures })
			} else {
				this.setState({ features: features, loading: false })
			}

		})

	}
	backToList( ) {
		this.featureCollection.clear( )
		this.setState({ selectMode: false })
	}
	zoomToFeature( feature ) {
		if ( !this.state.selectionLayerAdded ) {
			this.props.map.addLayer( this.selectLayer )
			this.setState({ selectionLayerAdded: true })
		}
		this.setState({ selectMode: true })
		this.setState({selectedFeatures: [ feature ]})
		this.featureCollection.clear( )
		this.featureCollection.push( feature )
		this.props.map.getView( ).fit(feature.getGeometry( ).getExtent( ), this.props.map.getSize( ), { duration: 10000 });
	}
	componentDidMount( ) {
		this.loadfeatures( )
		this.init( this.props.map )
	}

	render( ) {
		let { loading } = this.state
		return (
			<Drawer openSecondary={true} width={"30%"} open={true}>
				<AppBar
					showMenuIconButton={this.state.selectMode}
					iconElementLeft={< IconButton onTouchTap = {
					this.backToList.bind( this )
				} > <NavigationArrowBack ></NavigationArrowBack> < /IconButton>}
					title={appConfig.layer.split( ":" )[ 1 ]}/> {loading && <MenuItem style={{
					textAlign: "center",
					padding: 10
				}}><Spinner className="loading-center" name="line-scale-party" color="steelblue"/></MenuItem>}
				{!loading && !this.state.selectMode && this.state.features.map(( feature, i ) => {
					return <div key={i}>
						<MenuItem onTouchTap={this.zoomToFeature.bind( this, feature )}>{feature.getProperties( )[ appConfig.attribute ]}</MenuItem>
						<Divider></Divider>
					</div>
				})}
				{!loading && !this.state.selectMode && <UltimatePaginationMaterialUi
					totalPages={Math.ceil( this.state.totalFeatures / this.state.perPage )}
					currentPage={this.state.currentPage}
					onChange={number => this.setState({
					currentPage: number
				}, this.loadfeatures.bind( this ))}/>}
				{!loading && this.state.selectMode && this.state.selectedFeatures.length == 1 && <Table selectable={false}>
					<TableHeader
						displaySelectAll={false}
						adjustForCheckbox={false}
						enableSelectAll={false}>
						<TableRow>
							<TableHeaderColumn
								colSpan="3"
								tooltip="Feature Details"
								style={{
								textAlign: 'center'
							}}>
								{"Feature Details"}
							</TableHeaderColumn>
						</TableRow>
						<TableRow>
							<TableHeaderColumn tooltip="Property">Property</TableHeaderColumn>
							<TableHeaderColumn tooltip="Value">Value</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody
						displayRowCheckbox={false}
						deselectOnClickaway={false}
						stripedRows={true}>
						{Object.keys(this.state.selectedFeatures[0].getProperties( )).map(( key, i ) => {
							if ( key != "geometry" ) {
								return <TableRow key={i}>
									<TableRowColumn>
										<span>{key}</span>
									</TableRowColumn>
									<TableRowColumn>
										<span>{this.state.selectedFeatures[0].getProperties( )[ key ]}</span>
									</TableRowColumn>
								</TableRow >
							}

						})}
					</TableBody>
				</Table>}
			</Drawer>
		);
	}
}
