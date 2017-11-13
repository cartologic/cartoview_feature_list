import t from 'tcomb-form'
export const listConfigFormSchema = () => {
    const selectTagItem = t.struct({
        value: t.String,
        label: t.String
    })
    const formSchema = t.struct({
        layer: t.String,
        titleAttribute: t.String,
        subtitleAttribute: t.maybe(t.String),
        filters: t.maybe(t.String),
        pagination: t.String,
        zoomOnSelect: t.Boolean,
        enableImageListView: t.Boolean,

    })
    return formSchema
}
export const detailsConfigFormSchema = () => {
    const selectTagItem = t.struct({
        value: t.String,
        label: t.String
    })
    const formSchema = t.struct({
        attachmentTags: t.maybe(t.list(selectTagItem)),
        attributesToDisplay: t.maybe(t.list(selectTagItem))

    })
    return formSchema
}
export const generalFormSchema = () => {
    const selectKeywordItem = t.struct({
        value: t.String,
        label: t.String
    })
    const accessOptions = t.enums({
        public: 'Public',
        private: 'Private'
    })
    const formSchema = t.struct({
        title: t.String,
        abstract: t.maybe(t.String),
        access: accessOptions,
        keywords: t.list(selectKeywordItem)
    })
    return formSchema
}
export const toolFormSchema = () => {
    const formSchema = t.struct({
        showZoombar: t.Boolean,
        showLayerSwitcher: t.Boolean,
        showBaseMapSwitcher: t.Boolean,
        showLegend: t.Boolean
    })
    return formSchema
}