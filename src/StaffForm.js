import React, { useState, useEffect } from "react";

export default function StaffForm({ visible, person, balances, onSave, onCancel }) {
  const [form, setForm] = useState(person || { name: "", shift: "", balances: [] });

  useEffect(() => {
    setForm(person || { name: "", shift: "", balances: [] });
  }, [person]);

  if (!visible) return null;

  const toggleBalance = (bal) => {
    setForm(f =>
      f.balances.includes(bal)
        ? { ...f, balances: f.balances.filter(b => b !== bal) }
        : { ...f, balances: [...f.balances, bal] }
    );
  };

  return (
    <div className="modal">
      <label>
        Namn:
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </label>
      <div>
        <strong>Balanser:</strong>
        {balances.map(bal => (
          <label key={bal}>
            <input
              type="checkbox"
              checked={form.balances.includes(bal)}
              onChange={() => toggleBalance(bal)}
            />
            {bal}
          </label>
        ))}
      </div>
      <button onClick={() => onSave(form)}>Spara</button>
      <button onClick={onCancel}>Avbryt</button>
    </div>
  );
}
