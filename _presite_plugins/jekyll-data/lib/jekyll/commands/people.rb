require 'open-uri'
require 'nokogiri'

class People
  attr_accessor :data, :sourceFilePattern

  def initialize(source, dest = "_data/raw/wiki/people_pages.yml")

      @sourceFilePattern = source
      existing = YAML.load(File.read(dest))
      @data = (existing) ? existing  : []
  end

  def capture(year)
     sourceFilePath = @sourceFilePattern.sub("{year}", year)
     #Jekyll.logger.info(sourceFilePath, outDir)
     read(sourceFilePath, year)
     write()
  end

  def count()
    return @data.size()
  end

  def read(uri, year)
    #Jekyll.logger.info(uri)
    doc = Nokogiri::HTML(open(uri))
    puts doc
    #records = doc.css('li a.internal')
    records = doc.css('a.d-block')
    addPersons(records, year)
  end

  def addPersons(people_links = [], year)
     people_links.each do | person |
        name = person.text
        #puts name
        named_person = @data.find{ |pr| name.eql? pr['name']}
        if (named_person)
           named_person['pages']<< { year => person['href']}
        else
            linkyear = { year => person['href']}
            new_record = { 'name' => name, 'pages' => [] }
            new_record['pages'] << linkyear
            @data << new_record
        end
     end
  end

  def write()
    updated_speaker_yaml = YAML.dump(@data)
    #Jekyll.logger.info(updated_speaker_yaml)
    File.write("_data/raw/wiki/people_pages.yml", updated_speaker_yaml)
  end

end
