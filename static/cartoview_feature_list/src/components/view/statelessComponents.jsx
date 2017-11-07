import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

import Button from 'material-ui/Button'
import { Carousel } from 'react-responsive-carousel'
import CartoviewList from './CartoviewList'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import { CircularProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'
import Drawer from 'material-ui/Drawer'
import Dropzone from 'react-dropzone'
import Fade from 'material-ui/transitions/Fade';
import Grid from 'material-ui/Grid'
import IconButton from 'material-ui/IconButton'
import Img from 'react-image'
import { ListItem } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import SendIcon from 'material-ui-icons/Send'
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import { checkURL } from '../../containers/staticMethods'
import noImage from '../../img/no-img.png'

export const Loader = (props) => {
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
export const Message = (props) => {
    const { align, type, message, color } = props
    return <Typography type={type} align={align || "center"} noWrap={message.length > 70 ? true : false} color={color ? color : "inherit"} className="element-flex">{message}</Typography>
}
Message.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    align: PropTypes.string,
    color: PropTypes.string,
}
const PaperListItem = (props) => {
    return <ListItem button {...props}></ListItem>
}
export const Item = (props) => {
    const { openDetails, feature, attachment, config } = props
    return <div>
        <Paper component={PaperListItem} onClick={() => openDetails({ detailsModeEnabled: true, detailsOfFeature: feature })} elevation={0} className="list-item">
            <div className="list-item-text">
                <Message type="subheading" align="left" message={`${feature.getProperties()[config.titleAttribute]}`} />
                <Message type="body2" color="secondary" align="left" message={`${config.subtitleAttribute ? feature.getProperties()[config.subtitleAttribute] : ''}`} />
            </div>
            {config.enableImageListView && <Img className="big-avatar"
                src={[
                    attachment.length > 0 ? attachment[0].file : noImage
                ]}
                loader={<Loader />}
            />}
        </Paper>
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
            <div className="list-header">
                <Message align="left" message={subheader} type="headline" />
            </div>
            <Divider />
            {features && features.map((feature, index) => {
                const attachment = searchFilesById(feature.getId())
                return <Item key={index} classes={classes} feature={feature} config={config} attachment={attachment} openDetails={openDetails} />
            })}
        </div> :
        features && features.length == 0 ?
            <Message message={message} type="body2" /> :
            <Loader />)
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
                        <TableCell className="space-per-line">{checkURL(value) ? <URL url={value} classes={classes} /> : value}</TableCell>
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
export const MobileDrawer = (props) => {
    const { theme, mobileOpen, classes, handleDrawerToggle, childrenProps } =
        props
    return (
        <Drawer
            type="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            classes={{
                paper: classes.drawerPaper,
            }}
            onRequestClose={handleDrawerToggle}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerToggle}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>
            <Divider />

            <Paper className="paper"><CartoviewList {...childrenProps} /></Paper>
        </Drawer>
    )
}
MobileDrawer.propTypes = {
    mobileOpen: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    handleDrawerToggle: PropTypes.func.isRequired,
    childrenProps: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
}
export const CommentBox = (props) => {
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
            <Button onClick={addComment} raised color="accent" className={classes.button}>
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
export const DropZoneComponent = (props) => {
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
export const CartoviewSnackBar = (props) => {
    const {handleClose,open,message}=props
    return (
        <Snackbar
            open={open}
            onRequestClose={handleClose ? handleClose:()=>{}}
            transition={Fade}
            SnackbarContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span className="element-flex" id="message-id"><Loader size={20} thickness={4}/> {message}</span>}
        />
    )
}
CartoviewSnackBar.propTypes={
    handleClose:PropTypes.func,
    open:PropTypes.bool.isRequired,
    message:PropTypes.string.isRequired

}