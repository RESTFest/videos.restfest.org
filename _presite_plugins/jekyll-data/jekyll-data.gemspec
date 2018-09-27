# coding: utf-8
lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "jekyll/data/version"

Gem::Specification.new do |spec|
  spec.name          = "jekyll-data"
  spec.version       = Jekyll::Data::VERSION
  spec.authors       = ["lauramoore"]
  spec.email         = ["laura.moore@rightbox.com"]

  spec.summary       = %q{convert data sources to jekyll source files.}
  spec.description   = %q{read  data in and write data files out.}
  spec.homepage      = "https://github.com/restfest/videos.restfest.org"
  spec.license       = "Apache 2.0"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  if spec.respond_to?(:metadata)
    spec.metadata["allowed_push_host"] = "TODO: Set to 'http://mygemserver.com'"
  else
    raise "RubyGems 2.0 or newer is required to protect against " \
      "public gem pushes."
  end

  spec.files         = "lib/**"
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_dependency "jekyll", "~> 3.0"
  spec.add_dependency "nokogiri", "~> 1.8"
  spec.add_development_dependency "bundler", "~> 1.15"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "minitest", "~> 5.11"

end
