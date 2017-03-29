import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import Term from './Term';
import AddTerm from './AddTerm';
import CommonActions from './commonActions';
import filter from 'lodash/filter';

class Dictionary extends Component {
  state = {
    showAddTerm: false,
    terms: null,
    users: null,
  };

  componentWillMount() {
    const self = this;
    CommonActions.fetchJson('/users')
      .then((data) => setTimeout(function() {self.setState({users:data});}));
    CommonActions.fetchJson('/terms')
      .then((data) => setTimeout(function() {self.setState({terms:data});}));
  }

  componentWillUpdate(nextProps, nextState) {
    const self = this;
    if (!nextState.definitions && nextState.terms) {
      CommonActions.fetchJson('/definitions')
        .then((data) => setTimeout(function() {
          self.setState({
            terms:self.state.terms.map((item) =>
              Object.assign({}, item, {definitions: filter(data, {termId: item.id})})
            ),
            definitions: data,
          });
        }));
    }
  }

  toggleAdd = () => this.setState({ showAddTerm: !this.state.showAddTerm });
  addTerm = (term) => {
    const terms = this.state.terms.slice();
    terms.push(term);
    console.log(terms);
    this.setState({
      terms
    });
  };

  render() {
    const { showAddTerm } = this.state;

    if (!this.state.users || !this.state.terms || !this.state.definitions) {
      return (
        <div>Initializing</div>
      );
    }
    return (
      <div>
        <h2>Terms</h2>
        <Button bsStyle="success" onClick={this.toggleAdd}>
          <Glyphicon glyph="plus-sign" /> Add term
        </Button>
        {showAddTerm && <AddTerm
          addTerm={this.addTerm}
          hide={this.toggleAdd} />}
        <div className="terms">
          {this.state.terms.map(term => {
            return <Term key={term.id} term={term} />;
          })}
        </div>
      </div>
    );
  }
}

export default Dictionary;
