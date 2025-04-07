/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Custom styles for react-select components used in the profile forms

export const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: '#d1d5db',
    boxShadow: 'none',
    minHeight: '42px',
    height: '42px',
    '&:hover': {
      borderColor: '#d1d5db',
    },
    '&:focus': {
      borderColor: '#d1d5db',
      boxShadow: 'none',
    }
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    height: '42px',
    padding: '0 6px',
    display: 'flex',
    alignItems: 'center',
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0px',
    color: '#374151',
    '& input:focus': {
      boxShadow: 'none !important',
    }
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: '42px',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#f3f4f6' : state.isFocused ? '#f9fafb' : null,
    color: '#374151',
    '&:hover': {
      backgroundColor: '#f9fafb',
    }
  }),
  container: (provided: any) => ({
    ...provided,
    width: '100%',
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9ca3af',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#6b7280',
    '&:hover': {
      color: '#374151',
    }
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: '#6b7280',
    '&:hover': {
      color: '#374151',
    }
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#f3f4f6',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#374151',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#6b7280',
    '&:hover': {
      backgroundColor: '#e5e7eb',
      color: '#374151',
    }
  }),
};
