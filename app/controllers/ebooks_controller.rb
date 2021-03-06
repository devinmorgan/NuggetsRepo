class EbooksController < ApplicationController
  before_action :set_ebook, only: [:show, :edit, :update, :destroy, :book_content, :new_section]

  #===============================================================
  # CUSTOM methods
  #===============================================================
  def book_content
    extension = File.extname(params[:path])[1..-1]
    mime_type = Mime::Type.lookup_by_extension(extension)
    cont_type = mime_type.to_s unless mime_type.nil?
    path_suffix = "ebook/#{@ebook.id}/content/#{params[:path]}"
    if cont_type == "image/jpeg" || cont_type == nil
      puts "\nRedirecting_To: #{params[:path]} as #{cont_type}\n\n"
      redirect_to(ENV["AWS_BUCKET_URL"] + path_suffix)
    else
      puts "\nRendering: #{params[:path]} as #{cont_type}\n\n"
      render(:file => ENV["LOCAL_BUCKET"] + "/" + path_suffix, content_type: cont_type)
    end
  end

  def new_section
    respond_to do |format|
      format.json { render :json => @ebook.new_section(params[:request_type])}
    end
  end

  #===============================================================
  # DEFAULT methods (from generate scaffold)
  #===============================================================

  # GET /ebooks
  # GET /ebooks.json
  def index
    @ebooks = Ebook.all
  end

  # GET /ebooks/1
  # GET /ebooks/1.json
  def show
    Ebook.load_and_store_new_epub(@ebook)
  end

  # GET /ebooks/new
  def new
    @ebook = Ebook.new
  end

  # GET /ebooks/1/edit
  def edit
  end

  # POST /ebooks
  # POST /ebooks.json
  def create
    @ebook = Ebook.new(ebook_params)

    respond_to do |format|
      if @ebook.save
        Ebook.process_epub(@ebook)
        format.html { redirect_to @ebook, notice: 'Ebook was successfully created.' }
        format.json { render :show, status: :created, location: @ebook }
      else
        format.html { render :new }
        format.json { render json: @ebook.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /ebooks/1
  # PATCH/PUT /ebooks/1.json
  def update
    respond_to do |format|
      if @ebook.update(ebook_params)
        format.html { redirect_to @ebook, notice: 'Ebook was successfully updated.' }
        format.json { render :show, status: :ok, location: @ebook }
      else
        format.html { render :edit }
        format.json { render json: @ebook.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ebooks/1
  # DELETE /ebooks/1.json
  def destroy
    Ebook.delete(@ebook)
    respond_to do |format|
      format.html { redirect_to ebooks_url, notice: 'Ebook was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ebook
      puts "params[:id]= #{params[:id]}:"
      @ebook = Ebook.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def ebook_params
      params.require(:ebook).permit(:title, :content_href)
    end
end
