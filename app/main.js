import './main.scss'
import template from './main.html'
import { Map } from './components/map/map'
import { InfoPanel } from './components/info-panel/info-panel'
import { ApiService } from './services/api'


/** Main UI Controller Class */
class ViewController {
    /** Initialize Application */
    constructor () {
      document.getElementById('app').outerHTML = template
      // Initialize API service
      console.log("window.location.hostname", window.location.hostname);
      if (window.location.hostname === '127.0.0.1') {
        console.log("here");
        this.api = new ApiService('http://localhost:5000/')
      } else {
        console.log("there");
        this.api = new ApiService('https://api.atlasofthrones.com/')
      }
  
      this.locationPointTypes = [ 'castle', 'city', 'town', 'ruin', 'region', 'landmark' ]
      this.initializeComponents()
      this.loadMapData()
    }

  /** Initialize Components with data and event listeners */
  initializeComponents () {
    // Initialize Info Panel
    this.infoComponent = new InfoPanel('info-panel-placeholder')
    this.mapComponent = new Map('map-placeholder')

  }

    /** Load map data from the API */
    async loadMapData () {
        // Download kingdom boundaries
        const kingdomsGeojson = await this.api.getKingdoms()
    
        // Add data to map
        this.mapComponent.addKingdomGeojson(kingdomsGeojson)
        
        // Show kingdom boundaries
        this.mapComponent.toggleLayer('kingdom')
    
        // Download location point geodata
        for (let locationType of this.locationPointTypes) {
          // Download GeoJSON + metadata
          const geojson = await this.api.getLocations(locationType)
    
          // Add data to map
          this.mapComponent.addLocationGeojson(locationType, geojson, this.getIconUrl(locationType))
          
          // Display location layer
          this.mapComponent.toggleLayer(locationType)
        }
      }
      
  /** Format icon URL for layer type  */
  getIconUrl (layerName) {
    return `https://cdn.patricktriest.com/atlas-of-thrones/icons/${layerName}.svg`
  }
}

window.ctrl = new ViewController()