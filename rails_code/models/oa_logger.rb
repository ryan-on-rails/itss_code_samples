##
# Represents a sequence of activities through pages.
class OaLogger

  def initialize()
  end
  def self.info(msg="")
    Logger.new("#{Rails.root}/log/oa_info.log").info(msg)
  end
  def self.error(msg="")
    Logger.new("#{Rails.root}/log/oa_error.log").error(msg)
  end

end
