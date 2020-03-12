import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import FolderIcon from '@material-ui/icons/Folder'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import {
  getContainer,
  selectContainerForUpload,
  deselectContainerForUpload
} from '../actions'
import ResourceNode from './ResourceNode'

class ResourceTree extends React.Component {
  constructor(props) {
    super(props)

    this.handleExpand = this.handleExpand.bind(this)
    this.handleCollapse = this.handleCollapse.bind(this)
    this.handleChecked = this.handleChecked.bind(this)

    // Root trees are always expanded and cannot be collapsed
    this.state = {
      expanded: this.props.root,
      selected: this.props.selected
    }
  }

  handleExpand(event) {
    this.props.dispatch(getContainer(this.props.container))
    this.setState({ expanded: true })
  }

  handleCollapse(event) {
    this.setState({ expanded: false })
  }

  handleChecked(event) {
    if (this.state.selected !== event.target.checked) {
      this.setState({ selected: event.target.checked })
    }

    if (event.target.checked) {
      this.props.dispatch(selectContainerForUpload(this.props.container))
    } else {
      this.props.dispatch(deselectContainerForUpload(this.props.container))
    }
  }

  render() {
    return (
      <div
        className={this.props.classes.root}
        data-testid="resource-tree-wrapper"
      >
        <div>
          {!this.props.root && (
            <span>
              <Checkbox
                data-testid="primary-checkbox"
                checked={this.state.selected}
                onChange={this.handleChecked}
                value="selected"
                inputProps={{
                  'aria-label': 'primary checkbox'
                }}
              />
              <IconButton
                data-testid="expand-collapse-button"
                aria-label="expand or collapse"
                size="small"
                onClick={
                  this.state.expanded ? this.handleCollapse : this.handleExpand
                }
              >
                {this.state.expanded ? <FolderOpenIcon /> : <FolderIcon />}
              </IconButton>
            </span>
          )}
          <span>{this.props.label}</span>
        </div>

        <div>
          {this.state.expanded &&
            this.props.container.containers.map(child => (
              <StyledChildResourceTree
                key={child.id}
                label={child.name}
                container={child}
                dispatch={this.props.dispatch}
                selected={this.state.selected}
              />
            ))}
          {this.state.expanded &&
            this.props.container.bytestreams.map(child => (
              <ResourceNode
                key={child.id}
                label={child.name}
                bytestream={child}
                selected={this.state.selected}
                dispatch={this.props.dispatch}
              />
            ))}
        </div>
      </div>
    )
  }
}

ResourceTree.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  root: PropTypes.bool,
  label: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  container: PropTypes.object
}

ResourceTree.defaultProps = {
  selected: false,
  root: false
}

const childStyles = {
  root: {
    marginLeft: '0.85rem'
  }
}

const styles = {
  root: {
    padding: '0.65rem 0.85rem',
    minHeight: '20rem'
  }
}

const StyledChildResourceTree = withStyles(childStyles)(ResourceTree)
export default withStyles(styles)(ResourceTree)
