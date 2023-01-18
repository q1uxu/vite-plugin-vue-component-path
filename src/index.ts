import path from 'path'
import type { FilterPattern, Plugin } from 'vite'
import { createFilter } from '@rollup/pluginutils'

export interface Options {
  /**
   * @description The attribute name of the DOM to show the component path
   * @default vue-component-path
   */
  attributeName?: string
  include?: FilterPattern
  exclude?: FilterPattern
}

export default function vueComponentPath(rawOptions: Options = {}): Plugin {
  const {
    include = /\.vue$/,
    exclude,
    attributeName = 'vue-component-path',
  } = rawOptions
  const filter = createFilter(include, exclude)

  return {
    name: 'vue-component-path',
    enforce: 'pre',
    apply: 'serve',
    async transform(code, id) {
      if (!filter(id)) {
        return code
      }

      const componentPath = path.relative(process.cwd(), id)

      return code.replace(
        /(<template>\s*?<[^>]+?)(\/?>)/,
        (_match, p1, p2) => `${p1} ${attributeName}="${componentPath}"${p2}`
      )
    },
  }
}
