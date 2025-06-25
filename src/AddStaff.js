import React, { useState } from "react";
import StaffList from "./StaffList";
import StaffForm from "./StaffForm";

const shifts = ["Dag", "Kväll", "Natt", "Flex/Bemanning"];

export default function AddStaff({ staff, setStaff, balances }) {
  const [tab, setTab] = useState(shifts[0]);
  const [editing, setEditing] = useState(null);

  const byShift = (shift) => staff.filter(p => p.shift === shift);

  return (
    <div>
      <div className="subtabs">
        {shifts.map(s => (
          <button key={s} onClick={() => setTab(s)}>{s}</button>
        ))}
      </div>
      <StaffList
        staff={byShift(tab)}
        balances={balances}
        onEdit={setEditing}
        onDelete={person =>
          setStaff(staff.filter(p => p.id !== person.id))
        }
      />
      <StaffForm
        visible={!!editing}
        person={editing}
        balances={balances}
        onSave={person => {
          setStaff(prev => {
            if (person.id) {
              return prev.map(p => p.id === person.id ? person : p);
            }
            return [...prev, { ...person, id: Date.now() }];
          });
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
      />
      <button onClick={() => setEditing({ shift: tab, balances: [] })}>
        Lägg till ny person
      </button>
    </div>
  );
}
