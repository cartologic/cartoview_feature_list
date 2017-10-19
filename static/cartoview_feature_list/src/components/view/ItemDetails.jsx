import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { PropsTable, Slider } from './statelessComponents'

import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from 'material-ui/Typography'
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
        marginBottom: 'auto',
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
        return (
            <div>
                <Typography type="title" color="inherit" className={classes.flex}>
                    Feature Details
                </Typography>
                <Slider attachments={searchFilesById(selectedFeature.getId())} />
                <Divider light />
                <PropsTable classes={classes} selectedFeature={selectedFeature} />
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
