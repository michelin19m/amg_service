import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["menu", "btn", "iconOpen", "iconClose", "logoIcon", "header"]

    connect() {
        window.addEventListener("scroll", this.onScroll.bind(this))
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
        window.removeEventListener("scroll", this.onScroll.bind(this))
        document.removeEventListener("click", this._outsideClickHandler)
        document.removeEventListener("keydown", this._escHandler)
    }

    onScroll() {
        if (window.scrollY > 100) {
            this.logoIconTarget.classList.add("h-[50px]", "w-[50px]", "md:h-[72px]", "md:w-[72px]")
            this.logoIconTarget.classList.remove("h-[72px]", "w-[72px]", "md:h-[93px]", "md:w-[93px]")
            this.headerTarget.classList.add("py-1")
            this.headerTarget.classList.remove("py-3", "md:py-4")
        //     this.element.classList.add("opacity-85")
        } else if (window.scrollY < 80) {
            this.logoIconTarget.classList.add("h-[72px]", "w-[72px]", "md:h-[93px]", "md:w-[93px]")
            this.logoIconTarget.classList.remove("h-[50px]", "w-[50px]", "md:h-[72px]", "md:w-[72px]")
            this.headerTarget.classList.add("py-3", "md:py-4")
            this.headerTarget.classList.remove("py-1")
        //     this.element.classList.remove("opacity-100")
        //     this.element.classList.remove("opacity-85")
        }
    }
}
