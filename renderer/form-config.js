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
      btnLoading: false,
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
    <el-form ref="form" :model="configForm" label-width="100px" size="mini">
      <el-col :span="12">
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
        <el-form-item label="选项">
          <el-checkbox v-model="configForm.transScenario">剧情翻译</el-checkbox>
          <el-checkbox v-model="configForm.frontAgent">前置代理</el-checkbox>
          <el-checkbox v-model="configForm.transUi">界面翻译</el-checkbox>
          <el-checkbox v-model="configForm.autoUpdate">数据更新</el-checkbox>
          <el-checkbox v-model="configForm.staticServer">替换静态文件</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="静态文件端口">
          <el-input-number v-model="configForm.staticPort" :disabled="!configForm.staticServer" :min="1" :max="65535"></el-input-number>
        </el-form-item>
        <el-form-item label="前置代理端口">
          <el-input-number :min="1" :max="65535" :disabled="!configForm.frontAgent" v-model="configForm.frontAgentPort"></el-input-number>
        </el-form-item>
        <el-form-item label="自定义角色名">
          <el-input v-model="configForm.displayName" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item size="normal">
          <el-button type="primary" size="small" :loading="btnLoading" @click="onSubmit">保存配置</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  `
})
