// app/javascript/controllers/map_controller.js
import { Controller } from "@hotwired/stimulus"
import maplibregl from "maplibre-gl"

export default class extends Controller {
  static values = {
    lat: Number,
    lng: Number,
    zoom: { type: Number, default: 14 },
    title: String
  }

  connect() {
    this.map = new maplibregl.Map({
      container: this.element,
      style: `https://api.maptiler.com/maps/cf85976b-9831-46ca-9615-1a66fd7f3967/style.json?key=15OOX9yCIsmO49FyoGAO`,
      center: [this.lngValue, this.latValue], // MapLibre uses [lng, lat]
      zoom: this.zoomValue,
      attributionControl: false
    })

    // Add zoom controls
    this.map.addControl(new maplibregl.NavigationControl(), 'top-right')

    // Add compact attribution, moved to bottom-left to avoid overlapping CTA
    this.map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')

    const popup = new maplibregl.Popup({ offset: 25 }).setText(this.titleValue || "")

    // Add a marker
    new maplibregl.Marker()
      .setLngLat([this.lngValue, this.latValue])
      .setPopup(popup)
      .addTo(this.map)

  }

  disconnect() {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  }
}
