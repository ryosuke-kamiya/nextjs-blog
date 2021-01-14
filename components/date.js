import { parseISO, format } from 'date-fns'

export default function Date({ dateString }) {//propsの分割代入
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
}
