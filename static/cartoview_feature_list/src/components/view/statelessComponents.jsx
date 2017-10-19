import List, { ListItem, ListItemText } from 'material-ui/List'

import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from 'material-ui/Typography'
import noImage from '../../img/no-img.png'

export const Loader = ( props ) => {
    const { classes } = props
    return (
        <div className={classes.loadingCenter} >
            <CircularProgress size={50} thickness={5} className={classes.progress}></CircularProgress>
        </div>
    )
}
Loader.propTypes = {
    classes: PropTypes.object.isRequired
}
export const Message = ( props ) => {
    return <Typography type={props.type} align="center" color="inherit" className={props.classes.flex}>{props.message}</Typography>
}
Message.propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
}
export const Item = ( props ) => {
    const { openDetails, classes, feature, attachment, config } = props
    return <div>
        <ListItem onClick={() => openDetails({ detailsModeEnabled: true, detailsOfFeature: feature })} button className={classes.listItem}>
            <img className={classes.bigAvatar} src={attachment.length > 0 ? attachment[0].file : noImage} />
            <ListItemText primary={`${feature.getProperties()[config.titleAttribute]}`} secondary={`${config.subtitleAttribute ? feature.getProperties()[config.subtitleAttribute] : ''}`} />
        </ListItem>
        <Divider />
    </div>
}
Item.propTypes = {
    classes: PropTypes.object.isRequired,
    feature: PropTypes.object.isRequired,
    attachment: PropTypes.array.isRequired,
    config: PropTypes.object.isRequired,
    openDetails: PropTypes.func.isRequired
}
export const FeatureListComponent = ( props ) => {
    const {
        features,
        loading,
        subheader,
        message,
        classes,
        config,
        attachmentIsLoading,
        searchFilesById,
        openDetails,
    } = props
    return ( !loading && !attachmentIsLoading && features && features.length >
        0 ?
        <List subheader={subheader}>
            {features && features.map((feature, index) => {
                const attachment = searchFilesById(feature.getId())
                return <Item key={index} classes={classes} feature={feature} config={config} attachment={attachment} openDetails={openDetails} />
            })}
        </List> :
        features && features.length == 0 ?
        <Message message={message} classes={classes} type="body2" /> :
        <Loader classes={classes} /> )
}
FeatureListComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    features: PropTypes.array,
    config: PropTypes.object.isRequired,
    openDetails: PropTypes.func.isRequired,
    subheader: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    attachmentIsLoading: PropTypes.bool.isRequired,
    searchFilesById: PropTypes.func.isRequired
}
export const URL = ( props ) => {
    const { classes, url } = props
    return <Button color="accent"  href={url} className={classes.button}>
            Link
        </Button>
}
URL.propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired
}
