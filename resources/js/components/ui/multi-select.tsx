import React from 'react';
import Select, { Props as SelectProps, GroupBase } from 'react-select';

export default function MultiSelect<
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>
>(props: SelectProps<Option, IsMulti, Group>) {
    return (
        <Select
            classNamePrefix="react-select"
            {...props}
            styles={{
                control: (base, state) => ({
                    ...base,
                    backgroundColor: 'transparent',
                    borderColor: 'var(--input)',
                    ...(props.styles?.control ? props.styles.control(base, state) : {}),
                }),
                menu: (base, state) => ({
                    ...base,
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    ...(props.styles?.menu ? props.styles.menu(base, state) : {}),
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? 'var(--accent)' : 'transparent',
                    color: state.isFocused ? 'var(--accent-foreground)' : 'inherit',
                    ...(props.styles?.option ? props.styles.option(base, state) : {}),
                }),
                multiValue: (base, state) => ({
                    ...base,
                    backgroundColor: 'var(--secondary)',
                    ...(props.styles?.multiValue ? props.styles.multiValue(base, state) : {}),
                }),
                multiValueLabel: (base, state) => ({
                    ...base,
                    color: 'var(--secondary-foreground)',
                    ...(props.styles?.multiValueLabel ? props.styles.multiValueLabel(base, state) : {}),
                }),
                ...props.styles,
            }}
        />
    );
}
