import { ITEM_TYPES, createUltimatePagination } from 'react-ultimate-pagination'

import Button from 'material-ui/Button'
import ChevronLeft from 'material-ui-icons/ChevronLeft'
import ChevronRight from 'material-ui-icons/ChevronRight'
import FirstPage from 'material-ui-icons/FirstPage'
import IconButton from 'material-ui/IconButton';
import LastPage from 'material-ui-icons/LastPage'
import React from 'react'

const flatButtonStyle = {
    minWidth: 36
};
const Page = ( { value, isActive, onClick } ) => (
    <Button
	style={flatButtonStyle}
	color={isActive ? "primary" : "default"}
	onClick={onClick}>
	{value.toString( )}
	</Button>
)
const Ellipsis = ( { onClick } ) => (
    <Button style={flatButtonStyle} onClick={onClick}>{'...'}</Button> );
const FirstPageLink = ( { isActive, onClick } ) => (
    <IconButton color="accent"
		onClick={onClick}>
		<FirstPage/>
		</IconButton>
);
const PreviousPageLink = ( { isActive, onClick } ) => (
    <IconButton color="accent"
		onClick={onClick}>
		< ChevronLeft />
		</IconButton>
);
const NextPageLink = ( { isActive, onClick } ) => (
    <IconButton color="accent"
		onClick={onClick}>
		< ChevronRight />
		</IconButton>
);
const LastPageLink = ( { isActive, onClick } ) => (
    <IconButton color="accent"
		onClick={onClick}>< LastPage /></IconButton>
);
const itemTypeToComponent = {
	[ ITEM_TYPES.PAGE ]: Page,
	[ ITEM_TYPES.ELLIPSIS ]: Ellipsis,
	[ ITEM_TYPES.FIRST_PAGE_LINK ]: FirstPageLink,
	[ ITEM_TYPES.PREVIOUS_PAGE_LINK ]: PreviousPageLink,
	[ ITEM_TYPES.NEXT_PAGE_LINK ]: NextPageLink,
	[ ITEM_TYPES.LAST_PAGE_LINK ]: LastPageLink
};
const UltimatePaginationMaterialUi = createUltimatePagination( { itemTypeToComponent } );
export default UltimatePaginationMaterialUi
