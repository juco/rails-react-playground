var Commentbox = React.createClass({
  getInitialState: function() {
    return { comments: [ { author: 'Example', content: 'Hello world' } ] };
  },

  addComment: function(comment) {
    var items = this.state.comments.concat([comment]);
    this.setState({ comments: items });
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
            <a href="#">Delete</a>
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
      , commentNode = React.findDOMNode(this.refs.comment);
    var comment = {
      author: nameNode.value,
      content: React.findDOMNode(this.refs.comment).value
    };
    this.props.commentAdded(comment);
    commentNode.value = nameNode.value = '';
  },

  render: function() {
    return (
      <form className="comment-add" onSubmit={this.addComment}>
        <div className="form-field">
          <input type="text" ref="name" placeholder="name" />
        </div>
        <div className="form-field">
          <textarea className="comment" ref="comment" />
        </div>
        <input type="submit" 
               value="Add" 
               className="submit" 
               placeholder="comment" />
      </form>
      )
  }
});
