require 'digest'
require 'json'

class CommentsController < ApplicationController
  include ActionController::Live

  def index
    hello_comment = { author: 'juco', content: 'Hello world!' }
    @comments = $redis.get('comments') || [hello_comment]
  end

  def create
    comments = if $redis.exists('comments')
                 JSON.parse $redis.get('comments')
               else
                 []
               end

    new_comment = form_comment(comment_params)

    $redis.set('comments', comments.push(new_comment).to_json)
    $redis.publish('comment.create', comment_params.to_json)

    head :created
  end

  def stream
    response.headers['Content-Type'] = 'text/event-stream'
    redis = Redis.new
    redis.subscribe('comment.create') do |on|
      on.message do |event, data|
        response.stream.write("data: #{data}\n\n")
      end
    end
  rescue IOError
    logger.info 'Stream closed'
  ensure
    redis.quit
    response.stream.close
  end

  private
    def comment_params
      params.require(:comment).permit(:author, :content)
    end

    def form_comment(comment_params)
      comment_params.merge({
        timestamp: Date.new,
        id: comment_id(comment_params)
      })
    end

    def comment_id(comment)
      digest = Digest::MD5.new
      digest << JSON.generate(comment)
      digest.to_s
    end
end
