##
# Represents a unit of feedback (text/audio) for an
# activity response.
class Feedback < ActiveRecord::Base
  include TTSable
  require 'net/http'


  def update_en_audio
  	tts_server_url = "http://ec2-52-39-180-35.us-west-2.compute.amazonaws.com"
  	token = "0123456789"
  	uuid = self.slug
  	text = self.en_audio_text
  	url = URI.parse("#{tts_server_url}/tts?token=#{token}&uuid=#{uuid}&text=#{text}")
  	req = Net::HTTP::Get.new(url.to_s)
	res = Net::HTTP.start(url.host, url.port) {|http|
	  http.request(req)
	}
	res
	if res.code == 200

		##Todo... finish
		#make sure original is deleted
		#self.picture = URI.parse(url) #better way
		audio_file << open("#{tts_server_url}/wavs/#{slug}.wav").read
		json_file << open("#{tts_server_url}/wavs/#{slug}.json").read
	end
  end
end
