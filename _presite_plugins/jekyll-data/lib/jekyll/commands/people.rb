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
     Jekyll.logger.info(sourceFilePath, outDir)
  end

  def count()
    return @data.size()
  end

end
