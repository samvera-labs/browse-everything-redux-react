import React from 'react';
import './SelectProvider.css';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

class SelectProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      provider: this.props.provider
    };
  }

  render() {
    return (
      <FormControl variant="outlined" style={this.props.style.formControl}>
        <Select
          value={this.props.provider}
          onChange={this.props.handleChange}
          inputProps={
            {
              name: 'provider',
              id: 'provider'
            }
          }
        >
          <MenuItem value="file_system">File System</MenuItem>
          <MenuItem value="google_drive">Google Drive</MenuItem>
        </Select>
      </FormControl>
    );
  }
}

SelectProvider.propTypes = {
  style: PropTypes.object,
  provider: PropTypes.string,
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
