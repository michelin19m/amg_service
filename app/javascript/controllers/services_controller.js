// app/javascript/controllers/services_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["extra", "button"]

  connect() {
    this.isOpen = false

    if (this.hasExtraTarget) {
      // Ensure predictable starting state
      const el = this.extraTarget
      el.style.overflow = "hidden"
      if (!el.style.maxHeight) el.style.maxHeight = "0px"
      // ensure transition exists (fallback)
      if (!el.style.transition) el.style.transition = "max-height 500ms ease"
      el.setAttribute("aria-hidden", "true")
    }

    if (this.hasButtonTarget) {
      this.buttonTarget.setAttribute("aria-expanded", "false")
    }

    this._onTransitionEnd = this._onTransitionEnd.bind(this)
  }

  toggle(event) {
    if (event) event.preventDefault()
    if (!this.hasExtraTarget) return

    if (this.isOpen) this.hide()
    else this.show()
  }

  show() {
    const el = this.extraTarget
    // ensure it's measurable
    el.style.display = "block"
    // measure height
    const fullHeight = el.scrollHeight

    // apply measured maxHeight (this triggers the transition)
    // use RAF to ensure browsers register the change properly
    requestAnimationFrame(() => {
      el.style.maxHeight = fullHeight + "px"
      el.setAttribute("aria-hidden", "false")
      this._setButtonState(true)
      el.addEventListener("transitionend", this._onTransitionEnd)
      this.isOpen = true
    })
  }

  hide() {
    const el = this.extraTarget
    // ensure current height is set so transition from current -> 0 works
    const current = el.scrollHeight
    el.style.maxHeight = current + "px"

    // collapse next frame
    requestAnimationFrame(() => {
      el.style.maxHeight = "0px"
      el.setAttribute("aria-hidden", "true")
      this._setButtonState(false)
      el.addEventListener("transitionend", this._onTransitionEnd)
      this.isOpen = false
    })
  }

  _onTransitionEnd(e) {
    if (e.target !== this.extraTarget || e.propertyName !== "max-height") return

    // when opened, clear max-height so content can grow/shrink naturally
    if (this.isOpen) {
      this.extraTarget.style.maxHeight = "none"
    } else {
      // keep max-height 0 when closed (no change)
      // optionally keep display none: this.extraTarget.style.display = 'none'
    }

    this.extraTarget.removeEventListener("transitionend", this._onTransitionEnd)
  }

  _setButtonState(open) {
    if (!this.hasButtonTarget) return
    this.buttonTarget.setAttribute("aria-expanded", String(open))
    const showText = this.buttonTarget.dataset.servicesShowText || "Показати ще"
    const hideText = this.buttonTarget.dataset.servicesHideText || "Приховати"
    const label = this.buttonTarget.querySelector(".label") || this.buttonTarget.querySelector("span")
    if (label) label.textContent = open ? hideText : showText
    const icon = this.buttonTarget.querySelector("i")
    if (icon) {
      if (open) icon.classList.add("rotate-180")
      else icon.classList.remove("rotate-180")
    }
  }

  disconnect() {
    if (this.hasExtraTarget) {
      this.extraTarget.removeEventListener("transitionend", this._onTransitionEnd)
    }
  }
}
