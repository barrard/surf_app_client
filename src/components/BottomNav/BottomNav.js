import React from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

export default function BottomNav() {
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      style={bottom_nav_style}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className="large-icons"
    >
      <BottomNavigationAction label="Swell" icon={<WaveIcon />} />
      <BottomNavigationAction label="Wind" icon={<WindIcon />} />
      <BottomNavigationAction label="Temp" icon={<TempIcon />} />
    </BottomNavigation>
  );
}

const bottom_nav_style = {
  display: "flex",
  justifyContent: "space-evenly"
};

function TempIcon() {
  return <i className="wi wi-thermometer" />;
}

function WaveIcon() {
  return <i className="icon-big-wave wi" />;
}

function WindIcon() {
  return <i className="wi wi-strong-wind" />;
}
