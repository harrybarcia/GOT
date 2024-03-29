/**
 * Base component class to provide view ref binding, template insertion, and event listener setup
 */
export class Component {
    /** SearchPanel Component Constructor
     * @param { String } placeholderId - Element ID to inflate the component into
     * @param { Object } props - Component properties
     * @param { Object } props.events - Component event listeners
     * @param { Object } props.data - Component data properties
     * @param { String } template - HTML template to inflate into placeholder id
     */
    constructor (placeholderId, props = {}, template) {
      this.componentElem = document.getElementById(placeholderId)
  
      if (template) {
        // Load template into placeholder element
        this.componentElem.innerHTML = template
        // Find all refs in component
        this.refs = {}
        const refElems = this.componentElem.querySelectorAll('[ref]')
        console.log("refElems", refElems);
        refElems.forEach((elem) => { this.refs[elem.getAttribute('ref')] = elem })
      }
      if (props.events) { this.createEvents(props.events) }
    }
  
    /** Read "event" component parameters, and attach event listeners for each */
    createEvents (events) {
      Object.keys(events).forEach((eventName) => {
        this.componentElem.addEventListener(eventName, events[eventName], false)
      })
    }
  
    /** Trigger a component event with the provided "detail" payload */
    //triggerEvent comes form searchbar.js
    triggerEvent (eventName, detail) {
      console.log("eventName", eventName);// outputs "resultSelected" from 
      console.log("detail", detail);// outputs the item selected a point with a refindex
      const event = new window.CustomEvent(eventName, { detail })
      console.log("event", event);
      this.componentElem.dispatchEvent(event)
    }
  }