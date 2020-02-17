import React from 'react';
import './SelectProvider.css';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';

class SelectProvider extends React.Component {
  render() {
    const value = this.props.selectedProvider.id ? this.props.selectedProvider.id : "";
    const inputLabel = this.props.providers.isRequesting ? "Loading providers..." : "Select a storage provider";

    return (
      <FormControl variant="outlined" className={this.props.classes.root}>
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
              return <MenuItem
                       key={provider.id}
                       value={provider.id}
                     >{provider.name}</MenuItem>
            })
          }
        </Select>
      </FormControl>
    );
  }
}

SelectProvider.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedProvider: PropTypes.object.isRequired,
  providers: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  }
};

export default withStyles(styles)(SelectProvider);
