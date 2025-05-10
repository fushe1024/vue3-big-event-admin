import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        // 声明 El 开头的组件为全局变量
        ElMessageBox: 'readonly',
        ElMessage: 'readonly'
      }
    }
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,

  // vue 文件配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest'
      }
    },
    rules: {
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index']
        }
      ],
      'vue/no-setup-props-destructure': ['off'],
      // 新增组件命名规则例外
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          ignores: ['/^el-/']
        }
      ]
    }
  },

  // 自定义规则
  {
    rules: {
      'no-undef': 'error',
      'no-console': 'error',
      'vue/no-undef-components': 'off'
    }
  }
])
