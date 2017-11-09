import Select, { AsyncCreatable } from 'react-select'

import React from 'react'

export const getKeywordsTemplate = (options) => {
    function renderInput(locals) {
        return <div style={{ paddingTop: 5, paddingBottom: 5 }} className={locals.hasError ? "has-error" : ""}>
            <label className={"control-label"}>{locals.label}</label>
            <AsyncCreatable
                {...locals}
                onChange={locals.onChange}
                inputProps={locals.inputProps}
                loadOptions={options.loadOptions}
                value={locals.value}
                multi={true}
                deleteRemoves={true}
                resetValue={null}
                placeholder={options.message} />
        </div>
    }

    return renderInput
}
export const getAttributesTemplate = (options) => {
    function renderInput(locals) {
        return <div style={{ paddingTop: 5, paddingBottom: 5 }} className={locals.hasError ? "has-error" : ""}>
            <label className={"control-label"}>{locals.label}</label>
            <Select
                {...locals}
                onChange={locals.onChange}
                inputProps={locals.inputProps}
                options={options.options}
                value={locals.value}
                multi={true}
                required={false}
                deleteRemoves={true}
                resetValue={null}
                placeholder={options.message} />
        </div>
    }

    return renderInput
}