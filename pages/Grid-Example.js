import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import GridExample from '../components/Grid/ExampleGrid.js'
const Home = () => (
  <div>
    <Head>
      <title>Home</title>
    </Head>

    <GridExample>

    </GridExample>


  {/* left for example */}
    <style jsx>{`
      {/* .hero {
        width: 100%;
        color: #333;
      } */}

      }
    `}</style>
  </div>
)

export default Home