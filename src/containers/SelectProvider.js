import React from 'react';
import './SelectProvider.css';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

class SelectProvider extends React.Component {
  render() {
    const selectedProvider = this.props.selectedProvider;
    const selectedValue = selectedProvider ? selectedProvider.id : "";

    return (
      <FormControl variant="outlined" style={this.props.style.formControl}>
        <Select
          value={selectedValue}
          onChange={this.props.handleChange}
          inputProps={
            {
              name: 'provider',
              id: 'provider'
            }
          }
        >
          {
            this.props.providers.items.map((provider) => {
              return <MenuItem key={provider.id} value={provider.id}>{provider.name}</MenuItem>
            })
          }
        </Select>
      </FormControl>
    );
  }
}

SelectProvider.propTypes = {
  style: PropTypes.object,
  selectedProvider: PropTypes.object.isRequired,
  providers: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

SelectProvider.defaultProps = {
  style: {
    formControl: {
      display: 'flex',
      flexWrap: 'wrap'
    }
  }
}

export default SelectProvider;
