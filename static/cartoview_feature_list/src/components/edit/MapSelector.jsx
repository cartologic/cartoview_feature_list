// import Search from "./Search.jsx"
import 'react-toggle-switch/dist/css/switch.min.css'

import { MapCard } from './MapCard'
import PropTypes from 'prop-types'
import React from 'react'
import ReactPaginate from 'react-paginate'
import Spinner from 'react-spinkit'
import Switch from 'react-toggle-switch'

const UserMapSwitch = (props) => {
    const { UserMapsChanged, userMaps } = props
    return (
        <div className="col-xs-8 col-sm-4 col-md-4 col-lg-4 col-xs-offset-2 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">
            <div className="flex-display">
                <p>{'All Maps'}</p>
                <div>
                    <Switch on={userMaps} onClick={UserMapsChanged} />
                </div>
                <p>{'My Maps'}</p>
            </div>
        </div>
    )
}
UserMapSwitch.propTypes = {
    UserMapsChanged: PropTypes.func.isRequired,
    userMaps: PropTypes.bool.isRequired
}
export const Loader = (props) => {
    return (
        <div className="row row-fix">
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-md-offset-3 text-center">
                <Spinner name="line-scale-pulse-out" color="steelblue" />
            </div>
        </div>
    )
}
export default class MapSelector extends React.Component {
    constructor(props) {
        super(props)
    }
    getComponentValue = () => {
        return "It's OK"
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { userMaps, maps, selectedMap } = this.props
        if (nextProps.userMaps === userMaps && nextProps.maps === maps && selectedMap === nextProps.selectedMap) {
            return false
        }
        return true
    }
    handlePageClick = (data) => {
        const { userMaps, getMaps } = this.props
        const selected = data.selected
        const offset = selected * 9
        getMaps(userMaps, offset)
    }
    render() {
        const { loading, selectedMap, selectMap, maps, getMaps, userMaps, totalMaps, UserMapsChanged, limit, urls } = this.props
        return (
            <div className="grid">
                <div className="row row-fix">
                    <UserMapSwitch UserMapsChanged={UserMapsChanged} userMaps={userMaps} getMaps={getMaps} />
                </div>
                <hr />
                {loading && <Loader />}
                {!loading && maps.map((map, index) => {
                    return <MapCard key={index} map={map} selectedMap={selectedMap} selectMap={selectMap} />

                })}
                {(!loading && maps.length == 0 && userMaps) && <div className="row">
                    <div
                        className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3 text-center">
                        <h3>{`This Application requires a `}<a href={`${urls.newMap}`}>Map</a>{` and a `}<a href="https://docs.qgis.org/2.8/en/docs/training_manual/create_vector_data/create_new_vector.html">Layer</a>{`. you will need to upload layer.Once you have a Layer you can create a Map with this layer`}</h3>
                        <hr/>
                        <h3>{"Alternatively you can work with other Maps and Layers that are shared with you or shared to Public.To view your Shared Maps click the Switcher on the top of page"}</h3>

                    </div>
                </div>}
                <ReactPaginate
                    previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={< a href="javascript:;" > ...</a>}
                    breakClassName={"break-me"}
                    pageCount={totalMaps / limit}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination center-div"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"} />
            </div>
        )
    }
}
MapSelector.propTypes = {
    maps: PropTypes.array,
    selectedMap: PropTypes.object,
    selectMap: PropTypes.func.isRequired,
    getMaps: PropTypes.func.isRequired,
    urls: PropTypes.object.isRequired,
    UserMapsChanged: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    userMaps: PropTypes.bool.isRequired,
    totalMaps: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
}
