import React from 'react';
import './SelectProvider.css';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

class SelectProvider extends React.Component {
  render() {
    const value = this.props.selectedProvider.id ? this.props.selectedProvider.id : "";
    const inputLabel = this.props.providers.isRequesting ? "Loading providers..." : "Select a storage provider";

    return (
      <FormControl variant="outlined" style={this.props.style.formControl}>
        <InputLabel htmlFor="provider">{inputLabel}</InputLabel>
        <Select
          value={value}
          onChange={this.props.handleChange}
          inputProps={
            {
              name: 'provider',
              id: 'provider'
            }
          }
          disabled={this.props.providers.items.length === 0}
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
