import Card, { CardContent, CardMedia } from 'material-ui/Card';

import Attachment from 'material-ui-icons/Attachment'
import Badge from 'material-ui/Badge'
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton'
import Img from 'react-image'
import PropTypes from 'prop-types'
import React from 'react'
import Typography from 'material-ui/Typography'
import { connect } from 'react-redux'
import noImage from '../img/no-img.png'
import { withStyles } from 'material-ui/styles'

const styles = theme => ( {
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column'
    },
    cover: {
        width: '100%',
        height: '100%',
        backgroundSize: '100% 100%'
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    }
} );
class FeatureListItem extends React.Component {
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
            feature,
            classes
        } = this.props
        return (
            <Grid container spacing={0}>
                        <Card onClick={this.props.onClick()} style={{width:'100%'}} className={classes.card}>
                        <Grid item xs={7} sm={7} md={8} >
                        <div className={classes.details}>
                            <CardContent>
                                <Typography type="headline">{feature.getProperties()[this.props.titleAttribute]}</Typography>
                                <Typography paragraph={true} type="subheading" color="secondary">
                                {feature.getProperties()[this.props.subtitleAttribute] && feature.getProperties()[this.props.subtitleAttribute].length > 70 ? `${feature.getProperties()[this.props.subtitleAttribute].slice(0,70)}...`:feature.getProperties()[this.props.subtitleAttribute]  }
                                </Typography>
                                
                            </CardContent>
                            <div className={classes.controls}>
                            <Typography type="subheading" color="secondary">
                            <Badge className={classes.badge} badgeContent={this.searchFilesById(feature.getId()).length} color="primary">
                                <Attachment />
                            </Badge>
                            </Typography>
                            </div>
                        </div>
                        </Grid>
                        <Grid item xs={5} sm={5} md={4} >
                        <CardMedia
                            className={classes.cover}
                            image={this.searchFilesById(feature.getId()).length > 0 ? this.searchFilesById(feature.getId())[0].file : noImage}
                            />
                        </Grid>
                        </Card>
                    </Grid>
        )
    }
}
FeatureListItem.propTypes = {
    subtitleAttribute: PropTypes.string.isRequired,
    titleAttribute: PropTypes.string.isRequired,
    feature: PropTypes.object.isRequired,
    files: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}
const mapStateToProps = ( state ) => {
    return {
        files: state.files,
    }
}
export default connect( mapStateToProps )( withStyles( styles )(
    FeatureListItem ) )
//     <div><div onClick={this.props.onClick()} className="row" >
//     <div className="col-xs-12 col-sm-2 col-md-2" style={{ textAlign: "center" }}>
//         <Img
//             src={[
//                 this.searchFilesById(feature.getId()).length > 0 ? this.searchFilesById(feature.getId())[0].file : null,
//                 noImage
//             ]}
//             loader={<Spinner className="loading-center" name="line-scale-party" color="steelblue" />}
//             className="img-responsive img-thumbnail"
//             style={{ height: 80 }}
//         />
//     </div>
//     <div id="description-block" className="col-xs-12 col-sm-10 col-md-10">
//         <h4>{feature.getProperties()[this.props.titleAttribute]}</h4>
//         <p>{feature.getProperties()[this.props.subtitleAttribute]}</p>
//         <p>Images : <span className="badge" >{this.searchFilesById(feature.getId()).length}</span></p>
//     </div>
// </div>
//     <hr />
// </div>
