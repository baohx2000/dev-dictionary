import React, { Component } from 'react';
import { Button, ControlLabel, Form, FormControl, FormGroup, Col, Well } from 'react-bootstrap';
import CommonActions from './commonActions';

class AddTerm extends Component {
  state = {
    term: null
  };

  static propTypes = {
    hide: React.PropTypes.func.isRequired,
    addTerm: React.PropTypes.func.isRequired,
  };

  createTerm = (e) => {
    CommonActions.postJson('/terms', {
      name:this.state.term,
    })
      .then((data) => this.props.addTerm(data))
      .then(this.props.hide());
  };

  render() {
    const { hide } = this.props;

    return (
      <Well className="add-term">
        <Form
          horizontal
        >
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              Term
            </Col>
            <Col sm={10}>
              <FormControl
                onChange={(e) => this.setState({term:e.target.value})}
              />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button bsStyle="primary" onClick={this.createTerm}>
                Submit the term
              </Button>
              <Button bsStyle="link" onClick={hide}>Cancel</Button>
            </Col>
          </FormGroup>
        </Form>
      </Well>
    );
  }
}

export default AddTerm;
