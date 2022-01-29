import React, {createRef, FC, KeyboardEventHandler, ReactNode, RefObject, useEffect, useRef, useState} from 'react';
import Text from '../../atoms/Text';

const KEY_CODES = {
	ENTER: 'Enter',
	SPACE: 'Space',
	DOWN_ARROW: 'ArrowDown',
	UP_ARROW: 'ArrowUp',
	ESC: 'Escape'
}

interface SelectOption {
	label: string
	value: string
}

interface renderOptionProps {
	isSelected: boolean
	option: SelectOption
	getOptionRecommendedProps: (overrideProps?: Object) => Object
}

interface SelectProps {
	onOptionSelected?: (option: SelectOption, optionIndex: number) => void
	options?: SelectOption[]
	label?: string
	renderOption?: (props: renderOptionProps) => ReactNode
}

const getPrevOptionIndex = (currentIndex: number | null, options: SelectOption[]) => {
	if(currentIndex === null) {
		return 0;
	}
	
	if(currentIndex === 0) {
		return options.length -1;
	}
	
	return currentIndex - 1;
}

const getNextOptionIndex = (currentIndex: number | null, options: SelectOption[]) => {
	if(currentIndex === null) {
		return 0;
	}
	
	if(currentIndex === options.length -1) {
		return 0;
	}
	
	return currentIndex + 1;
}

const Select: FC<SelectProps> = ({options = [], label= "Please select an option ...", onOptionSelected, renderOption}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [overlayTop, setOverlayTop] = useState(0);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [highlightedIndex, setHighlightedIndex] =  useState<number | null>(null);
	const labelRef = useRef<HTMLButtonElement>(null);
	const [optionRefs, setOptionRefs] = useState<RefObject<HTMLLIElement>[]>([]);
	
	let selectedOption = null;
	
	if(selectedIndex !== null) {
		selectedOption = options[selectedIndex]
	};
	
	useEffect(() => {
		setOverlayTop((labelRef.current?.offsetHeight || 0) + 10)
	}, [labelRef.current?.offsetHeight]);
	
	useEffect(() => {
		setOptionRefs(options.map(_ => createRef<HTMLLIElement>()))
	}, [options?.length]);
	
	useEffect(() => {
		if(highlightedIndex !== null && isOpen) {
			const ref = optionRefs[highlightedIndex];
			if(ref?.current) {
				ref.current.focus();
			}
		}
	}, [isOpen, highlightedIndex]);
	
	const onHandleClicked = (option: SelectOption, optionIndex: number) => {
		
		if(onOptionSelected) {
			onOptionSelected(option, optionIndex)
		}
		
		setSelectedIndex(optionIndex);
		setIsOpen(false)
	};
	
	const onLabelClick = () => {
		setIsOpen((isOpen) => !isOpen)
	};
	
	const highlightOption = (optionIndex: number | null) => {
		setHighlightedIndex(optionIndex);
	};
	
	const onButtonKeyDown: KeyboardEventHandler = (event) => {
		event.preventDefault();
		
		if([KEY_CODES.ENTER, KEY_CODES.SPACE, KEY_CODES.DOWN_ARROW].includes(event.code)) {
			setIsOpen(true);
			highlightOption(0)
		}
	};
	
	const onOptionKeyDown: KeyboardEventHandler = (event) => {
		console.log('event:', event);
		if(event.code === KEY_CODES.ESC) {
			setIsOpen(false);
			return;
		}
		
		if(event.code === KEY_CODES.DOWN_ARROW) {
			highlightOption(getNextOptionIndex(highlightedIndex, options))
		}
		if(event.code === KEY_CODES.UP_ARROW) {
			highlightOption(getPrevOptionIndex(highlightedIndex, options))
		}
		if(event.code === KEY_CODES.ENTER) {
			onHandleClicked(options[highlightedIndex!], highlightedIndex!)
		}
	};
	
	return (
		<div className="dse-select">
			<button data-testid="DseSelectButton" ref={labelRef} className="dse-select__label" onClick={onLabelClick} onKeyDown={onButtonKeyDown} aria-haspopup={true} aria-expanded={isOpen ? true : undefined} aria-controls="dse-select-list">
				<Text>{selectedOption === null ? label : selectedOption.label}</Text>
					<svg width="1rem" height="1rem" xmlns="http://www.w3.org/2000/svg"
					     className={`dse-select__caret ${isOpen ? 'dse-select__caret--open': 'dse-select__caret--closed'}`}
					     fill="none"
					     viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d='M19 9l-7 7-7-7'/>
					</svg>
			</button>
			{isOpen ? <ul id="dse-select-list" style={{top: overlayTop}} className="dse-select__overlay" role="menu">
				{options.map((option, optionIndex) => {
					const isSelected = selectedIndex === optionIndex;
					const isHighlighted = highlightedIndex === optionIndex;
					
					const ref = optionRefs[optionIndex];
					const renderOptionProps = {
						option,
						isSelected,
						getOptionRecommendedProps: (overrideProps = {}) => {
							return {
								ref,
								tabIndex: isHighlighted ? -1 : 0,
								className: `dse-select__option
									${isSelected ? 'dse-select__option--selected' : ''}
									${isHighlighted ? 'dse-select__option--highlighted' : ''}
								`,
								key: option.value,
								'aria-checked': isSelected ? true : undefined,
								'aria-label': option.label,
								role: 'menuitemradio',
								onClick: () => onHandleClicked(option, optionIndex),
								onMouseEnter: () => highlightOption(optionIndex),
								onMouseLeave: () => highlightOption(null),
								onKeyDown: onOptionKeyDown,
								...overrideProps
							}
						}
					};
					
					if(renderOption) {
						return renderOption(renderOptionProps)
					}
					
					return (
						<li {...renderOptionProps.getOptionRecommendedProps()}>
							<Text>{option.label}</Text>
							{isSelected ? <svg width="1rem" height="1rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg> : null}
						</li>
					)
				})}
			</ul> : null}
		</div>
	);
};

export default Select;
