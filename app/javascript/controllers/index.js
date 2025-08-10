// Import and register all your controllers from the importmap via controllers/**/*_controller
import { application } from "controllers/application"
import HeaderController from "controllers/header_controller"
application.register("header", HeaderController)
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
eagerLoadControllersFrom("controllers", application)
