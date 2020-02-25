import DOMPurify from 'dompurify'
import { trim } from './index'

const whiteList = [
  '需要<%= quest_ap - sp %><%= point_name %>来开始。',
  '使用道具恢复<%= point_name %>？',
  `来自<span class='txt-request-name'><%= n.attributes.called_user_name %></span>的救援请求`,
  '物品「<%= contents[0].higher_order_info.from_name %>」的<br>效果已经生效了，<br>所以「<%= contents[0].name %>」的效果无法生效',
  `来自<span class='txt-request-name'><%= raid['called_user_name'] %></span>的救援请求`,
  '还剩<%= can_quest_start_count %>回挑战（一共<%= max_quest_start_count %>回）',
  '<%= set_user.name %> Rank <%= set_user.rank %> 选择任务',
  '更改第<%= stamp.priority %>个表情',
  '→掷出了<%= log[i].result_number %>',
  '<%= log[i].nickname %>对<%= log[i].item_name %>进行ROLL点',
  '<%= log[i].nickname %>获得了<%= log[i].item_name %>',
  '阅读 <%= n.episode_name %>',
  '<%= title %>'
]

const filter = (str, notTrim = false) => {
  if (!whiteList.includes(str) && /[><]/.test(str)) {
    let _str = DOMPurify.sanitize(str)
    if (typeof _str !== 'string') {
      _str = _str.toString()
    }
    return notTrim ? _str : trim(_str)
  }
  return notTrim ? str : trim(str)
}

export default filter
