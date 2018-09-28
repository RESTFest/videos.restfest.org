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
