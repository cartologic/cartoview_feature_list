import {
	blue,
	cyan,
	darkBlack,
	fullBlack,
	fullWhite,
	grey,
	pink,
	white
} from 'material-ui/colors';

import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';
import zIndex from 'material-ui/styles/zIndex';

export default {
	spacing: spacing,
	zIndex: zIndex,
	fontFamily: 'Roboto, sans-serif',
	palette: {
		primary1Color: blue[500],
		primary2Color: blue[700],
		primary3Color: grey[400],
		accent1Color: pink['A200'],
		accent2Color: grey[100],
		accent3Color: grey[500],
		textColor: darkBlack,
		alternateTextColor: white,
		canvasColor: fullWhite,
		borderColor: grey[300],
		disabledColor: fade(darkBlack, 0.3),
		pickerHeaderColor: blue[700],
		clockCircleColor: fade(darkBlack, 0.07),
		shadowColor: fullBlack,
	},
};
