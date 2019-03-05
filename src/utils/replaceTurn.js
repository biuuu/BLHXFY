export default function (str) {
  return str.replace('ターン', '回合')
    .replace('turns', '回合')
    .replace('turn', '回合')
    .replace('Cooldown', '使用间隔')
    .replace('使用間隔', '使用间隔')
    .replace('初回召喚', '初次召唤')
    .replace('後', '后')
}
