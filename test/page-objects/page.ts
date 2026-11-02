import { browser, $ } from '@wdio/globals'
import type { ChainablePromiseElement } from 'webdriverio'

class Page {
  get pageHeading(): ChainablePromiseElement {
    return $('h1')
  }

  open(path: string) {
    return browser.url(path)
  }
}

export { Page }
