import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import gql from 'graphql-tag';
import { ALL_ITEM_QUERY } from "./Items";

const DELETE_ITEM_MUTATION = gql `
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id){
      id
    }
  }
`;

class DeleteItem extends Component {
  handleDelete = async (e, deleteItemMutation) => {
    if(confirm('Are you sure you want to delete this item?')){
      const res = await deleteItemMutation({
        variables: {
          id: this.props.id
        }
      });
    }
  }

  update = (cache, payload) => {
    // manually update cache
    const data = cache.readQuery({query: ALL_ITEM_QUERY});
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    cache.writeQuery({query: ALL_ITEM_QUERY, data});
  }

  render() {
    return (
      <Mutation mutation={DELETE_ITEM_MUTATION} 
        variables={{id: this.props.id}}
        update={this.update}>
        {(deleteItem, {error}) => {
          return (
            <button onClick={e => this.handleDelete(e, deleteItem)}>{this.props.children}</button>
          )
        }}
      </Mutation>   
    );
  }
}

export default DeleteItem;