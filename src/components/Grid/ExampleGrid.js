import React from 'react'
import {
  Contain,
  GridItem,
  AddRemoveBtns,
  useChildItems
} from './GridItems.js'

export default function SimpleContainer () {
  const [childItems, setChildItems] = useChildItems()

  return (
    <div style={{ position: 'relative' }}>
      <br />{/* needed to prevent main controls from overlapping */}
      <AddRemoveBtns
        addChild={{ setChildItems, childItems }}
      />
      <Contain>
        <GridItem />
      </Contain>
      {childItems}
    </div>
  )
}
