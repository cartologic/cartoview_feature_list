import List, { ListItem, ListItemText } from 'material-ui/List'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

import Button from 'material-ui/Button';
import { Carousel } from 'react-responsive-carousel'
import { CircularProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from 'material-ui/Typography'
import { checkURL } from '../../containers/staticMethods'
import noImage from '../../img/no-img.png'

export const Loader = (props) => {
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
export const Message = (props) => {
    return <Typography type={props.type} align={props.align || "center"} color="inherit" className={props.classes.flex}>{props.message}</Typography>
}
Message.propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    align: PropTypes.string

}
export const Item = (props) => {
    const { openDetails, classes, feature, attachment, config } = props
    return <div>
        <ListItem onClick={() => openDetails({ detailsModeEnabled: true, detailsOfFeature: feature })} button className={classes.listItem}>
            {config.enableImageListView && <img className={classes.bigAvatar} src={attachment.length > 0 ? attachment[0].file : noImage} />}
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

export const FeatureListComponent = (props) => {
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
    return (!loading && !attachmentIsLoading && features && features.length >
        0 ?
        <div>
            <Message align="left" message={subheader} classes={classes} type="subheading" />
            <List>
                {features && features.map((feature, index) => {
                    const attachment = searchFilesById(feature.getId())
                    return <Item key={index} classes={classes} feature={feature} config={config} attachment={attachment} openDetails={openDetails} />
                })}
            </List>
        </div> :
        features && features.length == 0 ?
            <Message message={message} classes={classes} type="body2" /> :
            <Loader classes={classes} />)
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
export const URL = (props) => {
    const { classes, url } = props
    return <Button color="accent" href={url} className={classes.button}>
        Link
        </Button>
}
URL.propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired
}
export const PropsTable = (props) => {
    const { classes, selectedFeature } = props
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Value</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {Object.keys(selectedFeature.getProperties()).map((key, i) => {
                const value = selectedFeature.getProperties()[key]
                if (key != "geometry" && key != "_layerTitle") {
                    return <TableRow key={i}>
                        <TableCell>{key}</TableCell>
                        <TableCell style={{ whiteSpace: 'pre-line' }}>{checkURL(value) ? <URL url={value} classes={classes} /> : value}</TableCell>
                    </TableRow>
                }
            })}
        </TableBody>
    </Table>
}
PropsTable.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedFeature: PropTypes.object.isRequired
}
export const Slider = (props) => {
    const { attachments } = props
    return <div>
        <Grid container alignItems={'center'} justify={'center'} spacing={0}>
            {attachments.length > 0 && <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                <Carousel showArrows={true}>
                    {attachments.map(
                        (imageObj, i) => {
                            return <div key={i}>
                                <img src={imageObj.file} />
                                <p className="legend">{`Uploaded by ${imageObj.username}`}</p>
                            </div>
                        }
                    )}
                </Carousel>
            </Grid>}
            <Typography align="center" paragraph type="body1" color="inherit" >
                {'No Attachments for this feature'}
            </Typography >
        </Grid>
        <Divider light />
    </div>
}
Slider.propTypes = {
    attachments: PropTypes.array.isRequired
}
