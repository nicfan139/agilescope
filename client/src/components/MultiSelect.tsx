import React from 'react';
import {
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Stack,
	Tag,
	TagCloseButton
} from '@chakra-ui/react';
import { AddIcon, CheckIcon } from '@chakra-ui/icons';

export type TMultiSelectOption = {
	label: string | React.ReactNode;
	value: string;
};

interface IMultiSelectProps {
	placeholder?: string;
	selected: Array<TMultiSelectOption>;
	options: Array<TMultiSelectOption>;
	onSelect: (option: TMultiSelectOption) => void;
	onUnselect: (option: TMultiSelectOption) => void;
}

export const MultiSelect = ({
	placeholder = 'Select multiple',
	selected,
	options,
	onSelect,
	onUnselect
}: IMultiSelectProps): React.ReactElement => {
	return (
		<>
			{selected.length > 0 && (
				<Stack direction="row" flexWrap="wrap" mb="0.5rem">
					{selected.map((option) => (
						<Tag colorScheme="green">
							{option.label}
							<TagCloseButton onClick={() => onUnselect(option)} />
						</Tag>
					))}
				</Stack>
			)}

			<Menu>
				<MenuButton as={Button} rightIcon={<AddIcon />}>
					{placeholder}
				</MenuButton>
				<MenuList>
					{options.map((option) => {
						const IS_SELECTED = selected.some((s) => s.value === option.value);
						return (
							<MenuItem
								onClick={() => !IS_SELECTED && onSelect(option)}
								justifyContent="space-between"
							>
								{option.label}

								{IS_SELECTED && <CheckIcon />}
							</MenuItem>
						);
					})}
				</MenuList>
			</Menu>
		</>
	);
};
