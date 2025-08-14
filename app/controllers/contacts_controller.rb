class ContactsController < ApplicationController
    def index
        @lat   = 50.028264
        @lng   = 36.252615
        @zoom  = 15
        @title = "АМГ Сервіс \n вул. Шовковична 12"
    end
end
