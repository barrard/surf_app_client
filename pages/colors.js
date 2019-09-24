import React, { useRef } from "react";
import Sortable from "sortablejs";
import Head from "next/head";
import {Colors_list} from '../src/components/colors/colors.js'
class Colors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colors
    };
  }

  componentDidMount() {
    // let el = document.getElementById("items");
    // var sortable = Sortable.create(el);
  }

  render() {
    return (
      <div>
        <Head>
          <title>Colors</title>
        </Head>

          <Colors_list/>
      </div>
    );
  }
}

export default Colors;

