import { useState, useCallback, useEffect } from 'react'
import { Avatar, Button, Select, Spin, message } from 'antd'
import dynamic from 'next/dynamic'

import withDetail from '../../components/with-repo-basic'
import UserSearch from '../../components/SearchUser'
import api from '../../lib/api'
import { getLastUpdated } from '../../lib/utils'

const MdRenderer = dynamic(() => import('../../components/MarkdownRender'))

const CATCH = {}

function IssueDetail({ issue }) {
  return (
    <div className="root">
      <MdRenderer content={issue.body} />
      <div className="actions">
        <Button
          href={issue.html_url}
          target="_blank"
        >
          打开Issue讨论页面
        </Button>
      </div>
      <style jsx>
        {`
          .root{
            background: #fefefe;
            padding: 20px;
          }
          .actions: {
            text-align: right;
          }
        `}
      </style>
    </div>
  )
}

function IssueItem({ issue }) {
  const [showDetail, setShowDetail] = useState(false)

  const toggleShowDetail = useCallback(() => {
    setShowDetail(detail => !detail)
  })

  return (
    <div>
      <div className="issue">
        <Button
          type="primary"
          size="small"
          style={{ position: 'absolute', right: 10, top: 10 }}
          onClick={toggleShowDetail}
        >
          {showDetail ? '隐藏' : '查看'}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            {
              issue.labels.map(label => <Label label={label} key={label.id} />)
            }
          </h6>
          <p className="sub-info">
            <span>Update at {getLastUpdated(issue.updated_at)}</span>
          </p>
        </div>
        <style jsx>
          {`
          .issue{
            display: flex;
            position: relative;
            padding: 10px;
            transition: all .3s;
          }
          .issue:hover{
            background: #fafafa;
          }
          .issue + .issue {
            border-top: 1px solid #eee;
          }
          .main-info > h6 {
            max-width: 600px;
            font-size: 16px;
            padding-right: 40px;
          }
          .avatar{
            margin-right: 20px;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span+span{
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}
        </style>
      </div>
      {showDetail ? <IssueDetail issue={issue} /> : null}
    </div>
  )
}

function makeQuery(creator, state, labels) {
  let creatorStr = creator ? `creator=${creator}` : ''
  let stateStr = state ? `state=${state}` : ''
  let labelStr = ''
  if (labels && labels.length > 0) {
    labelStr = `labels=${labels.join(',')}`
  }

  const arr = []

  if (creatorStr) arr.push(creatorStr)
  if (stateStr) arr.push(stateStr)
  if (labelStr) arr.push(labelStr)

  return `?${arr.join('&')}`
}

function Label({ label }) {
  return <>
    <span className="label" style={{ background: `#${label.color}` }}>{label.name}</span>
    <style jsx>{`
      .label {
        display: inline-block;
        margin-left: 15px;
        line-height: 20px;
        padding: 3px 10px;
        border-radius: 3px;
        font-size: 12px;
      }
    `}</style>
  </>
}

const isServer = typeof window !== 'undefined'
const Option = Select.Option
function Issues({ InitialIssues, labels, owner, name }) {

  const [creator, setCreator] = useState()
  const [state, setState] = useState()
  const [label, setLabel] = useState([])
  const [issues, setIssues] = useState(InitialIssues)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (!isServer) {
      CATCH[`${owner}/${name}`] = labels
    }
  }, [owner, name, label])

  const handleCreatorChange = useCallback((value) => {
    setCreator(value)
  }, [])

  const handleStateChange = useCallback((value) => {
    setState(value)
  }, [])

  const handleLabelChange = useCallback((value) => {
    setLabel(value)
  }, [])

  const handleSearch = useCallback(() => {
    setFetching(true)
    api.request({
      url: `/repos/${owner}/${name}/issues${makeQuery(creator, state, label)}`
    }).then(resp => {
      setFetching(false)
      setIssues(resp.data)
    }).catch(err => {
      message.error(err.message)
      setFetching(false)
    })
  }, [owner, name, creator, state, label])

  return <div className="root">
    <div className="search">

      <UserSearch onChange={handleCreatorChange} value={creator} />
      <Select
        style={{ width: 200, marginLeft: 20 }}
        placeholder="状态"
        onChange={handleStateChange}
        value={state}
      >
        <Option value="all">all</Option>
        <Option value="open">open</Option>
        <Option value="closed">closed</Option>
      </Select>
      <Select
        mode="multiple"
        style={{
          flexGrow: 1,
          marginLeft: 20,
          marginRight: 20,
        }}
        placeholder="label"
        onChange={handleLabelChange}
        value={label}
      >
        {
          labels.map(la => <Option value={la.name} key={la.id}>{la.name}</Option>)
        }
      </Select>
      <Button type="primary" onClick={handleSearch} disabled={fetching}>
        搜索
      </Button>
    </div>
    {
      fetching ? <div className="loading"><Spin /></div> :
        <div className="issues">
          {
            issues.map(issue => {
              return <IssueItem issue={issue} key={issue.id} />
            })
          }
        </div>
    }
    <style jsx>
      {`
        .loading {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .search{
          display: flex;
        }
        .issues{
          border: 1px solid #eee;
          margin-top: 20px;
        }
      `}
    </style>
  </div>
}

Issues.getInitialProps = async ({ ctx }) => {

  const { owner, name } = ctx.query
  const full_name = `${owner}/${name}`

  const labels =  CATCH[full_name]
  debugger
  const fetchs = await Promise.all([
    await api.request({
      url: `/repos/${owner}/${name}/issues`
    }, ctx.req, ctx.res),
    CATCH[full_name] ? Promise.resolve({ data: CATCH[full_name] }) : await api.request({
      url: `/repos/${owner}/${name}/labels`
    }, ctx.req, ctx.res)
  ])

  return {
    owner,
    name,
    InitialIssues: fetchs[0].data,
    labels: fetchs[1].data
  }
}

export default withDetail(Issues, 'issues')