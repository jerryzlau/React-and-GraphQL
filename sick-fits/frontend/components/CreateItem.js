import React, { Component } from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $price: Int!
    $description: String!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      price: $price
      description: $description
      image: $image
      largeImage: $largeImage
    ) {
      id
      title
      price
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  };

  handleChange = e => {
    const {name, type, value} = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({
      [name]: val
    });
  }

  uploadFile = async e => {
    console.log('Uploading file...');
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/jerryzlau/image/upload', 
      {
        method: 'POST',
        body: data
      });

    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
  }

  render() {
    const {image} = this.state;
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} 
        variables={this.state}>
        {(createItem, {loading, error}) => (
          <Form onSubmit={async e => {
            e.preventDefault();
            const res = await createItem();
            Router.push({
              pathname: '/item',
              query: {id: res.data.createItem.id}
            })
          }}>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input type="file" 
                  id="file" 
                  name="file" 
                  className="file" 
                  placeholder="File"
                  onChange={this.uploadFile}
                  required/>
                  {image && <img width="200" src={image} alt="Upload Preview"/>}
              </label>
              <label htmlFor="title">
                Title
                <input type="text" 
                  id="title" 
                  name="title" 
                  className="title" 
                  placeholder="Title"
                  onChange={this.handleChange}
                  value={this.state.title} 
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
                  value={this.state.price} 
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
                  value={this.state.description} 
                  required/>
              </label>

              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export {CREATE_ITEM_MUTATION};