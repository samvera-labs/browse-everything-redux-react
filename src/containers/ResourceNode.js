import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import { withStyles } from '@material-ui/core/styles'

import {
  selectBytestreamForUpload,
  deselectBytestreamForUpload
} from '../actions'

class ResourceNode extends React.Component {
  constructor(props) {
    super(props)

    this.state = { selected: this.props.selected }
    this.handleChecked = this.handleChecked.bind(this)
  }

  handleChecked(event) {
    if (this.state.selected !== event.target.checked) {
      this.setState({ selected: event.target.checked })
    }

    if (event.target.checked) {
      this.props.dispatch(selectBytestreamForUpload(this.props.bytestream))
    } else {
      this.props.dispatch(deselectBytestreamForUpload(this.props.bytestream))
    }
  }

  render() {
    return (
      <div className={this.props.classes.root}>
        <Checkbox
          data-testid="resource-node-checkbox"
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
        >
          <InsertDriveFileIcon />
        </IconButton>

        <span>{this.props.label}</span>
      </div>
    )
  }
}

ResourceNode.propTypes = {
  classes: PropTypes.object,
  selected: PropTypes.bool,
  label: PropTypes.string.isRequired,
  bytestream: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

ResourceNode.defaultProps = {
  selected: false
}

const styles = {
  root: {
    marginLeft: '0.85rem'
  }
}

export default withStyles(styles)(ResourceNode)
