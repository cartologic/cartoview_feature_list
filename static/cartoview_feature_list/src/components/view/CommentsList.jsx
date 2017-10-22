import List, { ListItem, ListItemText } from 'material-ui/List'

import Avatar from 'material-ui/Avatar'
import Button from 'material-ui/Button'
import { Message } from './statelessComponents'
import React from 'react'
import TextField from 'material-ui/TextField'
import { commentsPropTypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    avatar: {
        margin: 10,
    },
    list:{
        maxHeight: 250,
        overflowY: 'overlay'
    },
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    textCenter:{
        textAlign:'center'
    }
})
class CommentsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newComment: ''
        }
    }
    handleChange = (event) => {
        this.setState({
            newComment: event.target.value,
        })
    }
    addComment=()=>{
        const {addComment,selectedFeature}=this.props
        let {newComment}=this.state
        const data={text:newComment,feature_id:selectedFeature.getId(),tags:['feature_list',]}
        addComment(data)
        this.setState({newComment:''})
        
    }
    render() {
        const { classes, comments,username } = this.props
        return (
            <div>
                {comments && comments.length > 0 ?
                    <List className={classes.list}>
                        {comments.map((comment, index) => {
                            return <ListItem key={index} button className={classes.listItem}>
                                <Avatar className={classes.avatar}>{comment.username[0]}</Avatar>
                                <ListItemText primary={comment.username} secondary={comment.text} />
                            </ListItem>
                        })}
                    </List> : <Message message={'No Comments'} classes={classes} type="body2" />
                }
                {username !=="" && <div className={classes.textCenter}>
                    <TextField
                        id="multiline-flexible"
                        label="Comment"
                        multiline
                        rowsMax="4"
                        value={this.state.newComment}
                        onChange={this.handleChange}
                        className={classes.textField}
                        margin="normal"
                        fullWidth
                    />
                    <Button onClick={this.addComment} raised color="accent" className={classes.button}>
                        {'Send'}
                    </Button>
                </div>}
            </div>
        )
    }
}
CommentsList.propTypes = commentsPropTypes
export default withStyles(styles)(CommentsList)
