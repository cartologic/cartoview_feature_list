import {
    search,
    searchMode,
} from '../actions/features'

import Button from 'material-ui/Button';
import Close from 'material-ui-icons/Close'
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton'
import PropTypes from 'prop-types'
import React from 'react'
import Search from 'material-ui-icons/Search'
import TextField from 'material-ui/TextField'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'

const Styles = theme => ( {
    button: {
        margin: theme.spacing.unit,
    },
} )
class SearchInput extends React.Component {
    clearSearch = ( ) => {
        this.searchTextInput.value = ""
        this.props.setSearchMode( false )
    }
    render( ) {
        let {
            classes,
            filters
        } = this.props
        return (
            <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={8} >
             <div style={{width:'90%',paddingLeft:10,paddingRight:10}}>
             <TextField label="Search"
                inputRef = { (input) => this.searchTextInput = input }
                InputProps = { { placeholder: 'Search text' } }
                helperText = { `Search by ${filters.value} ` }
                fullWidth
                margin = "normal" />
             </div>
            </Grid>
            <Grid container align={'center'} justify={'center'} spacing={0} item xs={12} sm={12} md={4} >
                    <Grid item xs={6} sm={6} md={6} >
                        <Button dense color="primary" raised className={classes.button} onClick={() => this.props.search(undefined, this.searchTextInput.value, this.props.layerNameSpace, this.props.layerName, filters.value)}>
                            <Search/>
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} >
                        <Button dense color="primary" raised className={classes.button} onClick={() => this.clearSearch()}>
                            <Close/>
                        </Button>
                    </Grid>
            
                
            </Grid>
        </Grid>
        )
    }
}
SearchInput.propTypes = {
    filters: PropTypes.object.isRequired,
    setSearchMode: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    search: PropTypes.func.isRequired
}
const mapDispatchToProps = ( dispatch ) => {
    return {
        search: ( url, text, layerNameSpace, selectedLayerName, property ) => dispatch( search( url, text, layerNameSpace, selectedLayerName,property ) ),
        setSearchMode: ( bool ) => dispatch( searchMode( bool ) )
    }
}
export default connect( undefined,mapDispatchToProps )( withStyles( Styles )(SearchInput ) )
