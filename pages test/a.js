import { withRouter } from 'next/router'
import Head from 'next/head'
import styled from 'styled-components'
// import moment from 'moment'
import dynamic from 'next/dynamic'

const Comp = dynamic(import('../components/Comp'))

const Title = styled.h1`
  color: yellow;
  font-size: 15px;
`

const A = ({ router, name, age, time }) => {

  return (
    <>
      <Head>
        <title>a page</title>
      </Head>
      <Title>a page</Title>
      <Comp />
      <span>{router.query.id}</span>
      <span className="age">{name} 's age is{age}</span>
      <p>{time}</p>
      <style jsx>
        {`
        span {
          color: #f1f11f;
        }
        .age {
          color: red;
        }
      `}
      </style>
      <style jsx global>
        {`
          .age {
            color: blue;
          }
        `}
      </style>
    </>
  )
}

A.getInitialProps = async ctx => {
  const moment = await import('moment')
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'appGt',
        age: 12,
        time: moment.default(Date.now() - 60 * 1000).fromNow(),
      })
    }, 1000)
  })
  return await promise
}

export default withRouter(A)