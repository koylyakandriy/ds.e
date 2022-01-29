import React, {FC} from 'react';
import { FontSize } from '@ds.e/foundation';

interface TextProps {
	size?: keyof typeof FontSize;
}

const Text: FC<TextProps> = ({size = FontSize.base , children}) => {
	const className = `dse-font-${size}`
	return (
		<p className={className} >
			{children}
		</p>
	);
};

export default Text;
