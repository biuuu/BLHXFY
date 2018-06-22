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
      ],
      lang: config.lang,
      uiText: {
        port: { hans: '代理端口', hant: '代理端口' },
        domain: { hans: '游戏域名', hant: '游戲域名' },
        scenario: { hans: '剧情翻译', hant: '劇情翻譯' },
        frontProxy: { hans: '前置代理', hant: '前置代理' },
        ui: { hans: '界面翻译', hant: '界面翻譯' },
        dataUpdate: { hans: '数据更新', hant: '數據更新' },
        static: { hans: '替换静态文件', hant: '替換靜態文件' },
        staticPort: { hans: '静态文件端口', hant: '靜態文件端口' },
        frontProxyPort: { hans: '前置代理端口', hant: '前置代理端口' },
        charName: { hans: '自定义角色名', hant: '自定義角色名' },
        saveBtn: { hans: '保存配置', hant: '保存配置' },
        lang: { hans: '语言', hant: '語言' }
      }
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
      this.lang = this.configForm.lang
      ipcRenderer.send('update-config', this.configForm)
      window.close()
    }
  },
  template: `
    <el-form ref="form" :model="configForm" label-width="100px" size="mini">
      <el-col :span="12">
        <el-form-item :label="uiText.port[lang]">
          <el-input-number v-model="configForm.port" :min="1" :max="65535"></el-input-number>
        </el-form-item>
        <el-form-item :label="uiText.domain[lang]">
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
          <el-checkbox v-model="configForm.transScenario">{{uiText.scenario[lang]}}</el-checkbox>
          <el-checkbox v-model="configForm.frontAgent">{{uiText.frontProxy[lang]}}</el-checkbox>
          <el-checkbox v-model="configForm.transUi">{{uiText.ui[lang]}}</el-checkbox>
          <el-checkbox v-model="configForm.autoUpdate">{{uiText.dataUpdate[lang]}}</el-checkbox>
          <el-checkbox v-model="configForm.staticServer">{{uiText.static[lang]}}</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="uiText.lang[lang]">
          <el-radio-group v-model="configForm.lang" size="mini">
            <el-radio-button label="hans">简体</el-radio-button>
            <el-radio-button label="hant">繁體</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="uiText.staticPort[lang]">
          <el-input-number v-model="configForm.staticPort" :disabled="!configForm.staticServer" :min="1" :max="65535"></el-input-number>
        </el-form-item>
        <el-form-item :label="uiText.frontProxyPort[lang]">
          <el-input-number :min="1" :max="65535" :disabled="!configForm.frontAgent" v-model="configForm.frontAgentPort"></el-input-number>
        </el-form-item>
        <el-form-item :label="uiText.charName[lang]">
          <el-input v-model="configForm.displayName" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item size="normal">
          <el-button type="primary" size="small" :loading="btnLoading" @click="onSubmit">{{uiText.saveBtn[lang]}}</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  `
})
