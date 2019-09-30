import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { getContainer } from '../actions';
import ResourceNode from './ResourceNode';

class ResourceTree extends React.Component {
  state = {
    selected: false,
    expanded: false
  }

  constructor(props) {
    super(props);

    this.handleExpand = this.handleExpand.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
  }

  handleExpand(event) {
    this.props.dispatch(getContainer(this.props.container));
    this.setState({expanded: true});
  }

  handleCollapse(event) {
    this.setState({expanded: false});
  }

  render() {
    return (
      <div>
        <div>
          {!this.props.root && (
            <span>
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
                {this.state.expanded ? (
                  <FolderOpenIcon fontSize="" onClick={this.handleCollapse} />
                ) : (
                  <FolderIcon fontSize="" onClick={this.handleExpand} />
                )}
              </IconButton>
            </span>
          )}
          <span>{this.props.label}</span>
        </div>

        <div>
          {this.props.container.containers.map(child => <ResourceTree key={child.id} label={child.name} container={child} dispatch={this.props.dispatch} styles={this.props.styles} />)}
          {this.props.container.bytestreams.map(child => <ResourceNode key={child.id} label={child.name} styles={this.props.styles} />)}
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
  label: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  container: PropTypes.object
};

ResourceTree.defaultProps = {
  selected: false,
  expanded: false,
  root: false
};

export default ResourceTree;
