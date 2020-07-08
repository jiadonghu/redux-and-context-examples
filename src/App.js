import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import './App.css';
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { ApolloProvider } from '@apollo/react-hooks';
import useInput from './hooks/useInput';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

///// Apollo Client

const GET_POST = gql`
  query getPost($postId: Int!) {
    getPost(id:$postId) {
      id
      title
      category{
        id
        name
      }
  }
}
`;

const UPDATE_POST = gql`
mutation updatePost($id: Int!, $categoryId: Int!, $title: String!, $content: String!) {
  updatePost(id: $id, categoryId: $categoryId, title: $title, content: $content){
      id
      title,
      content,
      category{
        id,
        name
      }
    }
}
`;

const CREATE_POST = gql`
  mutation createPost($categoryId: Int!, $title: String!, $content: String!) {
    createPost(categoryId: $categoryId, title: $title, content: $content){
      id
      title
      category{
        id
        name
      }
    }
  }
`;

const GET_ALL_POSTS = gql`
  query getAllPosts {
      getAllPost {
        id
        title
        category{
          id
          name
        }
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($id: Int!) {
    deletePost(id: $id) {
      id
    }
  }
`;


function GetPost() {
  const [postId, setPostId, binding] = useInput();
  const [getPost, { loading, data, error }] = useLazyQuery(GET_POST);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    getPost({
      variables: {
        postId: parseInt(postId)
      }
    })
  }

  return (
    <div>
      <h1>Get Post >>>>>>></h1>
      <input {...binding} value={postId} placeholder='Id' >
      </input>
      <button onClick={handleSubmit}> Search </button>
      {
        loading && <p> loading... </p>
      }
      {
        error && <p>error: {error.message}</p>
      }
      {
        data && 
        <p> id: <b>{data.getPost.id}</b> title: <b>{data.getPost.title}</b> category: <b>{data.getPost.category.map(item => item.name)}</b></p>
      }
    </div>
  )
}
function SignlePost({postId}) {
  const { loading, error, data, networkStatus } = useQuery(GET_POST, 
    {
      variables: {
        postId
      },
      // pollInterval: 2000,
      // skip: !postId,
      notifyOnNetworkStatusChange: true,

    });

  if (networkStatus === 4) return 'refetching!';
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <h1>Post Content >>>>>>></h1>
      <p> id: <b>{data.getPost.id}</b> title: <b>{data.getPost.title}</b> category: <b>{data.getPost.category.map(item => item.name)}</b></p>
    </div>
  )
}

function UpdatePost() {
  let input;
  const [updatePost, { data, called }] = useMutation(UPDATE_POST);
  return (
    <div>
      <h1>Update Post >>>>>>>>>>>>>></h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          updatePost({ variables: { id: 13, categoryId: 1, title: input.value, content: '123' } });
          input.value = '';
        }}
      >
        <input
        placeholder='title'
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

function AddPost() {
  let input;
  // CREATE_POST query should return the same fields as GET_ALL_POSTS
  const [createPost] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      const { getAllPost } = cache.readQuery({ query: GET_ALL_POSTS });
      cache.writeQuery({
        query: GET_ALL_POSTS,
        data: { getAllPost: getAllPost.concat([createPost]) },
      });
    }
  });
  return (
    <div>
      <h1>Add Post >>>>>>>>>>>>>>>>>.</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          createPost({ variables: { categoryId: 1, title: input.value, content: '123' } });
          input.value = '';
        }}
      >
        <input
          placeholder='title'
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Add Post</button>
      </form>
    </div>
  );
}

function AllPosts() {
  const { loading, error, data, networkStatus } = useQuery(GET_ALL_POSTS,
    {
      notifyOnNetworkStatusChange: true
    }
  );

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <h1>All Posts: >>>>>>></h1>
      {
        data.getAllPost.map(post => {
          return (
            <div>
              <p> id: <b>{post.id}</b> title: <b>{post.title}</b> category: <b>{post.category.map(item => item.name)}</b></p>
            </div>
          );
        })
      }
    </div>
  )
}

function DeletePost() {
  let input;
  const [deletePost] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost } }) {
      const { getAllPost } = cache.readQuery({ query: GET_ALL_POSTS });
      cache.writeQuery({
        query: GET_ALL_POSTS,
        data: { getAllPost: getAllPost.filter(post => post.id != deletePost.id) },
      });
    }
  });
  return (
    <div>
      <h1>Delete Post >>>>>>>>>>>>>>>>>.</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          deletePost({ variables: { id: parseInt(input.value) } });
          input.value = '';
        }}
      >
        <input
          placeholder='Id'
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Delete Post</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <GetPost/>
        <UpdatePost/>
        <AddPost/>
        <DeletePost/>
        <AllPosts/>
      </div>
    </ApolloProvider>
  )
}

export default App;
