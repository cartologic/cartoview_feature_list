import React, { Component } from 'react'

import PropTypes from 'prop-types'

export default class InfoModal extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        $(this.modal).modal('show')
        $(this.modal).on('hidden.bs.modal', this.props.handleHideModal)
    }
    render() {
        return (
            <div ref={(modalRef) => this.modal = modalRef} className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">{"Cartoview FeatureList"}</h4>
                        </div>
                        <div className="modal-body">
                            <p>
                                {"This app will allow creation of items that can display on the map and show on a list The app allows to search for items and further navigate to provide details Each item can have one or more images associated with it. To assign images to features or create new features, simply create a collector app or field observation app. The images entered in the other apps will show in the feature list thumb and in the feature details page"}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
InfoModal.propTypes = {
    handleHideModal: PropTypes.func.isRequired,
}
