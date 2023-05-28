import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, HttpLink } from '@apollo/client';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import auth from './utils/auth';
import Switch from 'react-bootstrap/esm/Switch';

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = SetContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ... headers,
      authorization: token 
      ? `Bearer ${token}`
      : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>  
        <>
          <Navbar />
          <Switch>
            <Route 
              exact path='/' 
              component={SearchBooks} 
            />
            <Route 
              exact path='/saved' 
              component={SavedBooks} 
            />
            <Route 
              exact path='*'
              component={<h1 className='display-2'>Wrong page!</h1>}
            />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
};

export default App;
