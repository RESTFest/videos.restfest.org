require 'minitest/autorun'
require 'jekyll/commands/people'

class PeopleTest < Minitest::Test
  def test_init_args
     p = People.new("source{year}", "out{year}dir")
     assert_equal p.sourceFile , "source{year}"
     assert_equal p.outDir , "out{year}dir"
  end
end
