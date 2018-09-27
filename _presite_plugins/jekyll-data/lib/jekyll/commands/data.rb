module Jekyll
  module Commands
    class Cfp < Command
      class << self
        def init_with_program(prog)
          prog.command(:speakers) do |c|
            c.action do |args, options|
              for wiki in args do
                Jekyll.logger.info(wiki)
              end
            end
          end
        end
      end
    end
  end
end
