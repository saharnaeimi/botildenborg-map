import React, { useState } from 'react';
import './EditableTable.css'; // For styling the table

// ✅ Helper: Proper ISO week number
function getISOWeek(date) {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const week1 = new Date(tempDate.getFullYear(), 0, 4);
  return 1 + Math.round(((tempDate - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

// ✅ Generate correct month-week pairs for 2025
const getISOWeeksFor2025 = () => {
  const result = [];
  const addedWeeks = new Set();
  let date = new Date(2025, 0, 1); // Jan 1, 2025

  while (date.getFullYear() === 2025) {
    const week = getISOWeek(date);
    const month = date.toLocaleString('default', { month: 'long' });

    const key = `${week}-${month}`;
    if (!addedWeeks.has(key)) {
      result.push({ week, month });
      addedWeeks.add(key);
    }

    date.setDate(date.getDate() + 7); // Move to next week
  }

  return result;
};

// ✅ Build initial table data
const generateInitialData = () => {
  const weekMonthPairs = getISOWeeksFor2025();
  return weekMonthPairs.map(({ week, month }) => ({
    month,
    week,
    plantName: '',
    seedingDate: '',
    wateringFrequency: '',
    notes: '',
  }));
};

const EditableTable = () => {
  const [data, setData] = useState(generateInitialData());
  const [saveMessage, setSaveMessage] = useState('');

  const handleInputChange = (e, rowIndex, field) => {
    const updatedData = [...data];
    updatedData[rowIndex][field] = e.target.value;
    setData(updatedData);
    setSaveMessage('');
  };

  const handleSave = () => {
    console.log('Saved weekly garden data:', data);
    setSaveMessage('✅ Changes saved locally! Connect to a backend to save permanently.');
  };

  return (
    <div className="table-container">
      <h2>Garden Management Table</h2>
      <table className="editable-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Week</th>
            <th>Plant Name</th>
            <th>Seeding/Planting Date</th>
            <th>Watering Frequency</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const showMonth =
              index === 0 || data[index].month !== data[index - 1].month;
            const monthRowSpan = data.filter(
              (item) => item.month === row.month
            ).length;

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
                    value={row.plantName}
                    onChange={(e) => handleInputChange(e, index, 'plantName')}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={row.seedingDate}
                    onChange={(e) => handleInputChange(e, index, 'seedingDate')}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.wateringFrequency}
                    onChange={(e) =>
                      handleInputChange(e, index, 'wateringFrequency')
                    }
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
        <button
          onClick={() => alert('Export function to be implemented soon!')}
          className="export-btn"
        >
          Export Data to CSV
        </button>
      </div>

      {saveMessage && <p>{saveMessage}</p>}
    </div>
  );
};

export default EditableTable;
