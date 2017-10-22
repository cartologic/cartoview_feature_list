import Collapse from 'material-ui/transitions/Collapse'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import IconButton from 'material-ui/IconButton'
import {Message} from './statelessComponents'
import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import { withStyles } from 'material-ui/styles'
const styles = theme => ({
    fillOutEmpty: {
        flexGrow: 1
    },
    attrsTableTitle: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    flexDisplay: {
        display: 'flex'
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
})
class Collapsible extends React.Component {
    constructor(props) {
        super(props)
        const {open}=this.props
        this.state = {
            expanded: open
        }
    }
    handleDetailsExpand = () => {
        this.setState({ expanded: !this.state.expanded })
    }
    render() {
        const { classes, children, title } = this.props
        return (
            <div>
                <div className={classes.flexDisplay}>
                    <div className={classes.attrsTableTitle}>
                        <Message align="center" message={title} classes={classes} type="body2" />
                    </div>
                    <div className={classes.fillOutEmpty} />
                    <IconButton
                        className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}
                        onClick={this.handleDetailsExpand}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </div>
                <Collapse in={this.state.expanded} transitionDuration="auto" unmountOnExit>
                    {children}
                </Collapse>
            </div>

        )
    }
}
Collapsible.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.object.isRequired,
    open:PropTypes.bool.isRequired
}
export default withStyles(styles)(Collapsible)