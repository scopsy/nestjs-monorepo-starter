import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { fetchUtils } from 'ra-core';
import { Admin, Resource } from 'react-admin';
import * as serviceWorker from './serviceWorker';
import { UserCreate, UserEdit, UserIcon, UserList } from './containers/users';
import crudProvider from 'ra-data-nestjsx-crud'
import { authProvider } from './authProvider';

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }

  const token = localStorage.getItem('admin_token');
  (options.headers as Headers).set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

const dataProvider = crudProvider('http://localhost:3000/v1/admin/entities', httpClient);

ReactDOM.render(
  <React.StrictMode>
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} icon={UserIcon}/>
    </Admin>
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
