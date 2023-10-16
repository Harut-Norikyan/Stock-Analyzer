import React from "react";
import Select from 'react-select';

const ReactSelectOption = props => {
  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
            ? '#6ab0de'
            : isFocused
              ? '#e7f2fa'
              : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
            ? 'white'
            : '#212121',

        cursor: isDisabled ? 'not-allowed' : 'default',
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && (isSelected ? '#6ab0de' : '#6ab0de')
        },
      };
    },
    menu: provided => ({ ...provided, zIndex: 9 })
  };
  const failedFieldName = props.name && props.name.charAt(0).toUpperCase() + props.name.slice(1);
  return <Select
    className={`basic-single ${props.className ? props.className : ""} ${(props.failedFields && props.failedFields.hasOwnProperty(failedFieldName))
      || (props.isInvalidSubmit && (props.value === null || props.value === undefined || props.value === false)) || props.isInvalidField ? "select-fail" : ""}`}
    classNamePrefix={`cryllex-select ${props.classNamePrefix ? props.classNamePrefix : ""}`}
    placeholder={props.placeholder ? props.placeholder : ""}
    name={props.name}
    defaultValue={props.defaultValue}
    value={props.selectedValue}
    options={props.items}
    isDisabled={props.isDisabled}
    isSearchable={props.isSearchable || false}
    onChange={props.onChange}
    styles={colourStyles}
    onFocus={props.onFocus}
    maxMenuHeight={300}
  />
}

export default ReactSelectOption;