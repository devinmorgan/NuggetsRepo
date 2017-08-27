# This ONLY gets called when the server STARTS!!!!!! Not each time a page is called....makes sense right?
Rails.application.routes.draw do
  resources :annotations
  resources :ebooks
  root 'ebooks#index'
  get '/public/bucket/ebook/:id/content/:path', to: 'ebooks#book_content', constraints: { path: /.+/ }
  get '/ajax/ebook/:id/new_section/:request_type', to: 'ebooks#new_section'#, constraints: { request_type: /prev | next/}
end
