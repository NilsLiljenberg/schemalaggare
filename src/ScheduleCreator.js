import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const shifts = {
  Dag: 7,
  Kväll: 8,
  Natt: 6,
};

const colorMap = {
  "Avs 1": "FFFF00",
  "Avs 2": "FFFF00",
  "Avs 3": "FFFF00",
  "Nedre Förlast": "808000",
  "Nedre Pålast": "808000",
  "Nedre VTC": "808000",
  "Nedre Avs": "808000",
  "SLUTKONTROLL": "FFA500",
  "Sillar": "ADD8E6",
  "Avplock": "ADD8E6",
  "Takspoiler": "ADD8E6",
};

export default function ScheduleCreator({ staff, schedules, setSchedules, balances, contacts }) {
  const [selectedShift, setSelectedShift] = useState("Dag");
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    // Ladda senaste schema för shift eller tomt schema
    setSchedule(schedules[selectedShift] || { passes: [], rows: [] });
  }, [selectedShift, schedules]);

  function createSchedule() {
    // Skapar schema baserat på personalens balanser och pass
    const passCount = shifts[selectedShift];
    const filteredStaff = staff.filter(p => p.shift === selectedShift);

    // Enkel schemaläggning: tilldela pass i ordning, med rotationskontroll (kan utvecklas)
    let rows = filteredStaff.map(p => ({
      id: p.id,
      name: p.name,
      balances: p.balances,
      passes: Array(passCount).fill(""),
    }));

    // Fyll passen slumpmässigt eller med enklare rotation (kan förbättras)
    for (let i = 0; i < passCount; i++) {
      rows.forEach(row => {
        // Välj balanser från personens balanser, fallback till tomt
        row.passes[i] = row.balances.length > 0 ? row.balances[i % row.balances.length] : "";
      });
    }

    const newSchedule = {
      passes: Array.from({ length: passCount }, (_, i) => `Pass ${i + 1}`),
      rows,
    };

    setSchedule(newSchedule);

    // Spara senaste 4 scheman per shift med max 4 sparade
    setSchedules(prev => {
      const prevShiftSchedules = prev[selectedShift] ? prev[selectedShift].history || [] : [];
      const newHistory = [newSchedule, ...prevShiftSchedules].slice(0, 4);
      return { 
        ...prev, 
        [selectedShift]: { ...newSchedule, history: newHistory } 
      };
    });
  }

  function exportToExcel() {
    if (!schedule) return;

    const wsData = [
      ["Namn", ...schedule.passes],
      ...schedule.rows.map(row => [row.name, ...row.passes]),
      [],
      [`Gruppledare: ${contacts.groupLeader.name} ${contacts.groupLeader.phone}`],
      [`Kvalité: ${contacts.quality.name} ${contacts.quality.phone}`],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Färgkodning (kan kräva tillägg för XLSX-stil)
    // Här är ett exempel på att sätta fyllningsfärg:
    Object.keys(ws).forEach(cell => {
      if (cell[0] === "!") return;
      const cellValue = ws[cell].v;
      if (colorMap[cellValue]) {
        ws[cell].s = {
          fill: { fgColor: { rgb: colorMap[cellValue] } },
        };
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, selectedShift + " Schema");
    XLSX.writeFile(wb, `Schema_${selectedShift}.xlsx`);
  }

  return (
    <div>
      <div className="subtabs">
        {Object.keys(shifts).map(s => (
          <button
            key={s}
            onClick={() => setSelectedShift(s)}
            className={selectedShift === s ? "active" : ""}
          >
            {s}
          </button>
        ))}
      </div>
      <button onClick={createSchedule}>Skapa schema</button>
      {schedule && (
        <div>
          <h3>{selectedShift} Schema</h3>
          <table>
            <thead>
              <tr>
                <th>Namn</th>
                {schedule.passes.map(p => <th key={p}>{p}</th>)}
              </tr>
            </thead>
            <tbody>
              {schedule.rows.map(row => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  {row.passes.map((bal, i) => (
                    <td key={i} style={{ backgroundColor: colorMap[bal] ? `#${colorMap[bal]}` : "transparent" }}>
                      {bal}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={exportToExcel}>Exportera till Excel</button>
        </div>
      )}
    </div>
  );
}
