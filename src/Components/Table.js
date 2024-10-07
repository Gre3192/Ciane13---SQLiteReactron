import React from 'react';

const TableRow = ({ row, onSelect, onDelete }) => (
  <tr>
    <td>
      <input type="checkbox" onChange={() => onSelect(row.id)} />
    </td>
    <td>{row.name}</td>
    <td>{row.email}</td>
    <td>{row.phone}</td>
    <td>
      <button onClick={() => onDelete(row.id)}>
        🗑
      </button>
    </td>
  </tr>
);

const Table = ({ data, onSelect, onDelete }) => (
  <table>
    <thead>
      <tr>
        <th>
          <input type="checkbox" onChange={onSelect} />
        </th>
        <th>Nome</th>
        <th>email</th>
        <th>Telefono</th>
        <th>Azioni</th>
      </tr>
    </thead>
    <tbody>
      {data.map(row => (
        <TableRow
          key={row.id}
          row={row}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </tbody>
  </table>
);

const App = () => {
  const data = [
    { id: 1, name: 'Mario Rossi', email: 'mario.rossi@gmail.com', phone: '123456789' },
    { id: 2, name: 'Francesca Verdi', email: 'francesca.verdi@gmail.com', phone: '987654321' },
    // altri dati...
  ];

  const [selected, setSelected] = React.useState([]);

  const handleSelect = id => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleDelete = id => {
    setSelected(selected.filter(i => i !== id));
  };

  return (
    <Table
      data={data}
      onSelect={handleSelect}
      onDelete={handleDelete}
    />
  );
};

export default App;