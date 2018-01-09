import List, { ListItem, ListItemText } from 'material-ui/List'
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table'

import Button from 'material-ui/Button'
import { Carousel } from 'react-responsive-carousel'
import { CircularProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'
import Dropzone from 'react-dropzone'
import Fade from 'material-ui/transitions/Fade'
import FeatureListHelper from 'Source/helpers/FeatureListHelper'
import Grid from 'material-ui/Grid'
import Img from 'react-image'
import PropTypes from 'prop-types'
import React from 'react'
import SendIcon from 'material-ui-icons/Send'
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import noImage from '../../img/no-img.png'

export const Loader = ( props ) => {
    const { size, thickness } = props
    return (
        <div className="text-center" >
            <CircularProgress size={size ? size : 50} thickness={thickness ? thickness : 5} className="text-center"></CircularProgress>
        </div>
    )
}
Loader.propTypes = {
    size: PropTypes.number,
    thickness: PropTypes.number
}
export const Message = ( props ) => {
    const { align, type, message, color, noWrap } = props
    return <Typography
        type={type}
        align={align || "center"}
        noWrap={typeof (noWrap) !== "undefined" ? noWrap : message.length > 50 ? true : false}
        color={color ? color : "inherit"}
        className="element-flex">
        {message}
    </Typography>
}
Message.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    align: PropTypes.string,
    color: PropTypes.string,
    noWrap: PropTypes.bool
}
export const Item = ( props ) => {
    const { openDetails, feature, attachment, config } = props
    const title = feature.getProperties()[ config.titleAttribute ]
    const description = config.subtitleAttribute ? feature.getProperties()[
        config.subtitleAttribute ] : ''
    return <div>
        <ListItem onTouchTap={() => openDetails({ detailsModeEnabled: true, detailsOfFeature: feature })}>
            {config.enableImageListView && <Img className="big-avatar"
                src={[
                    attachment.length > 0 ? attachment[0].file : noImage
                ]}
                loader={<Loader />}
            />}
            <ListItemText primary={`${title}`} secondary={`${description}`} />

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
        <div className="row">
            <div className="list-header">
                <Message align="left" message={subheader} type="headline" />
            </div>
            <Divider />
            <List>
                {features && features.map((feature, index) => {
                    const attachment = searchFilesById(feature.getId())
                    return <Item key={index} classes={classes} feature={feature} config={config} attachment={attachment} openDetails={openDetails} />
                })}
            </List>
        </div> :
        features && features.length == 0 ?
        <Message message={message} type="body2" /> : <Loader /> )
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
    return <Button color="accent" href={url} className={classes.button}>
        Link
        </Button>
}
URL.propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired
}
export const PropsTable = ( props ) => {
    const { classes, selectedFeature, attributesToDisplay } = props
    const keys = attributesToDisplay.length == 0 ? Object.keys(
        selectedFeature.getProperties() ) : attributesToDisplay
    return <Table>
        <TableBody>
            {keys.map((key, i) => {
                const value = selectedFeature.getProperties()[key]
                if (key != "geometry" && key != "_layerTitle") {
                    return <TableRow key={i}>
                        <TableCell>{key}</TableCell>
                        <TableCell className="space-per-line">{FeatureListHelper.checkURL(value) ? <URL url={value} classes={classes} /> : value}</TableCell>
                    </TableRow>
                }
            })}
        </TableBody>
    </Table>
}
PropsTable.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedFeature: PropTypes.object.isRequired,
    attributesToDisplay: PropTypes.array.isRequired
}
export const Slider = ( props ) => {
    const { attachments } = props
    return <div>
        <Grid container justify={'center'} spacing={0}>
            {attachments.length > 0 ? <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                <Carousel showArrows={true}>
                    {attachments.map(
                        (imageObj, i) => {
                            return <div key={i}>
                                <img className="img-responsive" src={imageObj.file} />
                                <p className="legend">{`Uploaded by ${imageObj.username}`}</p>
                            </div>
                        }
                    )}
                </Carousel>
            </Grid> : <Message align="center" message={'No Attachments'} type="body1" />}
        </Grid>
    </div>
}
Slider.propTypes = {
    attachments: PropTypes.array.isRequired
}
export const CommentBox = ( props ) => {
    const { classes, value, handleChange, addComment, hasError } = props
    return (
        <div className="text-center fill-out-empty">
            {!hasError ? <TextField
                id="multiline-flexible"
                label="Comment"
                multiline
                rowsMax="4"
                value={value}
                onChange={handleChange}
                className={classes.textField}
                margin="none"
                fullWidth
            /> : <TextField
                    error
                    id="multiline-flexible"
                    label="Comment"
                    multiline
                    rowsMax="4"
                    value={value}
                    onChange={handleChange}
                    className={classes.textField}
                    margin="normal"
                    fullWidth
                />}
            <Button onTouchTap={addComment} raised color="accent" className={classes.button}>
                {`Send`} <SendIcon />
            </Button>
        </div>
    )
}
CommentBox.propTypes = {
    value: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired
}
export const DropZoneComponent = ( props ) => {
    const { classes, files, onDrop } = props
    return (
        <div className="center-div">
            <Dropzone maxSize={5242880} multiple={false} accept="image/*" onDrop={onDrop}>
                <div>
                    <Message message={"Click to select Image to upload."} type="body1" />
                    <ul> {files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)}</ul>
                </div>
            </Dropzone>
        </div>
    )
}
DropZoneComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    onDrop: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired,
}
export const CartoviewSnackBar = ( props ) => {
    const { handleClose, open, message } = props
    return (
        <Snackbar
            open={open}
            onRequestClose={handleClose ? handleClose : () => { }}
            transition={Fade}
            SnackbarContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span className="element-flex" id="message-id"><Loader size={20} thickness={4} /> { message } <
        /span>} / > )
}
CartoviewSnackBar.propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired
}
