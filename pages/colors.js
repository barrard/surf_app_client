import React, { useRef } from "react";
import Sortable from "sortablejs";
import Head from "next/head";
class Colors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: [
        "cornflowerblue",
        "dodgerblue",
        "steelblue",
        "royalblue",
        "forestgreen",
        "greenyellow",
        "lightgreen",
        "darkorange",
        "yellow",
        "orange",
        "orangered",
        "red",
        "mediumvioletred",
        "palevioletred",
        "pink"
      ]
    };
  }

  componentDidMount() {
    let el = document.getElementById("items");
    var sortable = Sortable.create(el);
  }

  colors_list() {
    return this.state.colors.map((color, ft) => this.color_item(color, ft));
  }
  color_item(color, ft) {
    return (
      <li
        style={{
          width: "100px",
          height: "100px",
          background: color
        }}
      >{ft+1}ft</li>
    );
  }
  render() {
    return (
      <div>
        <Head>
          <title>Colors</title>
        </Head>

        <ul style={{display:'flex', listStyle:'none'}} id="items">{this.colors_list()}</ul>
      </div>
    );
  }
}

export default Colors;
