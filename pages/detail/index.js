import dynamic from 'next/dynamic'
import withDetail from '../../components/with-repo-basic'
import api from '../../lib/api'
const MDRenderer = dynamic(
  () => import('../../components/MarkdownRender'),
  {
    loading: () => <p>loading</p>
  }
)

function Detail({ readme }) {
  return <MDRenderer content={readme.content} isBase64={true} />
}

Detail.getInitialProps = async ({ ctx: { query: { owner, name }, req, res } }) => {

  const readmeResp = await api.request({
    url: `/repos/${owner}/${name}/readme`
  }, req, res)

  return {
    readme: readmeResp.data
  }
}

export default withDetail(Detail, 'index')