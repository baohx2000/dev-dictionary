import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';
import CommonActions from './commonActions';

class TermContainer extends Component {
  static propTypes = {
    params: React.PropTypes.shape({
      termName: React.PropTypes.string.isRequired,
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      termLoaded: false,
      loaded: false,
      term: null,
      definitions: null,
      error: null,
    };
  }

  componentWillMount() {
    this.setState({loading:true});
    if (!this.state.loaded) {
      setTimeout(() => {
        CommonActions.fetchJson(`/terms?q=${this.props.params.termName}&_limit=1`)
          .then(
            (data) => this.setState({
              term:data[0],
              termLoaded: true,
            }),
            (e) => this.setState({
              loading: false,
              error: e,
            })
          );
      });
    }
  };

  componentWillUpdate(nextProps, nextState) {
    if (!this.state.termLoaded && nextState.termLoaded) {
      if (nextState.term) {
        setTimeout(() => {
          CommonActions.fetchJson(`/definitions?termId=${nextState.term.id}`)
            .then(
              (data) => this.setState({
                definitions:data,
                loaded: true,
              }),
              (e) => this.setState({
                loading: false,
                error: e,
              })
            );
        });
      } else {
        this.setState({
          loaded: true,
        });
      }
    }
  }

  render() {
    let content;
    if (this.state.loaded) {
      if (!this.state.term) {
        content = (
          <div>Term not found</div>
        );
      } else {
        content = (
          <div>
            <h1>{this.state.term.name}</h1>
            <ul>
              {this.state.definitions.map((item, idx) => (
                <li key={idx}>{item.content}</li>
              ))}
            </ul>
          </div>
        );
      }
    } else if (this.state.loading) {
      content = (
        <div>Loading</div>
      );
    } else if (this.state.error) {
      content = (
        <div>{this.state.error}</div>
      );
    } else {
      content = (
        <div>Initializing</div>
      );
    }
    return (
      <div className="term">
        <Link to="/terms">
          <Glyphicon glyph="chevron-left" /> Back to terms
        </Link>
        {content}
      </div>
    );
  }
}

export default TermContainer;
