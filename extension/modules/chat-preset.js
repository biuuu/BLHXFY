import getChatData from '../store/chat-preset'

export default async function transChat(data) {
  if (!data.chat) return data
  const { chatMap, nChatMap } = await getChatData()
  for (let key in data.chat) {
    let item = data.chat[key]
    for (let ck in item) {
      let id = item[ck].chat_id
      if (chatMap.has(id)) {
        let hasSpecialTrans = false
        if (nChatMap.has(id)) {
          const { text, trans } = nChatMap.get(id)
          if (item[ck].text === text) {
            item[ck].text = trans
            hasSpecialTrans = true
          }
        }
        if (!hasSpecialTrans) {
          item[ck].text = chatMap.get(id)
        }
      }
    }
  }
  return data
}
