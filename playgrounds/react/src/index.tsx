import React from 'react';
import ReactDOM from 'react-dom';

import { Color, Margin, Text, Select } from '@ds.e/react';

import '@ds.e/scss/lib/Utilities';
import '@ds.e/scss/lib/Margin';
import '@ds.e/scss/lib/Text';
import '@ds.e/scss/lib/Select';
import '@ds.e/scss/lib/global';

const options = [
	{
		label: 'Hello',
		value: 'hello'
	},
	{
		label: 'Bay',
		value: 'bay'
	},
	{
		label: 'Good morning',
		value: 'goodMorning'
	}
]

ReactDOM.render(
	<div style={{padding: '50px'}}>
		<Color hexCode="#000" />
		<Margin>
			<Text size="sm">Here text component</Text>
		</Margin>
		<Select options={options}/>
		<Margin top>
			<Select options={options} renderOption={({option, getOptionRecommendedProps}) => <li {...getOptionRecommendedProps({
				className: 'custom-className'
			})}>{option.label}</li>}/>
		</Margin>
	</div>,
	document.querySelector("#root")
)