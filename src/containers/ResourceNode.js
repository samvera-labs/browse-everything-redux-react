import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'

import {
  selectBytestreamForUpload,
  deselectBytestreamForUpload
} from '../actions'

const useStyles = makeStyles({
  root: {
    marginLeft: '0.85rem'
  }
})

const ResourceNode = ({ selected = false, label, bytestream }) => {
  const [localSelected, setLocalSelected] = useState(selected)
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleChecked = event => {
    if (localSelected !== event.target.checked) {
      setLocalSelected(event.target.checked)
    }

    if (event.target.checked) {
      dispatch(selectBytestreamForUpload(bytestream))
    } else {
      dispatch(deselectBytestreamForUpload(bytestream))
    }
  }

  return (
    <div className={classes.root}>
      <Checkbox
        data-testid="resource-node-checkbox"
        checked={localSelected}
        onChange={handleChecked}
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

      <span>{label}</span>
    </div>
  )
}

ResourceNode.propTypes = {
  selected: PropTypes.bool,
  label: PropTypes.string.isRequired,
  bytestream: PropTypes.object.isRequired
}

export default ResourceNode
