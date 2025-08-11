# app/models/contact_message.rb
class ContactMessage
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :name, :string
  attribute :phone, :string
  attribute :message, :string

  validates :phone, presence: true
  validates :message, presence: true
end
