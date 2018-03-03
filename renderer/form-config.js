const fs = require('fs')
const path = require('path')
const { dirname } = require('path')
const mkdirp = require('mkdirp')
const { ipcRenderer } = require('electron')

const configPath = path.resolve(process.cwd(), 'local/config.json')

const saveConfig = (config) => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

Vue.component('form-config', {
  data() {
    const config = JSON.parse(fs.readFileSync(configPath).toString('utf8'))
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
      if (this.configForm.port === this.configForm.webPort) {
        this.configForm.webPort = this.configForm.port + 1
      }
      saveConfig(this.configForm)
      ipcRenderer.send('update-config', this.configForm)
      window.close()
    }
  },
  template: `
    <el-form ref="form" :model="configForm" label-width="120px" size="mini">
      <el-form-item label="代理端口">
        <el-input-number v-model="configForm.port" :min="0" :max="65535"></el-input-number>
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
      <el-form-item label="解析HTTPS">
        <el-switch
          v-model="configForm.proxyHttps"
          active-text="开"
          inactive-text="关">
        </el-switch>
      </el-form-item>
      <el-form-item label="监控页端口">
        <el-input-number v-model="configForm.webPort" :min="0" :max="65535"></el-input-number>
      </el-form-item>
      <el-form-item label="前置代理">
        <el-switch
          v-model="configForm.frontAgent"
          active-text="开"
          inactive-text="关">
        </el-switch>
      </el-form-item>
      <el-form-item label="前置代理端口">
        <el-input-number :min="0" :max="65535" :disabled="!configForm.frontAgent" v-model="configForm.frontAgentPort"></el-input-number>
      </el-form-item>
      <el-form-item size="normal">
        <el-button type="primary" :loading="btnLoading" @click="onSubmit">保存配置</el-button>
      </el-form-item>
    </el-form>
  `
})