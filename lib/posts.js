import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import fetch from "node-fetch";
const base64 = require('js-base64').Base64;

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  // posts 配下のファイル名を取得する
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // id を取得するためにファイル名から".md"を削除する
    const id = fileName.replace(/\.md$/, '')

    // マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // 投稿のメタデータ部分を解析するために gray-matter を使う。
    const matterResult = matter(fileContents)

    // データをidと合わせる。
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export async function getAllPostIds() {
  // const fileNames = fs.readdirSync(postsDirectory)

  const repoUrl = "https://該当APIのURL"
  const response = await fetch(repoUrl)
  const files = await response.json()
  const fileNames = files.map(file => file.name)


  return fileNames.map(fileName => {
    return {
      params: {//paramsをもたせるルール。そうしないとgetStaticPathsが失敗する。
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}
//以下のような配列を返します。
// [
//   {
//     params: {
//       id: 'ssg-ssr'
//     }
//   },
//   {
//     params: {
//       id: 'pre-rendering'
//     }
//   }
// ]

//これはidに基づいてブログの投稿データを返します。
export async function getPostData(id) {//ここでasyncを使ったから、これをよんでいる元でも使わないといけない。
  // const fullPath = path.join(postsDirectory, `${id}.md`)
  // const fileContents = fs.readFileSync(fullPath, 'utf8')//ファイルの中身

  const repoUrl = `https://該当APIのURL${id}`
  const response = await fetch(repoUrl)
  const file = response.json()
  const fileContents = base64.decode(file.content)

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}
