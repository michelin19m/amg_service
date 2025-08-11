# app/controllers/contact_requests_controller.rb
class ContactRequestsController < ApplicationController
  def create
    @contact = ContactMessage.new(contact_params)

    if @contact.valid?
      # Queue email (non-blocking)
      ContactMailer.contact_request(@contact).deliver_now

      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.replace("contact_form", partial: "contact/thank_you") }
        format.html { redirect_to root_path(anchor: "contact"), notice: "Дякуємо — повідомлення надіслано." }
      end
    else
      # on validation error re-render the form partial with errors (Turbo-friendly)
      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.replace("contact_form", partial: "contact/form", locals: { contact: @contact }) }
        format.html { redirect_to root_path(anchor: "contact"), alert: @contact.errors.full_messages.join(", ") }
      end
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :phone, :message)
  end
end
