import {
    attachmentFilesIsLoading,
    featureIsLoading,
    features,
    files,
    searchMode,
    searchResult,
    searchResultIsLoading,
    searchTotalFeatures,
    selectMode,
    selectedFeatures,
    totalFeatures
} from './features'
import { map, mapIsLoading } from './map'

import { combineReducers } from 'redux'

export default combineReducers( {
    features,
    featureIsLoading,
    totalFeatures,
    map,
    selectMode,
    files,
    searchMode,
    searchResult,
    searchResultIsLoading,
    searchTotalFeatures,
    attachmentFilesIsLoading,
    selectedFeatures,
    mapIsLoading

} )
