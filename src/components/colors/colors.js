import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import Minimize from "@material-ui/icons/Minimize";
import Crop_Square from "@material-ui/icons/CropSquare";
import React, { useState } from "react";

export const colors = [
  "cornflowerblue", //1
  "dodgerblue",
  "steelblue",
  "royalblue",
  "forestgreen", //5
  "lightgreen",
  "greenyellow",
  "yellow", //8
  "darkorange",
  "orange",
  "orangered",
  "red",
  "mediumvioletred",
  "palevioletred",
  "pink"
];

export function colors_legend() {
  let [min, setMin] = useState(false);
  const minimize = () => setMin(!min);
  return (
    <div>
      <Colors_list handleMinimize={minimize} min={min} />
    </div>
  );
}

export function Colors_list({ handleMinimize, min }) {
  return (
    <Container style={{ display: "flex", position: "relative" }}>
      <MinimizeBtn handleMinimize={handleMinimize} min={min}/>
<Grid container>

      {colors.map((color, ft) => <Color_item color={color} ft={ft} min={min}/>)}
</Grid>
    </Container>
  );
}
export function Color_item({color, ft, min}) {
  return (
    <Grid
      item
      key={ft}
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // width: min? '20px':"50px",
        height: min? '10px':"25px",
        background: color
      }}
    >
      {<p>{`${min? ' ': '<'+(ft + 1)+'ft'}`}</p>}
    </Grid>
  );
}

function MinimizeBtn({handleMinimize, min}){
  return(
    <IconButton
    onClick={handleMinimize}
    style={{
      position: "absolute",
      top: "1px",
      right: "1px",
      background: "#ddd",
      padding: "0"
    }}
    aria-label="Add Container"
  >
    {!min && <Minimize htmlColor={"black"} fontSize={"small"} />}
    {min && <Crop_Square htmlColor={"black"} fontSize={"small"} />}
  </IconButton>
  )
}
