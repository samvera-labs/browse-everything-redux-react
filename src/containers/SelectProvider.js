import React from 'react'
import './SelectProvider.css'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  }
})

const SelectProvider = ({ selectedProvider, providers, handleChange }) => {
  const classes = useStyles()
  const value = selectedProvider.id ? selectedProvider.id : ''
  const inputLabel = providers.isRequesting
    ? 'Loading providers...'
    : 'Select a storage provider'

  return (
    <FormControl
      data-testid="select-provider-wrapper"
      variant="outlined"
      className={classes.root}
    >
      <InputLabel htmlFor="provider">{inputLabel}</InputLabel>
      <Select
        data-testid="select-provider"
        value={value}
        onChange={handleChange}
        inputProps={{
          name: 'provider',
          id: 'provider'
        }}
        disabled={providers.items.length === 0}
      >
        {providers.items.map(provider => {
          return (
            <MenuItem key={provider.id} value={provider.id}>
              {provider.name}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

SelectProvider.propTypes = {
  selectedProvider: PropTypes.object.isRequired,
  providers: PropTypes.shape({
    items: PropTypes.array,
    id: PropTypes.string,
    name: PropTypes.string,
    isRequesting: PropTypes.bool
  }).isRequired,
  handleChange: PropTypes.func.isRequired
}

export default SelectProvider
