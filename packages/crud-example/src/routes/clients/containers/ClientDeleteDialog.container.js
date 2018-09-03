import React, { Component } from 'react';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import { Form } from 'react-final-form';
import { Button } from '@8base/boost';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { Dialog, withDialog } from 'shared/dialog';

const CLIENT_DELETE_MUTATION = gql`
  mutation ClientDelete($data: ClientDeleteInput!) {
    clientDelete(data: $data) {
      success
    }
  }
`;

class ClientDeleteDialogContainer extends Component {
  createOnSubmit = (clientDelete) => async (data) => {
    try {
      await clientDelete({ variables: { data }});
    } catch (e) {
      // TODO: Handle errors
    }

    this.props.closeDialog('CLIENT_DELETE_DIALOG');
  };

  renderFormContent = ({ handleSubmit, submitting, invalid }) => {
    const { closeDialog } = this.props;

    return (
      <form onSubmit={ handleSubmit }>
        <Dialog.Header title="Delete Client" onClose={ () => closeDialog('CLIENT_DELETE_DIALOG') } />
        <Dialog.Body>
          Are you really want to delete client?
        </Dialog.Body>
        <Dialog.Footer>
          <Button color="neutral" variant="outlined" disabled={ submitting } onClick={ () => closeDialog('CLIENT_DELETE_DIALOG') }>Cancel</Button>
          <Button color="red" type="submit" text="Delete Client" disabled={ invalid } loading={ submitting } />
        </Dialog.Footer>
      </form>
    );
  };

  renderForm = (id) => (clientDelete) => {
    const collectedProps = {
      onSubmit: this.createOnSubmit(clientDelete),
      render: this.renderFormContent,
      tableSchemaName: 'Clients',
    };

    return (
      <Form { ...collectedProps } initialValues={{ id }} />
    );
  }

  render() {
    return (
      <Dialog.Plate id="CLIENT_DELETE_DIALOG" size="sm">
        {
          ({ args }) => {
            if (!args || !args.id) {
              return null;
            }

            return <Mutation mutation={ CLIENT_DELETE_MUTATION } refetchQueries={ ['ClientsList'] }>{ this.renderForm(args.id) }</Mutation>;
          }
        }
      </Dialog.Plate>
    );
  }
}

ClientDeleteDialogContainer = compose(
  withRouter,
  withDialog,
)(ClientDeleteDialogContainer);

export { ClientDeleteDialogContainer };
