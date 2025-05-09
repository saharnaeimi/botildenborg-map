import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './EditableTable.css'; // same styling used for the garden table

// Get ISO week number
function getISOWeek(date) {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return 1 + Math.round(((tempDate - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

// Get week-month pairs for 2025
const getISOWeeksFor2025 = () => {
  const result = [];
  const addedWeeks = new Set();
  let date = new Date(2025, 0, 1);

  while (date.getFullYear() === 2025) {
    const week = getISOWeek(date);
    const month = date.toLocaleString('default', { month: 'long' });
    const key = `${week}-${month}`;
    if (!addedWeeks.has(key)) {
      result.push({ week, month });
      addedWeeks.add(key);
    }
    date.setDate(date.getDate() + 7);
  }

  return result;
};

// Create initial data structure
const generateInitialData = () => {
  const weekMonthPairs = getISOWeeksFor2025();
  return weekMonthPairs.map(({ week, month }) => ({
    month,
    week,
    activityType: '',
    priorityDate: '',
    notes: '',
  }));
};

const InfraEditPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const name = location.state?.name || 'Unnamed Area';
  const navigate = useNavigate();

  const [data, setData] = useState(generateInitialData());
  const [saveMessage, setSaveMessage] = useState('');

  const handleInputChange = (e, rowIndex, field) => {
    const updatedData = [...data];
    updatedData[rowIndex][field] = e.target.value;
    setData(updatedData);
    setSaveMessage('');
  };

  const handleSave = () => {
    console.log('Saved infrastructure data:', data);
    setSaveMessage('✅ Changes saved locally! Connect to a backend to save permanently.');
  };

  return (
    <div className="table-container">
      <h2>Infrastructure Management Table</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>ID:</strong> {id}</p>

      <table className="editable-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Week</th>
            <th>Activity Type</th>
            <th>Priority Date</th>
            <th>Notes and Comments</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const showMonth = index === 0 || data[index].month !== data[index - 1].month;
            const monthRowSpan = data.filter(item => item.month === row.month).length;

            return (
              <tr key={index}>
                {showMonth && (
                  <td rowSpan={monthRowSpan} className="month-cell">
                    {row.month}
                  </td>
                )}
                <td>{row.week}</td>
                <td>
                  <input
                    type="text"
                    value={row.activityType}
                    onChange={(e) => handleInputChange(e, index, 'activityType')}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={row.priorityDate}
                    onChange={(e) => handleInputChange(e, index, 'priorityDate')}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.notes}
                    onChange={(e) => handleInputChange(e, index, 'notes')}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="buttons-container">
        <button onClick={handleSave} className="save-btn">
          Save Changes
        </button>
        <button onClick={() => navigate(-1)} className="export-btn">
          Go Back
        </button>
      </div>

      {saveMessage && <p>{saveMessage}</p>}
    </div>
  );
};

export default InfraEditPage;
