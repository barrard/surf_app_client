import React, { useContext } from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import BottomNavContext from '../../Context/BottomNavContext.js'

export default function BottomNav () {
  const {
    bottomNavSetting,
    setBottomNavSetting
  } = useContext(BottomNavContext)
  // const [value, setValue] = React.useState(0)

  return (
    <BottomNavigation
      style={bottom_nav_style}
      value={bottomNavSetting}
      onChange={(event, newValue) => {
        setBottomNavSetting(newValue)
      }}
      showLabels
      className='large-icons'
    >
      <BottomNavigationAction label='Swell' icon={<WaveIcon />} />
      <BottomNavigationAction label='Wind' icon={<WindIcon />} />
      <BottomNavigationAction label='Temp' icon={<TempIcon />} />
    </BottomNavigation>
  )
}

const bottom_nav_style = {
  display: 'flex',
  justifyContent: 'space-evenly'
}

function TempIcon () {
  return <i className='wi wi-thermometer' />
}

function WaveIcon () {
  return <i className='icon-big-wave wi' />
}

function WindIcon () {
  return <i className='wi wi-strong-wind' />
}
