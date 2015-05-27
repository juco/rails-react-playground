var Commentbox = React.createClass({
  getInitialState: function() {
    return { comments: JSON.parse(this.props.comments) };
  },

  componentDidMount: function() {
    var that = this
      , source = new EventSource('/comments/stream');

    source.addEventListener('message', function(e) {
      var data = JSON.parse(e.data)
        , comments = that.state.comments || [];

      comments = comments.concat([data]);
      that.setState({ comments: comments });
    });
  },

  addComment: function(comment) {
    $.post('/comments', {comment: comment});
  },

  render: function() {
    var comment = function(data) {
      return <Comment author={data.author} content={data.content} />;
    };

    return (
      <div>
        {this.state.comments.map(comment)}
        <CommentAdd commentAdded={this.addComment} />
      </div>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <div className="header">
          <span className="author">{this.props.author}</span>
          <span className="actions">
            <a href="#" className="delete"></a>
          </span>
        </div>
        <div className="content">
          {this.props.content}
        </div>
      </div>
    )
  }
});

var CommentAdd = React.createClass({
  addComment: function(e) {
    e.preventDefault();
    var nameNode = React.findDOMNode(this.refs.name)
      , contentNode = React.findDOMNode(this.refs.content);
    var comment = {
      author: nameNode.value,
      content: contentNode.value
    };
    this.props.commentAdded(comment);
    contentNode.value = nameNode.value = '';
  },

  render: function() {
    return (
      <form className="comment-add" onSubmit={this.addComment}>
        <div className="form-field">
          <input type="text" ref="name" placeholder="name" />
        </div>
        <div className="form-field">
          <textarea className="content" ref="content" />
        </div>
        <input type="submit" 
               value="Add" 
               className="submit" 
               placeholder="comment" />
      </form>
      )
  }
});
