import React, { Component } from 'react';
import {Mutation, Query} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: {
      id: $id
    }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $price: Int
    $description: String
  ) {
    updateItem(
      id: $id
      title: $title
      price: $price
      description: $description
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = e => {
    const {name, type, value} = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({
      [name]: val
    });
  }

  handleSubmit = async (e, updateItemMutation) => {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });

    console.log(res);
    // Router.push({
    //   pathname: '/item',
    //   query: {id: res.data.updateItem.id}
    // })
  }

  render() {
    const {image} = this.state;
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{
        id: this.props.id
      }}>
        {({data, loading}) => {
          if(loading) return <p>Loading...</p>;
          if(!data.item) return <p>No Item Found for ID {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} 
              variables={this.state}>
              {(updateItem, {loading, error}) => (
                <Form onSubmit={e => this.handleSubmit(e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input type="text" 
                        id="title" 
                        name="title" 
                        className="title" 
                        placeholder="Title"
                        onChange={this.handleChange}
                        defaultValue={data.item.title} 
                        required/>
                    </label>
                    <label htmlFor="price">
                      Price
                      <input type="number" 
                        id="price" 
                        name="price" 
                        className="price" 
                        placeholder="Price"
                        onChange={this.handleChange}
                        defaultValue={data.item.price} 
                        required/>
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea 
                        id="description" 
                        name="description" 
                        className="description" 
                        placeholder="Enter A Description"
                        onChange={this.handleChange}
                        defaultValue={data.item.description} 
                        required/>
                    </label>

                    <button type="submit">Save Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export {UPDATE_ITEM_MUTATION};