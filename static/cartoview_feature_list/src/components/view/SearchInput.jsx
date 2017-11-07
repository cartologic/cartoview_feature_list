import ArrowBackIcon from 'material-ui-icons/ArrowBack'
import Autosuggest from 'react-autosuggest'
import IconButton from 'material-ui/IconButton'
import {Loader} from './statelessComponents'
import { MenuItem } from 'material-ui/Menu'
import NavigationMenu from './NavigationMenu'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'material-ui/TextField'
import match from 'autosuggest-highlight/match'
import ol from 'openlayers'
import parse from 'autosuggest-highlight/parse'
import { withStyles } from 'material-ui/styles'

function renderInput(inputProps) {
    const { classes, autoFocus, value, ref, searchResultIsLoading, selectionModeEnabled, backToAllFeatures, urls, back, detailsModeEnabled, detailsOfFeature, ...other } =
        inputProps
    return (
        <Paper className="search-paper" elevation={1}>
            {!selectionModeEnabled && !detailsModeEnabled && <NavigationMenu urls={urls} />}
            {detailsModeEnabled && detailsOfFeature && <IconButton onClick={back} className="menu-button" aria-label="Menu">
                <ArrowBackIcon />
            </IconButton>}
            {selectionModeEnabled && !detailsModeEnabled && <IconButton onClick={backToAllFeatures} className="menu-button" aria-label="Menu">
                <ArrowBackIcon />
            </IconButton>}
            <TextField
                autoFocus={autoFocus}
                className={classes.textField}
                value={value}
                inputRef={ref}
                InputProps={{
                    classes: {
                        input: classes.input,
                    },
                    ...other,
                }}
            />
            {searchResultIsLoading && <Loader size={30} thickness={3} />}
        </Paper>
    )
}
const styles = theme => ({
    container: {
        flexGrow: 1,
        position: 'relative',
        height: 'auto',
        margin: "15px",
        width: "100%"
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 3,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    textField: {
        width: '100%',
    },
})
class IntegrationAutosuggest extends React.Component {
    state = {
        value: '',
        suggestions: [],
    }
    renderSuggestion = (suggestion, { query, isHighlighted }) => {
        const { openDetails } = this.props
        const matches = match(suggestion.label, query)
        const parts = parse(suggestion.label, matches)
        return (
            <MenuItem onClick={() => openDetails({ detailsModeEnabled: true, detailsOfFeature: suggestion.value })} selected={isHighlighted} component="div">
                <div>
                    {parts.map((part, index) => {
                        return part.highlight ? (
                            <span key={index} style={{ fontWeight: 300 }}>
                                {part.text}
                            </span>
                        ) : (
                                <strong key={index} style={{ fontWeight: 500 }}>
                                    {part.text}
                                </strong>
                            )
                    })}
                </div>
            </MenuItem>
        )
    }
    getSuggestionValue = (suggestion) => {
        return suggestion.label
    }
    renderSuggestionsContainer = (options) => {
        const { classes } = this.props
        const { containerProps, children } = options
        return (
            <Paper style={{
                zIndex: 123123,
                maxHeight: 200,
                overflowY: 'overlay'
            }} className={classes.paperContainer} {...containerProps} square>
                {children}
            </Paper>
        )
    }
    handleSuggestionsFetchRequested = ({ value }) => {
        let { config, search } = this.props
        search(value).then((json) => {
            let features = new ol.format.GeoJSON().readFeatures(
                json)
            // const total = json.totalFeatures
            let suggestions = features.map((feature, i) => {
                const filterValue = feature.getProperties()[
                    config.filters]
                return {
                    label: filterValue.toString(),
                    value: feature
                }
            })
            this.setState({
                suggestions
            })
        })
    }
    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        })
    }
    handleChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        })
    }
    render() {
        const { classes, config, back,
            detailsModeEnabled, detailsOfFeature, selectionModeEnabled, backToAllFeatures, urls, searchResultIsLoading } = this.props
        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={renderInput}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={{
                    autoFocus: true,
                    classes,
                    placeholder: `Search by ${config.filters}`,
                    value: this.state.value,
                    onChange: this.handleChange,
                    back, detailsModeEnabled, detailsOfFeature,
                    backToAllFeatures,
                    selectionModeEnabled,
                    searchResultIsLoading,
                    urls
                }}
            />
        )
    }
}
IntegrationAutosuggest.propTypes = {
    classes: PropTypes.object.isRequired,
    search: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired,
    openDetails: PropTypes.func.isRequired,
    backToAllFeatures: PropTypes.func.isRequired,
    detailsModeEnabled: PropTypes.bool.isRequired,
    selectionModeEnabled: PropTypes.bool.isRequired,
    searchResultIsLoading: PropTypes.bool.isRequired,
    detailsOfFeature: PropTypes.object,
    urls: PropTypes.object.isRequired,
    back: PropTypes.func.isRequired,

}
export default withStyles(styles)(IntegrationAutosuggest)
