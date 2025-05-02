import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import EditableTable from './EditableTable';

function EditPage() {
  const { id} = useParams(); // ID from URL
  const location = useLocation();
  const name = location.state?.name;


  return (
    <div style={{ padding: '2rem' }}>
      <h2>Edit Polygon Data</h2>
      <p>Selected Feature ID: <strong>{id}</strong></p>
	  <p>Selected Feature Name: <strong>{name}</strong></p>
      
      {/* 👇 Replace this with whatever table/form you want */}
      <EditableTable selectedId={id} selectedName={name}/>
    </div>
  );
}

export default EditPage;
