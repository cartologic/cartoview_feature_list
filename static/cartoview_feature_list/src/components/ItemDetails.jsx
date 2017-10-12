import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import Divider from 'material-ui/Divider'
import Grid from 'material-ui/Grid'
import Img from 'react-image'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import Slider from 'react-slick'
import Spinner from "react-spinkit"
import { connect } from 'react-redux'
import noImage from '../img/no-img.png'

class ItemDetails extends React.Component {
    constructor( props ) {
        super( props )
    }
    searchFilesById = ( id ) => {
        let result = [ ]
        this.props.files.map( ( imageObj ) => {
            if ( imageObj.is_image && imageObj.feature_id ===
                id ) {
                result.push( imageObj )
            }
        } )
        return result
    }
    render( ) {
        let {
            selectedFeatures
        } = this.props
        const settings = {
            dots: true,
            fade: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        }
        return (
            <div>
            <Grid style={{marginTop:40}} container align={'center'} justify={'center'} spacing={0}>
            {this.searchFilesById(selectedFeatures[0].getId()).length > 0 &&  <Grid item xs={6} sm={6} md={6} >
                <Slider style={{ marginRight: 'auto', marginLeft: 'auto' }} {...settings}>
                        {this.searchFilesById(selectedFeatures[0].getId()).map(
                            (imageObj, i) => {
                                return <div key={i}><Img
                                    src={[
                                        imageObj.file,
                                        noImage
                                    ]}
                                    loader={<Spinner className="loading-center" name="line-scale-party" color="steelblue" />}
                                    style={{width:'100%',height:'auto'}}/>
                                </div>
                            }
                        )}
                    </Slider>
                </Grid>}
            </Grid>
            <Divider light />
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Value</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {Object.keys(selectedFeatures[0].getProperties()).map((key, i) => {
                        if (key != "geometry") {
                            return <TableRow key={i}>
                                <TableCell>{key}</TableCell>
                                <TableCell style={{whiteSpace: 'pre-line'}}>{selectedFeatures[0].getProperties()[key]}</TableCell>
                            </TableRow>
                        }
                    })}
                </TableBody>
      </Table>
        </div>
        )
    }
}
ItemDetails.propTypes = {
    selectedFeatures: PropTypes.array.isRequired,
    files: PropTypes.array.isRequired
}
const mapStateToProps = ( state ) => {
    return {
        selectedFeatures: state.selectedFeatures,
        files: state.files
    }
}
export default connect( mapStateToProps )( ItemDetails )
