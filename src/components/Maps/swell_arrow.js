import ArrowUpward from "@material-ui/icons/ArrowUpward";
import { blue, red } from "@material-ui/core/colors";

export default function Swell_Arrow(props) {

  return (
    <ArrowUpward
      component={svgProps => {
        return (
          <svg {...svgProps}>
            <defs>
              <linearGradient id="gradient1">
                <stop offset="30%" stopColor={blue[400]} />
                <stop offset="70%" stopColor={red[400]} />
              </linearGradient>
            </defs>
            {React.cloneElement(svgProps.children[0], {
              fill: "url(#gradient1)"
            })}
          </svg>
        );
      }}
    />
  );
}
