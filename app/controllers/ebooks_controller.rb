class EbooksController < ApplicationController
  before_action :set_ebook, only: [:show, :edit, :update, :destroy, :book_content]

  #===============================================================
  # CUSTOM methods
  #===============================================================
  def book_content
    render :file => "/public/bucket/ebooks/#{@ebook.id}/content/#{params[:path]}"
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
      @ebook = Ebook.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def ebook_params
      params.require(:ebook).permit(:title, :content_href)
    end
end
