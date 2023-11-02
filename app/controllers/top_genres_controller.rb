class TopGenresController < ApplicationController

  def new
    # @authorized = true if params['code']
    @top_genre = TopGenre.new
  end

  def spotify
    @top_genre = TopGenre.new
  end

  def create
    @top_genre = TopGenre.new(top_genre_params)
    @top_genre.user = current_user
    if @top_genre.save
      redirect_to profile_path(current_user)
    else
      flash[:error] = "There was an issue with saving your top genres."
      render :new
    end
    # raise
  end

  def destroy_all
    current_user.top_genres.each do |genre|
      genre.delete
    end
  end

  private

  def top_genre_params
    params.require(:top_genre).permit(:genre)
  end
end
