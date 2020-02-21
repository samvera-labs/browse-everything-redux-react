import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import FolderIcon from '@material-ui/icons/Folder'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import {
  getContainer,
  selectContainerForUpload,
  deselectContainerForUpload
} from '../actions'
import ResourceNode from './ResourceNode'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
  root: {
    marginLeft: '0.85rem'
  }
})

const ResourceTree = ({ container, root, selected }) => {
  const [expanded, setExpanded] = useState(root)
  const [localSelected, setLocalSelected] = useState(selected)
  const dispatch = useDispatch()
  const classes = useStyles()

  const handleExpand = event => {
    dispatch(getContainer(container))
    setExpanded(true)
  }

  const handleCollapse = event => {
    setExpanded(false)
  }

  const handleChecked = event => {
    if (localSelected !== event.target.checked) {
      setLocalSelected(event.target.checked)
    }

    if (event.target.checked) {
      dispatch(selectContainerForUpload(container))
    } else {
      dispatch(deselectContainerForUpload(container))
    }
  }

  return (
    <div className={classes.root} data-testid="resource-tree-wrapper">
      <div>
        {!root && (
          <span>
            <Checkbox
              data-testid="primary-checkbox"
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
              onClick={expanded ? handleCollapse : handleExpand}
            >
              {expanded ? <FolderOpenIcon /> : <FolderIcon />}
            </IconButton>
          </span>
        )}
        <span>{label}</span>
      </div>

      <div>
        {expanded &&
          container.containers.map(child => (
            <StyledChildResourceTree
              key={child.id}
              label={child.name}
              container={child}
              dispatch={dispatch}
              selected={localSelected}
            />
          ))}
        {expanded &&
          container.bytestreams.map(child => (
            <ResourceNode
              key={child.id}
              label={child.name}
              bytestream={child}
              selected={localSelected}
              dispatch={dispatch} // TODO: This looks weird, probably should delete it
            />
          ))}
      </div>
    </div>
  )
}

ResourceTree.propTypes = {
  selected: PropTypes.bool,
  root: PropTypes.bool,
  label: PropTypes.string,
  container: PropTypes.object
}

export default ResourceTree
