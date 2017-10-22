import PropTypes from 'prop-types'
import React from 'react'

class CommentsList extends React.Component {
    constructor( props ) {
        super( props )
        this.state = {
            newComment: null
        }
    }
    render() {
        return ( null )
    }
}
CommentsList.propTypes={
    comments:PropTypes.array.isRequired
}