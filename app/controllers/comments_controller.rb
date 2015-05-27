class CommentsController < ApplicationController
  include ActionController::Live

  def index
    @comments = $redis.get('comments') || []
  end

  def create
    comments = if $redis.exists('comments')
                 JSON.parse $redis.get('comments')
               else
                 []
               end
    pp comments
    $redis.set('comments', comments.push(comment_params).to_json)
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
end
