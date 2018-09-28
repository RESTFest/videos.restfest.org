require 'open-uri'
require 'nokogiri'
######
# Process structure People pages from the wikis
# Writes out the following yml structure
# - name: {name}
#    pages:
#      - {year}: {link}
#
#  Intended to be used to aggregate pages by person's name.
######
class People
  attr_accessor :data, :sourceFilePattern
  ####
  #  Can process multiple sources,  you pass in a source file pattern with
  #  Variable {year} and then repeat call capture with different values
  #  to aggregate the subsequent years.
  #
  #  optional parameter, destination is the file (yml) to collect the output
  #  File will be read in so that you can progressively add new records to
  #  the same structure.
  ###
  def initialize(source, dest = "_data/raw/wiki/people_pages.yml")

      @sourceFilePattern = source
      existing = YAML.load(File.read(dest))
      @destFile = dest
      @data = (existing) ? existing  : []
  end

  #####
  # After setting up the parameters of in and out.  You can call this on
  # subsequent years to continue to scrape and build the data.
  # reads, parses, aggregates and writes.
  ####
  def capture(year)
     sourceFilePath = @sourceFilePattern.sub("{year}", year)
     #Jekyll.logger.info(sourceFilePath, outDir)
     read(sourceFilePath, year)
     write()
  end

  ####
  # The styles applied to the links active / passive change over time.
  # for now manually switch these if you need to.
  ###
  def read(uri, year)
    #Jekyll.logger.info(uri)
    doc = Nokogiri::HTML(open(uri))
    #puts doc
    #records = doc.css('li a.internal')  #from 2015
    records = doc.css('a.d-block')  # before 2015
    addPersons(records, year)
  end

 ###
 # No affordance for preventing duplicate year enteries by name yet.
 # Only ensures unique user names.
 # Also note that People on some years also include non-peoply things
 # I leave it as a issue request to expunge non people records from the data.
 # I also don't try to sort answers at this time,  UI can do that right?
 ###
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
    File.write(@dest, updated_speaker_yaml)
  end

end
