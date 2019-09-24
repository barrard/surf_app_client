import React from 'react'
import Head from 'next/head'
import { ColorsList } from '../src/components/colors/colors.js'
class Colors extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount () {
    // let el = document.getElementById("items");
    // var sortable = Sortable.create(el);
  }

  render () {
    return (
      <div>
        <Head>
          <title>Colors</title>
        </Head>

        <ColorsList />
      </div>
    )
  }
}

export default Colors
