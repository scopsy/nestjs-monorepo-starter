import * as React from "react";
import { List, Datagrid, Edit, Create, SimpleForm, TextField, TextInput, DeleteButton } from 'react-admin';
import BookIcon from '@material-ui/icons/Book';

export const UserIcon = BookIcon;

export const UserList = (props: JSX.IntrinsicAttributes) => (
  <List {...props} >
    <Datagrid>
      <TextField source="_id" />
      <TextField source="firstName" />
      <DeleteButton undoable={false} />
    </Datagrid>
  </List>
);


const UserTitle = ({ record }: { record?: { title: string; }}) => {
  return <span>User {record ? `"${record.title}"` : ''}</span>;
};

export const UserEdit = (props: JSX.IntrinsicAttributes) => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm>
      <TextInput source={'firstName'}/>
    </SimpleForm>
  </Edit>
);

export const UserCreate = (props: JSX.IntrinsicAttributes) => (
  <Create title="Create a Post" {...props}>
    <SimpleForm>
      <TextInput source={'firstName'}/>
    </SimpleForm>
  </Create>
);
