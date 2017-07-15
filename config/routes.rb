Rails.application.routes.draw do
  resources :ebooks
  root 'ebooks#index'
  get '/bucket/ebook/:id/content/:path', to: 'ebooks#book_content', constraints: { path: /.+/ }
end
