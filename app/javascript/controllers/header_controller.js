// app/javascript/controllers/header_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu", "btn", "iconOpen", "iconClose"]

  connect() {
    this.open = false
    this._outsideClickHandler = this._outsideClick.bind(this)
    this._escHandler = this._onEsc.bind(this)
  }

  toggle(event) {
    event && event.preventDefault()
    this.open = !this.open
    this._applyState()
    if (this.open) {
      document.addEventListener("click", this._outsideClickHandler)
      document.addEventListener("keydown", this._escHandler)
    } else {
      document.removeEventListener("click", this._outsideClickHandler)
      document.removeEventListener("keydown", this._escHandler)
    }
  }

  close() {
    if (!this.open) return
    this.open = false
    this._applyState()
    document.removeEventListener("click", this._outsideClickHandler)
    document.removeEventListener("keydown", this._escHandler)
  }

  _applyState() {
    // toggle visibility of the mobile menu
    if (this.hasMenuTarget) {
      this.menuTarget.classList.toggle("hidden", !this.open)
    }
    // update button aria-expanded
    if (this.hasBtnTarget) {
      this.btnTarget.setAttribute("aria-expanded", String(this.open))
    }
    // swap icons
    if (this.hasIconOpenTarget && this.hasIconCloseTarget) {
      this.iconOpenTarget.classList.toggle("hidden", this.open)
      this.iconCloseTarget.classList.toggle("hidden", !this.open)
    }
  }

  _outsideClick(e) {
    if (!this.element.contains(e.target)) {
      this.close()
    }
  }

  _onEsc(e) {
    if (e.key === "Escape") {
      this.close()
    }
  }

  disconnect() {
    document.removeEventListener("click", this._outsideClickHandler)
    document.removeEventListener("keydown", this._escHandler)
  }
}
