'use strict';

class Commentbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  componentDidMount() {
    let source = new EventSource('/comments/stream');

    source.addEventListener('message', (e) => {
      let data = JSON.parse(e.data)
        , comments = this.state.comments || [];

      comments = comments.concat([data]);
      this.setState({ comments: comments });
    });
  }

  addComment(comment) {
    $.post('/comments', { comment: comment });
  }

  render() {
    let comment = (data) => {
      return <Comment author={data.author} content={data.content} />;
    };

    return (
      <div>
        {this.state.comments.map(comment)}
        <CommentAdd commentAdded={this.addComment} />
      </div>
    );
  }
}

class Comment extends React.Component {
  render() {
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
}

class CommentAdd extends React.Component {
  constructor(props) {
    super(props)
    this.addComment = this.addComment.bind(this);
  }

  addComment(e) {
    let authorNode = React.findDOMNode(this.refs.author)
      , contentNode = React.findDOMNode(this.refs.content)
      , comment = {
          author: authorNode.value,
          content: contentNode.value
        };

    e.preventDefault();
    contentNode.value = authorNode.value = '';
    this.props.commentAdded(comment);
  }

  render() {
    return (
      <form className="comment-add" onSubmit={this.addComment}>
        <div className="form-field">
          <input type="text" className="author" ref="author" placeholder="Name" />
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
}
