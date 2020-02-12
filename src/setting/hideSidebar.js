import config from '../config'
import { insertCSS } from '../fetch'

const hideSidebar = () => {
  if (config.hideSidebar) {
    insertCSS('hide-sidebar')
  }
}

hideSidebar()
