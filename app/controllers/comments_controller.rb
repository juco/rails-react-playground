class CommentsController < ApplicationController
  include ActionController::Live

  def index
  end

  def create
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
    #sse = SSE.new(response.stream, retry: 300, event: 'comment')
    #sse.write({ name: 'John'}, id: 10, event: "other-event", retry: 500)
  rescue IOError
    logger.info 'Stream closed'
  ensure
    redis.quit
    response.stream.close
  end

  private
    def comment_params
      params.require(:comment).permit(:author, :comment)
    end
end
