import React from 'react'
import getMap, { add_buoy_markers, add_circle } from './getMap'
import PropTypes from 'prop-types'

class LeafletMap extends React.Component {
  static contextTypes = {};

  constructor (props) {
    super(props)
    this.state = {
      map: null,
      all_markers: {}
    }
  }

  componentDidMount () {
    const { handleClick } = this.props

    console.log(this.props)
    const map = getMap(handleClick)
    this.setState({ map })
  }

  componentDidUpdate (a, b) {
    const { map } = this.state
    console.log(this.props)

    const { buoy_data } = this.props
    if (buoy_data) {
      console.log(buoy_data)
      add_buoy_markers(buoy_data, this.props.bottomNavSetting, map)
    }
  }

  render () {
    const { map } = this.state

    if (map) {
      if (!this.props.latLng) {
        map.flyTo([0, 0], 2)
      } else {
        const { lat, lng } = this.props.latLng
        map.flyTo([lat, lng], 6)
        /* draw circle */
        add_circle([lat, lng], map)
      }
    }

    return (
      <div
        id='map'
        style={{
          width: '100%',
          height: '400px'
        }}
      />
    )
  }
}

LeafletMap.propTypes = {
  bottomNavSetting: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  buoy_data: PropTypes.object,
  latLng: PropTypes.object
}

export default LeafletMap
