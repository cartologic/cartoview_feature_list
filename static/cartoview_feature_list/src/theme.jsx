import { createMuiTheme } from 'material-ui/styles'
import cyan from 'material-ui/colors/cyan'
import red from 'material-ui/colors/red'
import teal from 'material-ui/colors/teal'
export const theme = createMuiTheme( {
    palette: {
        primary: cyan,
        secondary: { 
            ...teal,
            "A200": "#006064",
        },
        error: red,
    },
} )