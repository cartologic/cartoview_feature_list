import { CircularProgress } from 'material-ui/Progress'
import React from 'react'

export const Loader = (props) => {
    const { classes } = props
    return (
        <div className={classes.loadingCenter} >
            <CircularProgress size={50} thickness={5} className={classes.progress}></CircularProgress>
        </div>
    )
}