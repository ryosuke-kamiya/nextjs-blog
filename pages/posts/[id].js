import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}

//まずここで、どんなページを表示する可能性があるのか判断する
export async function getStaticPaths() {
  const paths = await getAllPostIds()
  return {
    paths,//この中に、これから動的で作られるurlのパスが書かれている。
    fallback: false//そのパスに該当しない場合、つまりfalseのときは４０４を返す
  }
}

//実際にビルドする時にそのページの中身を持ってくる。
export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}
