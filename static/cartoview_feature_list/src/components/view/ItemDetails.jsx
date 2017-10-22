import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { PropsTable, Slider } from './statelessComponents'

import Button from 'material-ui/Button'
import Collapsible from './CollapsibleItem'
import { Message } from './statelessComponents'
import PropTypes from 'prop-types'
import React from 'react'
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
    flexDisplay: {
        display: 'flex'
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
                <Message align="left" message={'Feature Details'} classes={classes} type="subheading" />
                <Collapsible title="Feature Attachments" open={true}>
                    <Slider attachments={searchFilesById(selectedFeature.getId())} />
                </Collapsible>
                <Collapsible title="Feature Attributes" open={true}>
                    <PropsTable classes={classes} selectedFeature={selectedFeature} />
                </Collapsible>
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
