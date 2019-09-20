// // import WeatherIcons from "react-weathericons";
import styled from "styled-components";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

export default function Buoy_Data_Label({ data, color_ft, size_period }) {
  // console.log({color_ft, size_period})
  /* has swell data or just temp? */
  let { ATMP, WDIR, WSPD, SwP, SwH, SwD, STEEPNESS  } = data;
  return (
    <Container className="buoy-data">
      <Grid className="cont" container justify="center" alignItems="center">
        {/* <span style={{ padding: "3px" }} className='icon-buoy lg-font'/> */}

        {/* <Grid item>
          {!isNaN(ATMP) && <Temp_Icon color="red" temp={ATMP} />}
        </Grid> */}
        
          <Grid item>
            <Wave_Icon
            color_ft={color_ft}
              size_period={size_period}
              dirrection={SwD}
              // STEEPNESS={STEEPNESS}
            />
          </Grid>
      

        {/* {!isNaN(WSPD) && !isNaN(WDIR) && (
          <Wind_Arrow color={"green"} speed={WSPD} dirrection={WDIR} />
        )} */}

        {/* <p>{data.ID}</p> */}
      </Grid>
    </Container>
  );
}
/* <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"             title="Flaticon">www.flaticon.com</a></div> */
const Wind_Arrow = ({ color, dirrection, speed }) => {
  return (
    <>
      <StyledI color={color} className={`wi wi-wind from-${dirrection}-deg`} />
      <p className="inline">{speed}</p>
    </>
  );
};
const Temp_Icon = ({ color, temp }) => {
  return (
    <>
      <StyledI color={color} className="wi wi-thermometer" />
      <p className="inline">{temp}</p>
    </>
  );
};

const Wave_Icon = ({ color_ft, size_period, dirrection, STEEPNESS }) => {
  // let [color1, color2] = colorSteepness(STEEPNESS)
  // console.log({ color_ft, size_period });
  //ft
  //period

  return (
    <>
      {/* WAVE SIZE ICON */}
      {/* <StyledSpan color={[color1, color2]} className="icon-big-wave wi" /> */}
      <br />
      {/* <p>{`${height} ft`}</p> */}

      {/* <Grid container className={`background-${color_seconds(period)}`}> */}
      {/* <p>{`${period} sec`}</p> */}

      {/* </Grid> */}
      {/* <br/> */}
      {/* SWELL DIRECTION */}
      {/* <p className="inline">{dirrection}</p> */}
      <Styled_WaveDirection_Icon
        color_ft={color_ft}
        size_period={size_period}
        className={`wi wi-wind wi-from-${dirrection.toLowerCase()}`}
      />
    </>
  );
};

// let StyledSpan = styled.span`
//   /* &::before{ */
//   /* content:'\f055'; */
//   padding: 3px;
//   background: linear-gradient(${props => `${props.color[0]}, ${props.color[1]}`});
//   -webkit-background-clip: text;
//   background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;

let Styled_WaveDirection_Icon = styled.i`
  /* padding: 3px; */
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  background: ${props => props.color_ft};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: ${props => props.size_period + "px"};
`;

// let StyledI = styled.i`
//   padding: 3px;
//   -webkit-text-stroke-width: 1px;
//   -webkit-text-stroke-color: black;
//   background: linear-gradient(${props => `${props.color[0],  (props.color[1] || props.color[0])}`});
//   -webkit-background-clip: text;
//   background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;


function colorSteepness(STEEPNESS) {
  switch (STEEPNESS) {
    case "STEEP":
      return ["blue", "white"];
    case "AVERAGE":
      return ["goldenrod", "red"];

    case "SWELL":
      return ["red", "white"];
  }
}
