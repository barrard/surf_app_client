import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
// import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import Minimize from '@material-ui/icons/Minimize'
import CropSquare from '@material-ui/icons/CropSquare'
import React, { useState } from 'react'
import PropTypes from 'prop-types'

export const colors = [
  'cornflowerblue',
  'dodgerblue',
  'steelblue',
  'royalblue',
  'forestgreen',
  'lightgreen',
  'greenyellow',
  'yellow',
  'darkorange',
  'orange',
  'orangered',
  'red',
  'mediumvioletred',
  'palevioletred',
  'pink'
]

export function colors_legend () {
  const [min, setMin] = useState(false)
  const minimize = () => setMin(!min)
  return (
    <div>
      <ColorsList handleMinimize={minimize} min={min} />
    </div>
  )
}

export function ColorsList ({ handleMinimize, min }) {
  return (
    <Container style={{ display: 'flex', position: 'relative' }}>
      <MinimizeBtn handleMinimize={handleMinimize} min={min} />
      <Grid container>
        {colors.map((color, ft) => (
          <ColorItem key={ft} color={color} ft={ft} min={min} />
        ))}
      </Grid>
    </Container>
  )
}
ColorsList.propTypes = {
  handleMinimize: PropTypes.func.isRequired,
  min: PropTypes.bool.isRequired
}
export function ColorItem ({ color, ft, min }) {
  return (
    <Grid
      item
      key={ft}
      style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // width: min? '20px':"50px",
        height: min ? '10px' : '25px',
        background: color
      }}
    >
      {<p style={{ fontSize: '9px' }}>{`${min ? ' ' : '<' + (ft + 1) + 'ft'}`}</p>}
    </Grid>
  )
}
ColorItem.propTypes = {
  color: PropTypes.string.isRequired,
  ft: PropTypes.number.isRequired,
  min: PropTypes.bool.isRequired
}
function MinimizeBtn ({ handleMinimize, min }) {
  return (
    <IconButton
      onClick={handleMinimize}
      style={{
        position: 'absolute',
        top: '-1px',
        zIndex: 100,
        right: '-4px',
        background: '#ddd',
        padding: '0'
      }}
      aria-label='Add Container'
    >
      {!min && <Minimize htmlColor='black' fontSize='small' />}
      {min && <CropSquare htmlColor='black' fontSize='small' />}
    </IconButton>
  )
}
MinimizeBtn.propTypes = {
  handleMinimize: PropTypes.func.isRequired,
  min: PropTypes.bool.isRequired
}
