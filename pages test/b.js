import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import myContext from '../lib/my-context'

function MyFunComp(props) {
  const [count, setCount] = useState(0)
  const context = useContext(myContext)
  // useEffect(() => {
  //   const Interval = setInterval(() => {
  //     setCount(c => c + 1)
  //   }, 1000)
  //   return () => clearInterval(Interval)
  // }, [])

  useEffect(() => console.log(props))

  return (
    <>
      <Head>
        <title>b hook demo</title>
      </Head>
      <span>{count}</span>
      <p>{context}</p>
    </>
  )
}

export default MyFunComp