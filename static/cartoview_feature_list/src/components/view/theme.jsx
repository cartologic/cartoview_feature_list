import { createMuiTheme } from 'material-ui/styles'
import indigo from 'material-ui/colors/indigo'
import lightBlue from 'material-ui/colors/lightBlue'
import red from 'material-ui/colors/red'
export const theme = createMuiTheme({
    palette: {
        primary: lightBlue,
        secondary: indigo,
        error: red,
    },
})