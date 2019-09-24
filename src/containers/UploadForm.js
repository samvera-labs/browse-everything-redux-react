import React from 'react';
import './UploadForm.css';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import SelectProvider from './SelectProvider';
import AuthButton from './AuthButton';
import ResourceTree from './ResourceTree';
import ResourceNode from './ResourceNode';
import Grid from '@material-ui/core/Grid';
import { selectProvider } from '../actions';
import Paper from '@material-ui/core/Paper';

class UploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeProvider = this.handleChangeProvider.bind(this)
  }

  handleChangeProvider(event) {
    const provider = event.target.value;
    this.props.dispatch(selectProvider(provider));
  }

  render() {
    return (
      <form className="upload">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <SelectProvider style={this.props.style.selectProvider} handleChange={this.handleChangeProvider} provider={this.props.selectedProvider}/>
          </Grid>

          <Grid item xs={6} style={this.props.style.grid.item}>
            <AuthButton style={this.props.style.authButton} />
          </Grid>

          <Grid container spacing={3} align="left">
            <Grid item xs={12}>
              <Paper>
                <ResourceTree style={this.props.style.resourceTree} root={true} label="Current Files">

                  <ResourceTree style={this.props.style} label="Test Directory" />
                  <ResourceNode style={this.props.style} label="Test File" />
                </ResourceTree>
              </Paper>
            </Grid>
          </Grid>

          <Grid item xs={12} align="left">
            <label htmlFor="upload-form-submit">
              <Button variant="contained" color="primary" style={this.props.style.submit}>Upload</Button>
            </label>
          </Grid>

        </Grid>
      </form>
    );
  }
}

UploadForm.propTypes = {
  style: PropTypes.object,
  selectedProvider: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

UploadForm.defaultProps = {
  style: {
    submit: {
    },
    selectProvider: {
      formControl: {
        display: 'flex',
        flexWrap: 'wrap'
      }
    },
    grid: {
      item: {
        alignSelf: 'center'
      }
    },
    authButton: {
      alignSelf: 'center'
    }

  }
}

export default UploadForm;
