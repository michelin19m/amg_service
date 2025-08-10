// app/javascript/controllers/header_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu", "btn", "iconOpen", "iconClose", "logoIcon", "header"]

  connect() {
    // preserve original open state logic
    this.open = false
    this._outsideClickHandler = this._outsideClick.bind(this)
    this._escHandler = this._onEsc.bind(this)

    // bind scroll handler once so we can remove it later
    this._onScrollBound = this.onScroll.bind(this)
    window.addEventListener("scroll", this._onScrollBound, { passive: true })

    // capture clicks on in-page anchors inside header (delegation)
    this._onNavClickBound = this._onNavClick.bind(this)
    this.element.addEventListener("click", this._onNavClickBound)

    // intersection observer to highlight active section link
    this._initSectionObserver()

    // state guard for onScroll shrink
    this._isSmall = false
  }

  disconnect() {
    window.removeEventListener("scroll", this._onScrollBound)
    this.element.removeEventListener("click", this._onNavClickBound)

    if (this._observer) {
      this._observer.disconnect()
      this._observer = null
    }

    // remove any document listeners added by toggle/close
    document.removeEventListener("click", this._outsideClickHandler)
    document.removeEventListener("keydown", this._escHandler)
  }

  /* ---------------- existing toggle/close/_applyState logic (kept) ---------------- */
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
    if (this.hasMenuTarget) {
      this.menuTarget.classList.toggle("hidden", !this.open)
    }
    if (this.hasBtnTarget) {
      this.btnTarget.setAttribute("aria-expanded", String(this.open))
    }
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

  /* ---------------- new: section observer + nav click handling ---------------- */

  _initSectionObserver() {
    // don't observe if header target not present
    if (!this.hasHeaderTarget) return

    const options = {
      root: null,
      // adjust for sticky header height so section visible under header
      rootMargin: `-${this.headerTarget.offsetHeight}px 0px 0px 0px`,
      threshold: 0.45,
    }

    this._observer = new IntersectionObserver(this._onSectionsIntersect.bind(this), options)

    // observe all sections with an id (you should mark your sections with id="home" / "services" / "contacts")
    document.querySelectorAll("section[id]").forEach((sec) => {
      this._observer.observe(sec)
    })
  }

  _onSectionsIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id")
        if (id) {
          this._setActiveLink(`#${id}`)
        }
      }
    })
  }

  _setActiveLink(href) {
    // clear existing
    this.element.querySelectorAll("nav a").forEach((a) => {
      a.classList.remove("underline")
    })
    // set new
    const link = this.element.querySelector(`a[href="${href}"]`)
    if (link) {
      link.classList.add("underline")
    }
  }

  _onNavClick(e) {
    // delegation: catch clicks on anchor tags with href starting with '#'
    const anchor = e.target.closest('a[href^="#"]')
    if (!anchor) return

    const href = anchor.getAttribute("href")
    if (!href || href === "#") return

    const target = document.querySelector(href)
    if (!target) return

    // if in-page link, handle smooth scroll
    e.preventDefault()

    // If mobile menu is open, close it first, then scroll after layout stabilizes.
    if (this.open) {
      this.close()
      // wait until DOM/layout updates — double rAF is a small, robust delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this._smoothScrollTo(target)
        })
      })
    } else {
      this._smoothScrollTo(target)
    }

    // highlight immediately
    this._setActiveLink(href)
  }

  _smoothScrollTo(target) {
    // use headerTarget (the sticky header) for offset — not menuTarget
    const headerH = this.hasHeaderTarget ? this.headerTarget.offsetHeight : 0

    // small extra offset so the heading isn't glued to the header
    const extraOffset = 8

    // compute absolute top and smooth-scroll
    const top = window.pageYOffset + target.getBoundingClientRect().top - headerH - extraOffset
    window.scrollTo({ top, behavior: "smooth" })
  }

  /* optional direct action handler if you want to use data-action="click->header#scrollToSection" */
  scrollToSection(e) {
    e.preventDefault()
    const href = e.currentTarget.getAttribute("href")
    const target = document.querySelector(href)
    if (target) {
      this._smoothScrollTo(target)
      this._setActiveLink(href)
      if (this.open) this.close()
    }
  }

  /* ---------------- keep onScroll but protect from repeated toggles ---------------- */
  onScroll() {
    const y = window.scrollY

    // shrink threshold (only toggle when state changes)
    if (y > 100 && !this._isSmall) {
      this._isSmall = true
      if (this.hasLogoIconTarget) {
        this.logoIconTarget.classList.add("h-[50px]", "w-[50px]", "md:h-[72px]", "md:w-[72px]")
        this.logoIconTarget.classList.remove("h-[72px]", "w-[72px]", "md:h-[93px]", "md:w-[93px]")
      }
      if (this.hasHeaderTarget) {
        this.headerTarget.classList.add("py-1")
        this.headerTarget.classList.remove("py-3", "md:py-4")
      }
    } else if (y < 80 && this._isSmall) {
      this._isSmall = false
      if (this.hasLogoIconTarget) {
        this.logoIconTarget.classList.add("h-[72px]", "w-[72px]", "md:h-[93px]", "md:w-[93px]")
        this.logoIconTarget.classList.remove("h-[50px]", "w-[50px]", "md:h-[72px]", "md:w-[72px]")
      }
      if (this.hasHeaderTarget) {
        this.headerTarget.classList.add("py-3", "md:py-4")
        this.headerTarget.classList.remove("py-1")
      }
    }
  }
}
