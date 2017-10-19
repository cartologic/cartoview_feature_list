import { createMuiTheme } from 'material-ui/styles'
import deepPurple from 'material-ui/colors/deepPurple'
import lightBlue from 'material-ui/colors/lightBlue'
import red from 'material-ui/colors/red'
export const theme = createMuiTheme( {
    palette: {
        primary: lightBlue,
        secondary: { 
            ...deepPurple,
        },
        error: red,
    },
} )