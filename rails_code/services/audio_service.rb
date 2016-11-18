class AudioService
  require 'net/http'
  require 'uri'
  require 'open-uri'


  def initialize()
    @tts_server = "http://ec2-52-39-180-35.us-west-2.compute.amazonaws.com"
    @tts_uri = URI.parse("#{@tts_server}/tts")
    @file_path = "#{@tts_server}/wavs/"
    @token = "0123456789"
    @voice = "Microsoft Zira Desktop"
    @es_voice = "Microsoft Sabina Desktop"
    @monologue_or_feedback = nil
    @uuid = "tts"
    @es_uuid = "tts_es"
  end


  def get_new_audio(monologue_or_feedback)
    @monologue_or_feedback = monologue_or_feedback
    @uuid = @monologue_or_feedback.slug
    @es_uuid = "#{@monologue_or_feedback.slug}_es"
    tts_res = request_tts
    es_tts_res = request_es_tts
    if tts_res == true || es_tts_res == true
      update_element_with_audio() 
    else
      {message: "TTS server error:"}
    end
  end

  def preview_new_audio(monologue_or_feedback, new_text)
    @monologue_or_feedback = monologue_or_feedback
    @monologue_or_feedback.en_audio_text = new_text
    @uuid = @monologue_or_feedback.slug+"_preview"
    tts_res = request_tts
    if tts_res == true
      mp3_resp = Net::HTTP.get_response(URI.parse("#{@file_path}#{@uuid}.mp3"))
      if mp3_resp.code == "200"
        "#{@file_path}#{@uuid}.mp3"
      else
        wav_resp = Net::HTTP.get_response(URI.parse("#{@file_path}#{@uuid}.wav"))
        if wav_resp.code == "200"
          "#{@file_path}#{@uuid}.wav"         
        else
          {message: "TTS server error:"}
        end

      end

    else
      {message: "TTS server error:"}
    end
  end

  

  private

  def request_tts()
    return false unless @monologue_or_feedback.present?
    text = @monologue_or_feedback.en_audio_text || @monologue_or_feedback.en_text
    params = {token: @token, uuid: @uuid, text: text, voice: @voice}

    @tts_uri.query = URI.encode_www_form(params)
    response = Net::HTTP.get_response(@tts_uri)
    if(response.code == "200")
      return true 
    else
      return false
    end
  end

  def request_es_tts()
    return false unless @monologue_or_feedback.present?
    text = @monologue_or_feedback.es_audio_text || @monologue_or_feedback.es_text
    return false unless text.present?
    params = {token: @token, uuid: @es_uuid, text: text, voice: @es_voice}

    @tts_uri.query = URI.encode_www_form(params)
    response = Net::HTTP.get_response(@tts_uri)
    if(response.code == "200")
      return true 
    else
      return false
    end
  end


  def update_element_with_audio()
    mp3_file = "#{Rails.root}/tmp/#{@uuid}.mp3"
    wav_file = "#{Rails.root}/tmp/#{@uuid}.wav"
    json_resp = Net::HTTP.get_response(URI.parse("#{@file_path}#{@uuid}.json"))
    mp3_resp = Net::HTTP.get_response(URI.parse("#{@file_path}#{@uuid}.mp3"))

    es_mp3_file = "#{Rails.root}/tmp/#{@es_uuid}.mp3"
    es_wav_file = "#{Rails.root}/tmp/#{@es_uuid}.wav"
    es_json_resp = Net::HTTP.get_response(URI.parse("#{@file_path}#{@es_uuid}.json"))
    es_mp3_resp = Net::HTTP.get_response(URI.parse("#{@file_path}#{@es_uuid}.mp3"))

    ## ENGLISH
    if json_resp.code == "200"
      updated_json = []
      json = JSON.parse(json_resp.body)
      json.each do |data|
        #update timeOffset because mouth moves faster than audio
        num = data["timeOffset"].present? ? data["timeOffset"]*17.41 : 0
        updated_json.push({timeOffset: num, visemeValue: data["visemeValue"]})
      end
      @monologue_or_feedback.en_viseme_data = updated_json
    end
    if mp3_resp.code == "200"
      open(mp3_file, 'wb') do |file|
        file << mp3_resp.body
      end
      if File.exist?(mp3_file)
        _file = File.open(mp3_file)
        @monologue_or_feedback.en_audio = _file
        _file.close
      end
    else
      wav_resp = Net::HTTP.get_response(URI.parse("#{@file_path}#{@uuid}.wav"))
      if wav_resp.code == "200"
        open(wav_file, 'wb') do |file|
          file << wav_resp.body
        end
        convert_to_mp3()
        if File.exist?(mp3_file)
          _file = File.open(mp3_file)
          @monologue_or_feedback.en_audio = _file
          _file.close
        end
      else
        {message: "TTS server error:"}
      end
    end

    ## SPANISH
    if es_json_resp.code == "200"
      updated_json = []
      json = JSON.parse(es_json_resp.body)
      json.each do |data|
        #update timeOffset because mouth moves faster than audio
        num = data["timeOffset"].present? ? data["timeOffset"]*17.41 : 0
        updated_json.push({timeOffset: num, visemeValue: data["visemeValue"]})
      end
      @monologue_or_feedback.es_viseme_data = updated_json
    end
    if es_mp3_resp.code == "200"
      open(es_mp3_file, 'wb') do |file|
        file << es_mp3_resp.body
      end
      if File.exist?(es_mp3_file)
        _file = File.open(es_mp3_file)
        @monologue_or_feedback.es_audio = _file
        _file.close
      end
    else
      es_wav_resp = Net::HTTP.get_response(URI.parse("#{@file_path}#{@es_uuid}.wav"))
      if es_wav_resp.code == "200"
        open(es_wav_file, 'wb') do |file|
          file << es_wav_resp.body
        end
        convert_to_mp3()
        if File.exist?(es_mp3_file)
          _file = File.open(es_mp3_file)
          @monologue_or_feedback.es_audio = _file
          _file.close
        end
      else
        {message: "TTS server error:"}
      end
    end

    if @monologue_or_feedback.changed?
      @monologue_or_feedback.save 
      File.delete(mp3_file) if File.exist?(mp3_file)
      File.delete(wav_file) if File.exist?(wav_file)
      File.delete(es_mp3_file) if File.exist?(es_mp3_file)
      File.delete(es_wav_file) if File.exist?(es_wav_file)
    end

    return true
  end

  def convert_to_mp3()
    mp3_file = "#{Rails.root}/tmp/#{@uuid}.mp3"
    wav_file = "#{Rails.root}/tmp/#{@uuid}.wav"
    if File.exist?(wav_file) 
      command_str = "-y -i \"#{wav_file}\" -af 'equalizer=f=8080:width_type=o:width=4:g=50' -ar 48000 -af 'volumedetect' -f mp3 \"#{mp3_file}\""
      Cocaine::CommandLine.path = "/usr/local/bin" unless Rails.env.development?
      c = Cocaine::CommandLine.new("ffmpeg", command_str)
      begin
        c.run
      rescue Cocaine::CommandNotFoundError => e
        e # => the command isn't in the $PATH for this process.
      end
    end

    es_mp3_file = "#{Rails.root}/tmp/#{@es_uuid}.mp3" 
    es_wav_file = "#{Rails.root}/tmp/#{@es_uuid}.wav"
    if File.exist?(es_wav_file) 
      command_str = "-y -i \"#{es_wav_file}\" -af 'equalizer=f=8080:width_type=o:width=4:g=50' -ar 48000 -af 'volumedetect' -f mp3 \"#{es_mp3_file}\""
      Cocaine::CommandLine.path = "/usr/local/bin" unless Rails.env.development?
      c = Cocaine::CommandLine.new("ffmpeg", command_str)
      begin
        c.run
      rescue Cocaine::CommandNotFoundError => e
        e # => the command isn't in the $PATH for this process.
      end
    end
  end
end
