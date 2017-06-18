require 'test_helper'

class NuggetsControllerTest < ActionDispatch::IntegrationTest
  test "should get gallery" do
    get nuggets_gallery_url
    assert_response :success
  end

end
