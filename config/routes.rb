Rails.application.routes.draw do
  resources :ebooks
  root 'ebooks#index'
end
