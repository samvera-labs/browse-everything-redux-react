import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

class ResourceNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected
    }
  }

  render() {
    return (
      <div>
        <Checkbox
          checked={this.state.selected}
          value="selected"
          inputProps={
            {
              'aria-label': 'primary checkbox',
            }
          }
        />
        <IconButton aria-label="expand or collapse" size="small">
          <InsertDriveFileIcon fontSize="" />
        </IconButton>

        <span>{this.props.label}</span>
      </div>
    );
  }
}

ResourceNode.propTypes = {
  selected: PropTypes.bool,
  label: PropTypes.string.isRequired
};

ResourceNode.defaultProps = {
  selected: false
};

export default ResourceNode;
