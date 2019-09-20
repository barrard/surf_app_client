import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import AddBoxTwoToneIcon from "@material-ui/icons/AddBoxTwoTone";
import CropLandscapeTwoToneIcon from "@material-ui/icons/CropLandscapeTwoTone";

const posRel = { position: "relative" };
const GridStyles = {
  MainContainer: {
    border: "red solid 3px"
  },
  GridContainer: {
    border: "blue solid 2px"
  },
  GridItem: {
    border: "green solid 1px"
  },
  ItemContainer: {
    border: "brown solid 2px"
  }
};
const useStyles = makeStyles(theme => ({
  zeroPad: { padding: 0 },
  topRight: {
    position: "absolute",
    top: 0,
    right: 0
  },
  ...GridStyles
}));
const getColor = style => style.border.split(" ")[0];
const ColoredP = ({ style }) => (
  <span style={{ color: getColor(style) }}>{getColor(style)}</span>
);
export function GridKey() {
  let { MainContainer, GridContainer, ItemContainer, GridItem } = GridStyles;
  return (
    <div>
      <p>
        The container border is <ColoredP style={MainContainer} />
      </p>
      <p>
        The Grid Container border is <ColoredP style={GridContainer} />
      </p>
      <p>
        The Grid Item border is <ColoredP style={GridItem} />
      </p>
      <p>
        The Item Container border is <ColoredP style={ItemContainer} />
      </p>
    </div>
  );
}

export function Contain({ children }) {
  console.log(children);
  const classes = useStyles();
  let [fixed, setFixed] = useState(true);
  let [maxWidth, setMaxWidth] = useState("xl");
  let [childItems, setChildItems] = useChildItems(children);
  let containerRef = React.createRef();

  const remove = () => {
    containerRef.current.remove();
  };
  console.log(childItems, setChildItems)

  return (
    <Container
      ref={containerRef}
      fixed={fixed}
      className={classes.MainContainer}
      maxWidth={maxWidth}
    >
      <Grid style={posRel}>
        <MainContainerControls
          maxWidth={maxWidth}
          fixed={fixed}
          setMaxWidth={setMaxWidth}
          setFixed={setFixed}
          useChild={{setChildItems, childItems}}
          remove={remove}
        />
      </Grid>
      {childItems}
    </Container>
  );
}

export function GridItem({ children }) {
  console.log(children);

  let [item, setItem] = useState(true);
  let [container, setContainer] = useState(false);
  let [size, setSize] = useState(12);
  let [spacing, setSpacing] = useState(0);
  let [childItems, setChildItems] = useChildItems(children);

  let itemRef = React.createRef();
  const borderStyle = (i, c) => {
    if (i && !c)
      return { border: `green solid ${childItems.length + 1}px` };
    if (!i && c)
      return { border: `blue solid ${childItems.length + 1}px` };
    if (i && c)
      return { border: `brown solid ${childItems.length + 1}px` };
  };
  let elProps = () => {
    let props = {
      item: item,
      container: container
    };
    if (item) props = { ...props, xs: size };
    if (container) props = { ...props, spacing: spacing };
    return props;
  };

  const remove = () => {
    itemRef.current.remove();
  };

  return (
    <Grid
      ref={itemRef}
      {...elProps()}
      style={{ ...borderStyle(item, container), ...posRel }}
    >
      <GridItemControls
        spacing={spacing}
        setSpacing={setSpacing}
        addChild={{setChildItems, childItems}}
        remove={remove}
        size={size}
        setSize={setSize}
        container={container}
        item={item}
        setItem={setItem}
        setContainer={setContainer}
      />
      {childItems}
    </Grid>
  );
}

function GridItemControls({
  spacing,
  setSpacing,
  addChild,
  remove,
  size,
  setSize,
  container,
  item,
  setItem,
  setContainer
}) {
  console.log(addChild)
  return (
    <Grid container justify="space-around">
      <AddRemoveBtns addChild={addChild} remove={remove} />
      {item && <SizeSelect val={size} setVal={setSize} />}
      {container && <SpacingSelect val={spacing} setVal={setSpacing} />}
      <ItemContainerCheckBoxes
        item={item}
        container={container}
        setItem={setItem}
        setContainer={setContainer}
      />
    </Grid>
  );
}

export function AddRemoveBtns({ addChild,remove }) {
  const classes = useStyles();
  console.log(addChild)
  let {setChildItems, childItems} = addChild


  return (
    <div className={classes.topRight}>
      <IconButton
        onClick={() => add(setChildItems, childItems, "container")}
        className={classes.zeroPad}
        aria-label="Add Container"
      >
        <CropLandscapeTwoToneIcon htmlColor={"goldenrod"} fontSize={"small"} />
      </IconButton>

      <IconButton
        onClick={() => add(setChildItems, childItems, "item")}
        className={classes.zeroPad}
        aria-label="plus"
      >
        <AddBoxTwoToneIcon htmlColor={"green"} fontSize={"small"} />
      </IconButton>
      {remove && (
        <IconButton
          onClick={remove}
          className={classes.zeroPad}
          aria-label="delete"
        >
          <HighlightOffTwoToneIcon htmlColor={"red"} fontSize={"small"} />
        </IconButton>
      )}
    </div>
  );
}

function ItemContainerCheckBoxes({ item, setItem, container, setContainer }) {
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            disabled={!container}
            checked={item}
            onChange={() => setItem(!item)}
            value="item"
            inputProps={{
              "aria-label": "item checkbox"
            }}
          />
        }
        label="Item"
      />

      <FormControlLabel
        control={
          <Checkbox
            disabled={!item}
            checked={container}
            onChange={() => setContainer(!container)}
            value="grid"
            color="primary"
            inputProps={{
              "aria-label": "container checkbox"
            }}
          />
        }
        label="Container"
      />
    </FormGroup>
  );
}

function MainContainerControls({
  maxWidth,
  setMaxWidth,
  fixed,
  setFixed,
  useChild,
  remove
}) {
  const isFixed = fixed => (fixed ? "Fixed" : "Fluid");
  const useStyles = makeStyles(theme => ({
    margin: {
      margin: theme.spacing(2)
    },
    padding: {
      padding: theme.spacing(0, 2)
    }
  }));
  const classes = useStyles();

  return (
    <Grid container justify="space-around">
      <Badge
        className={classes.margin}
        badgeContent={isFixed(fixed)}
        color="secondary"
      ></Badge>

      <Button onClick={() => setFixed(!fixed)}>
        {`Set to ${isFixed(!fixed)}`}
      </Button>
      <MaxWidthSelect val={maxWidth} setVal={setMaxWidth} />
      <AddRemoveBtns addChild={useChild} remove={remove} />
    </Grid>
  );
}

function SizeSelect({ val, setVal }) {
  const useStyles = makeStyles(theme => ({}));
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="item-size">Size</InputLabel>
      <Select
        value={val}
        onChange={e => setVal(e.target.value)}
        inputProps={{
          name: "size",
          id: "item-size"
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((v, i) => (
          <MenuItem value={v} key={i}>
            {v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
function SpacingSelect({ val, setVal }) {
  const useStyles = makeStyles(theme => ({}));
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="item-spacing">Spacing</InputLabel>
      <Select
        value={val}
        onChange={e => setVal(e.target.value)}
        inputProps={{
          name: "spacing",
          id: "item-spacing"
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => (
          <MenuItem value={v} key={i}>
            {v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
function MaxWidthSelect({ val, setVal }) {
  const useStyles = makeStyles(theme => ({}));
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="item-size">Size</InputLabel>
      <Select
        value={val}
        onChange={e => setVal(e.target.value)}
        inputProps={{
          name: "size",
          id: "item-size"
        }}
      >
        {["xs", "sm", "md", "lg", "xl"].map((v, i) => (
          <MenuItem value={v} key={i}>
            {v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function useChildItems(children) {
  console.log(children);

  let [childItems, setChildItems] = useState([]);
  useEffect(() => {
    if (children)
      if (Array.isArray(children))
        setChildItems([
          ...Array.from(children).map((child, key) => ({ ...child, key }))
        ]);
      else setChildItems([children]);
  }, []);

  return [childItems, setChildItems];
}

export function add(setChildItems, childItems, type) {
  if (type == "item")
    setChildItems([...childItems, <GridItem key={childItems.length + 1} />]);
  if (type == "container")
    setChildItems([...childItems, <Contain key={childItems.length + 1} />]);
}
