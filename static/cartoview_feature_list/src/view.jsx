import './app.css'
import 'openlayers/dist/ol.css'
import './vendor/ol3-layerswitcher/src/ol3-layerswitcher.css'

import { IntlProvider, addLocaleData } from 'react-intl'

import FeatureList from './components/FeatureList'
import Grid from 'material-ui/Grid';
import LoadingPanel from '@boundlessgeo/sdk/components/LoadingPanel'
import MapPanel from '@boundlessgeo/sdk/components/MapPanel'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import React from 'react'
import { connect } from 'react-redux'
import enLocaleData from 'react-intl/locale-data/en'
import enMessages from '@boundlessgeo/sdk/locale/en'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {
    loadMap
} from './actions/map'
import { render } from 'react-dom'
import { viewStore } from './store/stores'

injectTapEventPlugin( )
addLocaleData( enLocaleData )
class CartoviewFeatureList extends React.Component {
    constructor( props ) {
        super( props )
        this.map = this.props.map
    }
    componentWillMount( ) {
        this.props.updateMap( this.props.configProps.mapId )
    }
    render( ) {
        return (
            <div style={{flexGrow:1,height:'100%'}}>
            <Grid style={{height:'100%'}} align={"stretch"} container spacing={0}>
              <Grid container align={"stretch"} item xs={12} sm={12} md={8} spacing={0} >
                <MapPanel map={this.map}></MapPanel>
				<LoadingPanel map={this.map}></LoadingPanel>
              </Grid>
              <Grid container align={"stretch"} item xs={12} sm={12} md={4} spacing={0} >
                <FeatureList {...this.props.configProps} />
              </Grid>
            </Grid>
          </div>
        )
    }
}
CartoviewFeatureList.propTypes = {
    configProps: PropTypes.object.isRequired,
    updateMap: PropTypes.func.isRequired
}
const mapStateToProps = ( state ) => {
    return {
        map: state.map,
    }
}
const mapDispatchToProps = ( dispatch ) => {
    return {
        updateMap: ( mapId ) => dispatch( loadMap( getMapConfigUrl( mapId ) ) )
    }
}
let App = connect( mapStateToProps, mapDispatchToProps )( CartoviewFeatureList )
global.CartoviewFeatureList = {
    show: ( el, props ) => {
        render(
            <Provider store={viewStore}>
            <IntlProvider locale='en' messages={enMessages}>
                <App configProps={props}></App>
            </IntlProvider>
        </Provider>,
            document.getElementById( el ) )
    }
}
