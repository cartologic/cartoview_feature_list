import { createMuiTheme } from 'material-ui/styles'
import lightBlue from 'material-ui/colors/lightBlue'
import red from 'material-ui/colors/red'
export const theme = createMuiTheme( {
    palette: {
        primary: lightBlue,
        secondary: { 
            ...lightBlue,
            "A200": "#006064",
        },
        error: red,
    },
} )