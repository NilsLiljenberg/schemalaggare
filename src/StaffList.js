import React, { useState } from "react";

export default function StaffList({ staff, balances, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <table>
      <tbody>
        {staff.map(person => (
          <React.Fragment key={person.id}>
            <tr>
              <td>
                <button onClick={() => setExpanded(expanded === person.id ? null : person.id)}>
                  ▶
                </button>
                {person.name}
              </td>
              <td>
                <button onClick={() => onEdit(person)}>Ändra</button>
                <button onClick={() => onDelete(person)}>Ta bort</button>
              </td>
            </tr>
            {expanded === person.id && (
              <tr>
                <td colSpan="2">
                  <ul>
                    {person.balances.map(bal => <li key={bal}>{bal}</li>)}
                  </ul>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
