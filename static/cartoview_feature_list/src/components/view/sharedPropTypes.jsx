import PropTypes from 'prop-types'
export const parentProptypes={
    classes: PropTypes.object.isRequired
}
export const upperPropTypes={
    ...parentProptypes,
    childrenProps: PropTypes.object.isRequired
}
export const upperPropTypesWithTheme={
    ...parentProptypes,
    childrenProps: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
}
const commentBasePropTypes={
    addComment: PropTypes.func.isRequired,
    comments: PropTypes.array,
}
export const commentsPropTypes={
    ...parentProptypes,
    comments: PropTypes.array,
    selectedFeature: PropTypes.object.isRequired,
    addComment: PropTypes.func.isRequired,
}
export const cartoviewListPropTypes={
    ...parentProptypes,
    config: PropTypes.object.isRequired,
    features: PropTypes.array,
    featureIdentifyResult: PropTypes.array,
    featuresIsLoading: PropTypes.bool.isRequired,
    attachmentIsLoading: PropTypes.bool.isRequired,
    selectionModeEnabled: PropTypes.bool.isRequired,
    featureIdentifyLoading: PropTypes.bool.isRequired,
    totalFeatures: PropTypes.number.isRequired,
    getFeatures: PropTypes.func.isRequired,
    zoomToFeature: PropTypes.func.isRequired,
    searchFilesById: PropTypes.func.isRequired,
    addStyleToFeature: PropTypes.func.isRequired,
    backToAllFeatures: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    searchCommentById:PropTypes.func.isRequired,
    ...commentBasePropTypes
}