// // import WeatherIcons from "react-weathericons";
import styled from 'styled-components'
// import Container from '@material-ui/core/Container'
// import Grid from '@material-ui/core/Grid'
import React from 'react'
import PropTypes from 'prop-types'

export const WindIcon = ({ color, dirrection, speed, size }) => {
  return (
    <>
      <StyledI size={size} color={color} className={`wi wi-wind from-${dirrection}-deg`} />
      <p className='inline'>{speed}</p>
    </>
  )
}
WindIcon.propTypes = {
  color: PropTypes.func.isRequired,
  dirrection: PropTypes.bool.isRequired,
  speed: PropTypes.bool.isRequired
}
const TempIcon = ({ color, temp }) => {
  return (
    <>
      <StyledI color={color} className='wi wi-thermometer' />
      <p className='inline'>{temp}</p>
    </>
  )
}
TempIcon.propTypes = {
  color: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired
}

export const WaveIcon = ({ color_ft, size_period, SwD }) => {
  return (
    <StyledWaveDirectionIcon
      color_ft={color_ft}
      size_period={size_period}
      className={`wi wi-wind wi-from-${SwD.toLowerCase()}`}
    />
  )
}
WaveIcon.propTypes = {
  color_ft: PropTypes.string.isRequired,
  size_period: PropTypes.number.isRequired,
  SwD: PropTypes.string.isRequired
}

const StyledWaveDirectionIcon = styled.i`
  /* padding: 3px; */
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  background: ${props => props.color_ft};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: ${props => props.size_period + 'px'};
`

const StyledI = styled.i`
  font-size: ${props => props.size_period + 'px'};
  padding: 3px;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  background: linear-gradient(
    ${props => `${(props.color[0], props.color[1] || props.color[0])}`}
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`
