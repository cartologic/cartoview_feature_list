import React from 'react'
import classNames from 'classnames'
export default class EditPageComponent extends React.Component {
    checkIfDisabled = (component) => {
        const { childrenProps } = this.props
        return (!childrenProps.selectedMap) ? component.name ===
            "MapSelector" ? false : true : false
    }
    getTabClassName = (component) => {
        return classNames({
            disabled: this.checkIfDisabled(component),
            active: component.name === "MapSelector"
        })
    }
    getContentClassName = (component) => {
        return classNames({
            "active": component.name === "MapSelector",
            "tab-pane fade in": true
        })
    }
    render() {
        const { childrenProps } = this.props
        return (
            <div className="row content">
                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                    <ul className="nav nav-pills nav-stacked">
                        {childrenProps.steps.map((step, index) => {
                            return (
                                <li key={index} className={this.getTabClassName(step.component)}>
                                    <a data-toggle={this.checkIfDisabled(step.component) ? "" : "tab"} href={this.checkIfDisabled(step.component) ? "#" : `#${step.component.name}`}>{step.title}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                    <div className="tab-content">
                        {childrenProps.steps.map((step, index) => {
                            return (
                                <div key={index} id={step.component.name} className={this.getContentClassName(step.component)}>
                                    <step.component urls={childrenProps.urls} {...step.props} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}
