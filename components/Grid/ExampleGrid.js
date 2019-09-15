import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Contain,
  GridItem,
  GridKey,
  AddRemoveBtns,
  useChildItems,
  add
} from "./GridItems.js";
import { Grid } from "@material-ui/core";

export default function SimpleContainer() {
  let [childItems, setChildItems] = useChildItems();


  return (
    <div style={{ position: "relative" }}>
      <br/>{/* needed to prevent main controls from overlapping */}
      <AddRemoveBtns
        addChild={{setChildItems, childItems}}
      />
      <Contain>
        <GridItem/>
        </Contain>
            {childItems}
    </div>
  );
}
