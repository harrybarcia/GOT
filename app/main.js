import './main.scss'
import template from './main.html'
import { Map } from './components/map/map'
import { InfoPanel } from './components/info-panel/info-panel'

/** Main UI Controller Class */
class ViewController {
   /** Initialize Application */
   constructor () {
    document.getElementById('app').outerHTML = template

    // Initialize API service
    if (window.location.hostname === 'localhost') {
      this.api = new ApiService('http://localhost:5000/')
    } else {
      this.api = new ApiService('https://api.atlasofthrones.com/')
    }

    this.initializeComponents()
  }

  /** Initialize Components with data and event listeners */
  initializeComponents () {
    // Initialize Info Panel
    this.infoComponent = new InfoPanel('info-panel-placeholder')
    this.mapComponent = new Map('map-placeholder')

  }
}

window.ctrl = new ViewController()