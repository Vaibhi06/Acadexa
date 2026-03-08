import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import {
  Plus,
  Trash2,
  Save,
  Download,
  Printer,
  Grid3X3,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowDownAZ,
  ArrowUpZA,
  CalendarPlus,
  Table,
  Eye,
  EyeOff
} from 'lucide-react';

const IncomeSheet = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showGridlines, setShowGridlines] = useState(true);
  const [showHeadings, setShowHeadings] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const inputRef = useRef(null);

  // Load data from API
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await api.get('/incomes');
      if (response.data.success) {
        setIncomeData(response.data.data.incomes);
      }
    } catch (error) {
      console.error('Failed to fetch incomes:', error);
    }
  };

  const incomeCategories = ['Fees', 'Admission', 'Donation', 'Other'];
  const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0);
  const columns = ['A', 'B', 'C', 'D', 'E'];
  const columnNames = { A: 'date', B: 'description', C: 'category', D: 'amount', E: 'actions' };

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.select) inputRef.current.select();
    }
  }, [editingCell]);

  // Set document title
  useEffect(() => {
    document.title = 'Income Sheet - Acadexa';
  }, []);

  const addNewRow = async () => {
    const newRow = {
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Fees',
      amount: 0
    };
    try {
      const response = await api.post('/incomes', newRow);
      if (response.data.success) {
        const createdIncome = response.data.data.income;
        setIncomeData([createdIncome, ...incomeData]);
        setTimeout(() => {
          setEditingCell({ rowId: createdIncome.id, field: 'description' });
          setSelectedCell({ row: 1, col: 'B' }); // Assuming new row is at top
          // actually fetchIncomes() might reorder? The controller sorts by date DESC.
          // If we just prepend, it might be out of sync with sort.
          // For now, prepend is fine visually.
        }, 100);
      }
    } catch (error) {
      console.error('Failed to add row:', error);
    }
  };

  const deleteRow = async (id) => {
    if (window.confirm('Delete this row?')) {
      try {
        await api.delete(`/incomes/${id}`);
        setIncomeData(incomeData.filter(item => item.id !== id));
      } catch (error) {
        console.error('Failed to delete row:', error);
      }
    }
  };

  const handleCellClick = (rowId, field, rowIndex, col) => {
    setSelectedCell({ row: rowIndex + 1, col });
    if (field !== 'actions') {
      setEditingCell({ rowId, field });
    }
  };

  const handleCellChange = (rowId, field, value) => {
    setIncomeData(incomeData.map(item => {
      if (item.id === rowId) {
        return { ...item, [field]: field === 'amount' ? (parseFloat(value) || 0) : value };
      }
      return item;
    }));
  };

  const handleKeyDown = (e, rowId, field) => {
    const rowIndex = incomeData.findIndex(r => r.id === rowId);
    const colIndex = columns.indexOf(Object.keys(columnNames).find(k => columnNames[k] === field));

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      handleBlur(); // Triggers save
      if (e.key === 'Tab' && !e.shiftKey && colIndex < 3) {
        const nextField = columnNames[columns[colIndex + 1]];
        setEditingCell({ rowId, field: nextField });
        setSelectedCell({ row: rowIndex + 1, col: columns[colIndex + 1] });
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const saveData = () => {
    // Current implementation auto-saves on blur, but we can keep this for manual trigger
    setSaveMessage('Saved!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleBlur = async () => {
    if (editingCell) {
      const rowToUpdate = incomeData.find(r => r.id === editingCell.rowId);
      if (rowToUpdate) {
        try {
          await api.put(`/incomes/${rowToUpdate.id}`, rowToUpdate);
          // setSaveMessage('Saved!'); // Optional feedback
        } catch (error) {
          console.error('Failed to update row:', error);
        }
      }
    }
    setEditingCell(null);
  };

  const sortData = (field, direction) => {
    // Client-side sort is fine for now
    const sorted = [...incomeData].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setIncomeData(sorted);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...incomeData.map(row => [row.date, `"${row.description}"`, row.category, row.amount].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Income_Sheet.csv';
    a.click();
  };

  const getCellAddress = () => {
    if (selectedCell) return `${selectedCell.col}${selectedCell.row}`;
    return 'A1';
  };

  const renderCell = (row, field, rowIndex, col) => {
    const isEditing = editingCell?.rowId === row.id && editingCell?.field === field;
    const isSelected = selectedCell?.row === rowIndex + 1 && selectedCell?.col === col;

    if (isEditing) {
      if (field === 'category') {
        return (
          <select
            ref={inputRef}
            value={row[field]}
            onChange={(e) => handleCellChange(row.id, field, e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, row.id, field)}
            className="excel-input"
          >
            {incomeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        );
      }
      return (
        <input
          ref={inputRef}
          type={field === 'date' ? 'date' : field === 'amount' ? 'number' : 'text'}
          value={row[field]}
          onChange={(e) => handleCellChange(row.id, field, e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => handleKeyDown(e, row.id, field)}
          className="excel-input"
        />
      );
    }

    let displayValue = row[field];
    if (field === 'date') displayValue = new Date(row.date).toLocaleDateString('en-IN');
    else if (field === 'amount') displayValue = `₹ ${row.amount.toLocaleString()}`;

    return (
      <div
        className={`excel-cell ${isSelected ? 'selected' : ''} ${field === 'amount' ? 'number' : ''}`}
        onClick={() => handleCellClick(row.id, field, rowIndex, col)}
        onDoubleClick={() => { setEditingCell({ rowId: row.id, field }); }}
      >
        {displayValue || ''}
      </div>
    );
  };

  const renderToolbar = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <div className="toolbar-group">
              <button className="ribbon-btn" onClick={saveData}>
                <Save size={16} />
                <span>Save</span>
              </button>
              <button className="ribbon-btn" onClick={exportToCSV}>
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
            <div className="toolbar-divider"></div>
            <div className="toolbar-group">
              <button className="ribbon-btn">
                <AlignLeft size={16} />
                <span>Left</span>
              </button>
              <button className="ribbon-btn">
                <AlignCenter size={16} />
                <span>Center</span>
              </button>
              <button className="ribbon-btn">
                <AlignRight size={16} />
                <span>Right</span>
              </button>
            </div>
            <div className="toolbar-divider"></div>
            <div className="toolbar-group">
              <button className="ribbon-btn primary" onClick={addNewRow}>
                <Plus size={16} />
                <span>Add Row</span>
              </button>
            </div>
          </>
        );
      case 'insert':
        return (
          <>
            <div className="toolbar-group">
              <button className="ribbon-btn" onClick={addNewRow}>
                <Table size={16} />
                <span>Insert Row</span>
              </button>
              <button className="ribbon-btn" onClick={() => {
                if (selectedCell) {
                  // Insert today's date logic could go here
                  alert('Functionality to insert date allows quick entry.');
                }
              }}>
                <CalendarPlus size={16} />
                <span>Insert Date</span>
              </button>
            </div>
          </>
        );
      case 'data':
        return (
          <>
            <div className="toolbar-group">
              <button className="ribbon-btn" onClick={() => sortData('date', 'asc')}>
                <ArrowDownAZ size={16} />
                <span>Sort Date ▲</span>
              </button>
              <button className="ribbon-btn" onClick={() => sortData('date', 'desc')}>
                <ArrowUpZA size={16} />
                <span>Sort Date ▼</span>
              </button>
            </div>
            <div className="toolbar-divider"></div>
            <div className="toolbar-group">
              <button className="ribbon-btn" onClick={() => sortData('amount', 'asc')}>
                <ArrowDownAZ size={16} />
                <span>Sort Amount ▲</span>
              </button>
              <button className="ribbon-btn" onClick={() => sortData('amount', 'desc')}>
                <ArrowUpZA size={16} />
                <span>Sort Amount ▼</span>
              </button>
            </div>
          </>
        );
      case 'view':
        return (
          <>
            <div className="toolbar-group">
              <button className={`ribbon-btn ${showGridlines ? 'active' : ''}`} onClick={() => setShowGridlines(!showGridlines)}>
                <Grid3X3 size={16} />
                <span>Gridlines</span>
              </button>
              <button className={`ribbon-btn ${showHeadings ? 'active' : ''}`} onClick={() => setShowHeadings(!showHeadings)}>
                {showHeadings ? <Eye size={16} /> : <EyeOff size={16} />}
                <span>Headings</span>
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="excel-app">
      {/* Excel Title Bar */}
      <div className="excel-titlebar">
        <div className="excel-logo">
          <div className="excel-icon">X</div>
          <span>Income Sheet - Acadexa</span>
        </div>
        <div className="window-controls">
          <button>−</button>
          <button>□</button>
          <button className="close">×</button>
        </div>
      </div>

      {/* Excel Ribbon */}
      <div className="excel-ribbon">
        <div className="ribbon-tabs">
          <span
            className={`tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </span>
          <span
            className={`tab ${activeTab === 'insert' ? 'active' : ''}`}
            onClick={() => setActiveTab('insert')}
          >
            Insert
          </span>
          <span
            className={`tab ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            Data
          </span>
          <span
            className={`tab ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            View
          </span>
        </div>
        <div className="ribbon-toolbar">
          {renderToolbar()}
          {saveMessage && <span className="save-msg">✓ {saveMessage}</span>}
        </div>
      </div>

      {/* Formula Bar */}
      <div className="excel-formula-bar">
        <div className="cell-address">{getCellAddress()}</div>
        <div className="formula-input">
          <span className="fx">fx</span>
          <input type="text" placeholder="" readOnly />
        </div>
      </div>

      {/* Spreadsheet */}
      <div className="excel-sheet">
        <table className={`excel-table ${!showGridlines ? 'no-gridlines' : ''}`}>
          {showHeadings && (
            <thead>
              <tr>
                <th className="row-header"></th>
                <th className="col-header">A<div className="header-label">Date</div></th>
                <th className="col-header">B<div className="header-label">Description</div></th>
                <th className="col-header">C<div className="header-label">Category</div></th>
                <th className="col-header">D<div className="header-label">Amount</div></th>
                <th className="col-header">E<div className="header-label"></div></th>
              </tr>
            </thead>
          )}
          <tbody>
            {incomeData.map((row, index) => (
              <tr key={row.id}>
                {showHeadings ? <td className="row-header">{index + 1}</td> : <td className="row-header-placeholder"></td>}
                <td>{renderCell(row, 'date', index, 'A')}</td>
                <td>{renderCell(row, 'description', index, 'B')}</td>
                <td>{renderCell(row, 'category', index, 'C')}</td>
                <td>{renderCell(row, 'amount', index, 'D')}</td>
                <td>
                  <button className="delete-row-btn" onClick={() => deleteRow(row.id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="total-row">
              {showHeadings ? <td className="row-header">{incomeData.length + 1}</td> : <td className="row-header-placeholder"></td>}
              <td></td>
              <td></td>
              <td className="total-label">TOTAL</td>
              <td className="total-value">₹ {totalIncome.toLocaleString()}</td>
              <td></td>
            </tr>
            {/* Empty rows for Excel feel */}
            {[...Array(10)].map((_, i) => (
              <tr key={`empty-${i}`} className="empty-row">
                {showHeadings ? <td className="row-header">{incomeData.length + 2 + i}</td> : <td className="row-header-placeholder"></td>}
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Bar */}
      <div className="excel-statusbar">
        <span>Ready</span>
        <div className="status-right">
          <span>Entries: {incomeData.length}</span>
          <span>Total: ₹{totalIncome.toLocaleString()}</span>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .excel-app {
          display: flex;
          flex-direction: column;
          height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 12px;
          background: #f3f3f3;
        }

        /* Title Bar */
        .excel-titlebar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 32px;
          background: #217346;
          color: white;
          padding: 0 8px;
        }

        .excel-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .excel-icon {
          width: 20px;
          height: 20px;
          background: white;
          color: #217346;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .window-controls {
          display: flex;
        }

        .window-controls button {
          width: 46px;
          height: 32px;
          border: none;
          background: transparent;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }

        .window-controls button:hover {
          background: rgba(255,255,255,0.1);
        }

        .window-controls button.close:hover {
          background: #c42b1c;
        }

        /* Ribbon */
        .excel-ribbon {
          background: #217346;
          border-bottom: 1px solid #1a5c38;
        }

        .ribbon-tabs {
          display: flex;
          gap: 0;
          padding: 0 8px;
          background: #217346;
        }

        .ribbon-tabs .tab {
          padding: 6px 16px;
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          font-size: 12px;
        }

        .ribbon-tabs .tab:hover {
          color: white;
        }

        .ribbon-tabs .tab.active {
          background: #f3f3f3;
          color: #217346;
          border-radius: 4px 4px 0 0;
        }

        .ribbon-toolbar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f3f3f3;
          border-bottom: 1px solid #d4d4d4;
          height: 80px; /* Fixed height for consistency */
        }

        .toolbar-group {
          display: flex;
          gap: 4px;
        }

        .toolbar-divider {
          width: 1px;
          height: 32px;
          background: #d4d4d4;
          margin: 0 8px;
        }

        .ribbon-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 12px;
          border: 1px solid transparent;
          background: transparent;
          border-radius: 3px;
          cursor: pointer;
          color: #333;
          font-size: 11px;
          min-width: 50px;
        }

        .ribbon-btn:hover {
          background: #e5e5e5;
          border-color: #c4c4c4;
        }
        
        .ribbon-btn.active {
          background: #dbeafe;
          border-color: #2563eb;
          color: #2563eb;
        }

        .ribbon-btn.primary {
          background: #217346;
          color: white;
        }

        .ribbon-btn.primary:hover {
          background: #1a5c38;
        }

        .save-msg {
          color: #217346;
          font-weight: 600;
          margin-left: auto;
        }

        /* Formula Bar */
        .excel-formula-bar {
          display: flex;
          align-items: center;
          height: 26px;
          background: white;
          border-bottom: 1px solid #d4d4d4;
        }

        .cell-address {
          width: 60px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #d4d4d4;
          font-weight: 500;
          background: #f8f8f8;
        }

        .formula-input {
          flex: 1;
          display: flex;
          align-items: center;
          height: 100%;
        }

        .formula-input .fx {
          padding: 0 8px;
          color: #666;
          font-style: italic;
          border-right: 1px solid #d4d4d4;
        }

        .formula-input input {
          flex: 1;
          height: 100%;
          border: none;
          padding: 0 8px;
          font-size: 12px;
          outline: none;
        }

        /* Spreadsheet */
        .excel-sheet {
          flex: 1;
          overflow: auto;
          background: white;
        }

        .excel-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        
        .excel-table.no-gridlines th, 
        .excel-table.no-gridlines td {
          border-color: transparent transparent #f1f5f9 transparent;
        }
        
        .excel-table.no-gridlines .row-header {
           border-right: 1px solid #d4d4d4;
        }

        .excel-table th, .excel-table td {
          border: 1px solid #d4d4d4;
          height: 24px;
          padding: 0;
          position: relative;
        }

        .col-header {
          background: #f0f0f0;
          font-weight: 500;
          text-align: center;
          color: #333;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .col-header .header-label {
          font-size: 9px;
          color: #666;
          font-weight: normal;
        }

        .row-header {
          width: 40px;
          min-width: 40px;
          background: #f0f0f0;
          text-align: center;
          font-weight: 500;
          color: #333;
        }
        
        .row-header-placeholder {
          width: 40px;
          background: #f0f0f0;
          border-right: 1px solid #d4d4d4;
        }

        .excel-table td:nth-child(2) { width: 100px; }
        .excel-table td:nth-child(3) { width: 300px; }
        .excel-table td:nth-child(4) { width: 100px; }
        .excel-table td:nth-child(5) { width: 120px; }
        .excel-table td:nth-child(6) { width: 50px; }

        .excel-cell {
          width: 100%;
          height: 100%;
          padding: 2px 4px;
          display: flex;
          align-items: center;
          cursor: cell;
          min-height: 22px;
        }

        .excel-cell:hover {
          background: #e8f4ec;
        }

        .excel-cell.selected {
          outline: 2px solid #217346;
          outline-offset: -1px;
          background: #e8f4ec;
        }

        .excel-cell.number {
          justify-content: flex-end;
          font-family: 'Consolas', monospace;
        }

        .excel-input {
          width: 100%;
          height: 100%;
          border: 2px solid #217346;
          padding: 2px 4px;
          font-size: 12px;
          font-family: inherit;
          outline: none;
          background: white;
        }

        .delete-row-btn {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-row-btn:hover {
          color: #c42b1c;
          background: #fce8e8;
        }

        .total-row {
          background: #e8f4ec;
          font-weight: 600;
        }

        .total-row .total-label {
          text-align: right;
          padding-right: 8px;
        }

        .total-row .total-value {
          font-family: 'Consolas', monospace;
          color: #217346;
          text-align: right;
          padding-right: 8px;
        }

        .empty-row td {
          background: white;
        }

        .empty-row .row-header {
          background: #f0f0f0;
        }

        /* Status Bar */
        .excel-statusbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 24px;
          padding: 0 12px;
          background: #217346;
          color: white;
          font-size: 11px;
        }

        .status-right {
          display: flex;
          gap: 20px;
        }
      `}</style>
    </div>
  );
};

export default IncomeSheet;
