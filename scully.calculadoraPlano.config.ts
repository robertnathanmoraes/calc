import {ScullyConfig} from '@scullyio/scully'

import '@scullyio/scully-plugin-puppeteer'

export const config: ScullyConfig = {
  projectRoot: "./src",
  projectName: "calc",
  outDir: './dist/static',
  routes: {}
}
