require 'open-uri'
require 'nokogiri'

class People
  attr_accessor :data, :sourceFile, :outDir

  def initialize(source, dest)
      @data = {}
      @sourceFile = source
      @outDir = dest
  end

  def capture(year)
     sourceFilePath = @sourceFile.sub("{year}", year)
     outDir = @outDir.sub("{year}", year)
     #Jekyll.logger.info(sourceFilePath, outDir)
     read(sourceFilePath)
  end

  def count()
    return @data.size()
  end

  def read(uri)
    #Jekyll.logger.info(uri)
    doc = Nokogiri::HTML(open(uri))
    records = doc.css('li a.internal')
    for r in records
      puts r.text
    end
  end

end
