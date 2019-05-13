import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import WizardTabs from './WizardTabs';
import ActionBar from '@cartologic/sdk/wizard/ActionBar';
import { postAppInstance, updateAppInstance } from '../api';


class ContentGrid extends Component {

    render() {
        return (
            <Row className="top-buffer">
                <Col>
                    <Row>
                        <ActionBar addAppInstance={() => postAppInstance(this.props.appInstance)}
                            updateAppInstance={() => updateAppInstance(this.props.appInstance)} />
                    </Row>
                    <Row>
                        <WizardTabs />
                    </Row>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => {
    return {
        appInstance: state.appInstance,
        appInstanceId: state.config.instanceToEdit ? state.config.instanceToEdit.id : null,
    }
}

export default connect(mapStateToProps)(ContentGrid);