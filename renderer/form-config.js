const fs = require('fs-extra')
const path = require('path')
const { dirname } = require('path')
const mkdirp = require('mkdirp')
const { ipcRenderer, remote } = require('electron')

const configPath = path.resolve(remote.app.getPath('userData'), 'config.json')

const saveConfig = (config) => {
  fs.writeJsonSync(configPath, config, { spaces: 2 })
}

Vue.component('form-config', {
  data() {
    const config = fs.readJsonSync(configPath, { throws: false })
    return {
      bthLoading: false,
      configForm: Object.assign({}, config),
      optionsApi: [
        { label: 'game.granbluefantasy.jp', value: 'game.granbluefantasy.jp' },
        { label: 'gbf.game.mbga.jp', value: 'gbf.game.mbga.jp' }
      ]
    }
  },
  methods: {
    onSubmit () {
      this.bthLoading = true
      const { port, webPort, staticPort } = this.configForm
      if (port === webPort || port === staticPort || webPort === staticPort) {
        this.configForm.webPort = port + 1
        this.configForm.staticPort = port + 2
      }
      saveConfig(this.configForm)
      ipcRenderer.send('update-config', this.configForm)
      window.close()
    }
  },
  template: `
    <el-form ref="form" :model="configForm" label-width="120px" size="mini">
      <el-form-item label="代理端口">
        <el-input-number v-model="configForm.port" :min="1" :max="65535"></el-input-number>
      </el-form-item>
      <el-form-item label="游戏域名">
        <el-select
          v-model="configForm.apiHostNames"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请输入域名">
          <el-option
            v-for="item in optionsApi"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="剧情翻译">
        <el-switch
          v-model="configForm.transScenario"
          active-text="开"
          inactive-text="关">
        </el-switch>
      </el-form-item>
      <el-form-item label="自动更新数据">
        <el-switch
          v-model="configForm.autoUpdate"
          active-text="开"
          inactive-text="关">
        </el-switch>
        <span style="margin-left:4px;font-size:12px;color:#f56c6c">重启后生效</span>
      </el-form-item>
      <el-form-item label="解析HTTPS">
        <el-switch
          v-model="configForm.proxyHttps"
          active-text="开"
          inactive-text="关">
        </el-switch>
      </el-form-item>
      <el-form-item label="监控页端口">
        <el-input-number v-model="configForm.webPort" :min="1" :max="65535"></el-input-number>
      </el-form-item>
      <el-form-item label="静态文件端口">
        <el-input-number v-model="configForm.staticPort" :min="1" :max="65535"></el-input-number>
      </el-form-item>
      <el-form-item label="前置代理">
        <el-switch
          v-model="configForm.frontAgent"
          active-text="开"
          inactive-text="关">
        </el-switch>
      </el-form-item>
      <el-form-item label="前置代理端口">
        <el-input-number :min="1" :max="65535" :disabled="!configForm.frontAgent" v-model="configForm.frontAgentPort"></el-input-number>
      </el-form-item>
      <el-form-item size="normal">
        <el-button type="primary" :loading="btnLoading" @click="onSubmit">保存配置</el-button>
      </el-form-item>
    </el-form>
  `
})