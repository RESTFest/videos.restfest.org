####
#  kick off the data scraping process as jekyll command.
#  --source https://github.com/RESTFest/{year}-Greenville/wiki/People
# can support multiple year arguments if applicable.
#
#####
module Jekyll
  module Commands
    class Cfp < Command
      class << self
        def init_with_program(prog)
          prog.command(:persons) do |c|
            c.action do |args, options|
              #Jekyll.logger.info(options);
              processor = People.new( options["source"] )
              for wiki in args do
                processor.capture(wiki)
              end
            end
          end
        end
      end
    end
  end
end
