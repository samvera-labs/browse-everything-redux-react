import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

class ResourceTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected,
      expanded: this.props.expanded
    }
  }

  render() {
    return (
      <div>
        <div>
          {!this.props.root && (
            <span>
              <IconButton aria-label="expand or collapse" size="small">
                <ArrowDownwardIcon fontSize="inherit" />
              </IconButton>
              <Checkbox
                checked={this.state.selected}
                value="selected"
                inputProps={
                  {
                    'aria-label': 'primary checkbox',
                  }
                }
              />
            </span>
          )}
          <span>{this.props.label}</span>
        </div>

        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

ResourceTree.propTypes = {
  styles: PropTypes.object,
  selected: PropTypes.bool,
  expanded: PropTypes.bool,
  root: PropTypes.bool,
  label: PropTypes.string.isRequired
};

ResourceTree.defaultProps = {
  selected: false,
  expanded: false,
  root: false
};

export default ResourceTree;
