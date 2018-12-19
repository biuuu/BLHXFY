import DOMPurify from 'dompurify'

const whiteList = [
  '需要<%= quest_ap - sp %><%= point_name %>来开始。',
  '使用道具恢复<%= point_name %>？',
  `来自<span class='txt-request-name'><%= n.attributes.called_user_name %></span>的救援请求`,
  `来自<span class='txt-request-name'><%= raid['called_user_name'] %></span>的救援请求`,
  '还剩<%= can_quest_start_count %>回挑战（一共<%= max_quest_start_count %>回）',
  '<%= set_user.name %> Rank <%= set_user.rank %> 选择任务',
  '更改第<%= stamp.priority %>个表情',
  '<%= title %>'
]

const filter = (str) => {
  if (!whiteList.includes(str)) {
    return DOMPurify.sanitize(str)
  }
  return str
}

export default filter
