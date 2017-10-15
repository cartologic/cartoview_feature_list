import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider'
import Grid from 'material-ui/Grid'
import Img from 'react-image'
import PropTypes from 'prop-types'
import React from 'react'
import Slider from 'react-slick'
import Spinner from "react-spinkit"
import Typography from 'material-ui/Typography'
import noImage from '../img/no-img.png'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    root: {
        width: '100%',
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    button: {
        margin: theme.spacing.unit,
    },
    textCenter: {
        textAlign: 'center',
        marginBottom:'auto',
        [theme.breakpoints.down('md')]: {
            marginBottom: 40,
        },

    }
})
class ItemDetails extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        let {
            selectedFeature,
            searchFilesById,
            classes,
            back
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
                <Typography type="title" color="inherit" className={classes.flex}>
                    Feature Details
                </Typography>
                <Grid style={{ marginTop: 40 }} container align={'center'} justify={'center'} spacing={0}>
                    {searchFilesById(selectedFeature.getId()).length > 0 && <Grid item xs={6} sm={6} md={6} >
                        <Slider style={{ marginRight: 'auto', marginLeft: 'auto' }} {...settings}>
                            {searchFilesById(selectedFeature.getId()).map(
                                (imageObj, i) => {
                                    return <div key={i}><Img
                                        src={[
                                            imageObj.file,
                                            noImage
                                        ]}
                                        loader={<Spinner className="loading-center" name="line-scale-party" color="steelblue" />}
                                        style={{ width: '100%', height: 'auto' }} />
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
                        {Object.keys(selectedFeature.getProperties()).map((key, i) => {
                            if (key != "geometry") {
                                return <TableRow key={i}>
                                    <TableCell>{key}</TableCell>
                                    <TableCell style={{ whiteSpace: 'pre-line' }}>{selectedFeature.getProperties()[key]}</TableCell>
                                </TableRow>
                            }
                        })}
                    </TableBody>
                </Table>
                <div className={classes.textCenter}>
                    <Button onClick={() => back()} color="primary" className={classes.button}>
                        Back
                </Button>
                </div>
            </div>
        )
    }
}
ItemDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedFeature: PropTypes.object.isRequired,
    searchFilesById: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired
}
export default withStyles(styles)(ItemDetails)
