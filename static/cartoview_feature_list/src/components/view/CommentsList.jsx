import { CommentBox, Message } from './statelessComponents'
import List, { ListItem, ListItemText } from 'material-ui/List'

import Avatar from 'material-ui/Avatar'
import React from 'react'
import { commentsPropTypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    }
})
class CommentsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newComment: '',
            hasError: false
        }
    }
    handleChange = (event) => {
        this.setState({
            newComment: event.target.value,
            hasError: false
        })
    }
    addComment = () => {
        const { addComment, selectedFeature } = this.props
        let { newComment } = this.state
        if (newComment !== '') {
            const data = { text: newComment, feature_id: selectedFeature.getId(), tags: ['feature_list',] }
            addComment(data)
            this.setState({ newComment: '', hasError: false })
        } else {
            this.setState({ hasError: true })
        }


    }
    render() {
        const { classes, comments, username } = this.props
        const { newComment, hasError } = this.state
        return (
            <div>
                {comments && comments.length > 0 ?
                    <List className="comment-list">
                        {comments.map((comment, index) => {
                            return <ListItem key={index} button className={classes.listItem}>
                                <Avatar className="avatar">{comment.username[0].toUpperCase()}</Avatar>
                                <ListItemText primary={comment.username} secondary={comment.text} />
                            </ListItem>
                        })}
                    </List> : <Message message={'No Comments'} type="body2" />
                }
                {username !== "" && <CommentBox value={newComment} classes={classes} hasError={hasError} handleChange={this.handleChange} addComment={this.addComment} />}
            </div>
        )
    }
}
CommentsList.propTypes = commentsPropTypes
export default withStyles(styles)(CommentsList)
