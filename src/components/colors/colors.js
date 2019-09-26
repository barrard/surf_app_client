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

export function ColorsLegend ({ bottomNavSetting }) {
  const [min, setMin] = useState(false)
  const minimize = () => setMin(!min)
  return (
    <div>
      <ColorsList handleMinimize={minimize} min={min} bottomNavSetting={bottomNavSetting} />
    </div>
  )
}

ColorsLegend.propTypes = {
  bottomNavSetting: PropTypes.number.isRequired
}

export function ColorsList ({ handleMinimize, min, bottomNavSetting }) {
  return (
    <Container style={{ display: 'flex', position: 'relative' }}>
      <MinimizeBtn handleMinimize={handleMinimize} min={min} />
      <Grid container>
        {bottomNavSetting === 0 && colors.map((color, count) => (
          <ColorItem dataType='ft' key={count} color={color} count={count} min={min} />
        ))}
        {bottomNavSetting === 1 && colors.map((color, count) => (
          <ColorItem dataType='kts' key={count} color={color} count={count} min={min} />
        ))}
      </Grid>
    </Container>
  )
}
ColorsList.propTypes = {
  bottomNavSetting: PropTypes.number.isRequired,
  handleMinimize: PropTypes.func.isRequired,
  min: PropTypes.bool.isRequired
}
export function ColorItem ({ color, count, min, dataType }) {
  return (
    <Grid
      item
      key={count}
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
      {<p style={{ fontSize: '9px' }}>{`${min ? ' ' : '< ' + (dataTypeUnits(dataType, count)) + dataType}`}</p>}
    </Grid>
  )
}
function dataTypeUnits (dType, count) {
  if (dType === 'ft') return 1 + count
  else if (dType === 'kts') return (2 * count) + 2
}
ColorItem.propTypes = {
  dataType: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
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
