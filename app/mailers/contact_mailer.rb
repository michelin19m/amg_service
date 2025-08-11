# app/mailers/contact_mailer.rb
class ContactMailer < ApplicationMailer
  # recipient can be configured via ENV if you want; hardcoded per your request:
  RECIPIENT = "mm19022000@gmail.com"

  default to: RECIPIENT, from: "no-reply@yourdomain.com"

  # contact is a ContactMessage instance
  def contact_request(contact)
    @contact = contact
    mail(subject: "New contact request from website — #{@contact.name.presence || 'no name'}")
  end
end
