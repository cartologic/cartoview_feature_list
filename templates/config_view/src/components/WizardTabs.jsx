import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';

import MapSelector from '@cartologic/sdk/wizard/tabsContent/MapSelector';
import GeneralConfig from '@cartologic/sdk/wizard/tabsContent/GeneralConfig';
import NavigationTools from '@cartologic/sdk/wizard/tabsContent/NavigationTools';
import AccessConfiguration from '@cartologic/sdk/wizard/tabsContent/AccessConfiguration';


class WizardTabs extends Component {

    state = {
        activeTab: "MapSelector"
    };

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab });
        }
    }

    render() {
        let NavListItmes = [
            { id: 'MapSelector', displayName: 'Select Map', component: <MapSelector /> },
            { id: 'GeneralConfig', displayName: 'General', component: <GeneralConfig /> },
            { id: 'AccessConfig', displayName: 'Access Configuration', component: <AccessConfiguration /> },
            { id: 'NavTools', displayName: 'Navigation Tools', component: <NavigationTools /> }];

        return (
            <React.Fragment>
                <Col lg={3}>
                    <Nav tabs vertical pills className="cartoviewNavList">
                        {NavListItmes.map(item => {
                            return <NavItem key={item.id}>
                                <NavLink
                                    className={this.state.activeTab === item.id ? "active" : null}
                                    disabled={!this.props.isAnyMapSelected}
                                    onClick={() => this.toggle(item.id)}>
                                    {item.displayName}
                                </NavLink>
                            </NavItem>
                        })}
                    </Nav>
                </Col>

                <Col lg={9}>
                    <TabContent activeTab={this.state.activeTab}>
                        {NavListItmes.map(item => {
                            return <TabPane tabId={item.id}>
                                <Row>
                                    <Col sm="12">{item.component} </Col>
                                </Row>
                            </TabPane>
                        })}
                    </TabContent>
                </Col>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAnyMapSelected: state.appInstance.app_map != null,
    }
}

export default connect(mapStateToProps)(WizardTabs);