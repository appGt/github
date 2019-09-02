import Router from 'next/router'

const bs = ['b', 'bs']

function B({ query }) {
  console.log(query)
  const gotoB = (item) => {
    Router.push({ pathname: `/${item}`, query: { random: Math.random() } })
  }
  return (
    <div>
      {
        bs.map((item,i) => <span style={{marginRight: 20}} key={i} onClick={() => gotoB(item)}>{item}</span>)
      }
    </div>
  )
}

B.getInitialProps = async ({ ctx }) => {
  console.log('getInitialProps',ctx.query)
  return {
    query: ctx.query
  }
}

export default B