import React, {FC} from 'react';
import {Spacing} from "@ds.e/foundation";

interface MarginProps {
	space?: keyof typeof Spacing,
	left?: boolean,
	right?: boolean,
	top?: boolean,
	bottom?: boolean,
}

const Margin: FC<MarginProps> = ({space= Spacing.md, children, left, right, top, bottom}) => {
	let className = '';
	if(!left && !right && !top && !bottom) {
		className = `dse-margin-${space}`
	}
	
	if(left) {
		className = `dse-margin-left-${space} ${className}`
	}
	
	if(right) {
		className = `dse-margin-right-${space} ${className}`
	}
	
	if(top) {
		className = `dse-margin-top-${space} ${className}`
	}
	
	if(bottom) {
		className = `dse-margin-bottom-${space} ${className}`
	}
	
	return (
		<div className={className} >
			{children}
		</div>
	);
};

export default Margin;
