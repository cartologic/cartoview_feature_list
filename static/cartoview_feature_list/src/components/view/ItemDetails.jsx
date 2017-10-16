import 'react-responsive-carousel/lib/styles/carousel.min.css';

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

import Button from 'material-ui/Button';
import { Carousel } from 'react-responsive-carousel';
import Divider from 'material-ui/Divider'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

const styles = theme => ( {
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
        marginBottom: 'auto',
        [ theme.breakpoints.down( 'md' ) ]: {
            marginBottom: 40,
        },
    }
} )
class ItemDetails extends React.Component {
    constructor( props ) {
        super( props )
    }
    render() {
        let {
            selectedFeature,
            searchFilesById,
            classes,
            back
        } = this.props
        return (
            <div>
                <Typography type="title" color="inherit" className={classes.flex}>
                    Feature Details
                </Typography>
                <Grid style={{ marginTop: 40 }} container align={'center'} justify={'center'} spacing={0}>
                    {searchFilesById(selectedFeature.getId()).length > 0 && <Grid item xs={8} sm={8} md={8} xl={8} >
                        <Carousel showArrows={true}>
                            {searchFilesById(selectedFeature.getId()).map(
                                (imageObj, i) => {
                                    return <div key={i}>
                                        <img src={imageObj.file} />
                                        <p className="legend">{`Uploaded by ${imageObj.username}`}</p>
                                    </div>
                                }
                            )}
                        </Carousel>
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
export default withStyles( styles )( ItemDetails )
