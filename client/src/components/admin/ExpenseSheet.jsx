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

const ExpenseSheet = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showGridlines, setShowGridlines] = useState(true);
  const [showHeadings, setShowHeadings] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const inputRef = useRef(null);

  // Load data from API
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      if (response.data.success) {
        setExpenseData(response.data.data.expenses);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  const expenseCategories = ['Salary', 'Utilities', 'Supplies', 'Maintenance', 'Other'];
  const totalExpense = expenseData.reduce((sum, item) => sum + Number(item.amount), 0);
  const columns = ['A', 'B', 'C', 'D', 'E'];
  const columnNames = { A: 'date', B: 'description', C: 'category', D: 'amount', E: 'actions' };

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.select) inputRef.current.select();
    }
  }, [editingCell]);

  useEffect(() => {
    document.title = 'Expense Sheet - Acadexa';
  }, []);

  const addNewRow = async () => {
    const newRow = {
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Salary',
      amount: 0
    };
    try {
      const response = await api.post('/expenses', newRow);
      if (response.data.success) {
        const createdExpense = response.data.data.expense;
        setExpenseData([createdExpense, ...expenseData]);
        setTimeout(() => {
          setEditingCell({ rowId: createdExpense.id, field: 'description' });
          setSelectedCell({ row: 1, col: 'B' });
        }, 100);
      }
    } catch (error) {
      console.error('Failed to add row:', error);
    }
  };

  const deleteRow = async (id) => {
    if (window.confirm('Delete this row?')) {
      try {
        await api.delete(`/expenses/${id}`);
        setExpenseData(expenseData.filter(item => item.id !== id));
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
    setExpenseData(expenseData.map(item => {
      if (item.id === rowId) {
        return { ...item, [field]: field === 'amount' ? (parseFloat(value) || 0) : value };
      }
      return item;
    }));
  };

  const handleKeyDown = (e, rowId, field) => {
    const rowIndex = expenseData.findIndex(r => r.id === rowId);
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
    // Auto-saves on blur
    setSaveMessage('Saved!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleBlur = async () => {
    if (editingCell) {
      const rowToUpdate = expenseData.find(r => r.id === editingCell.rowId);
      if (rowToUpdate) {
        try {
          await api.put(`/expenses/${rowToUpdate.id}`, rowToUpdate);
        } catch (error) {
          console.error('Failed to update row:', error);
        }
      }
    }
    setEditingCell(null);
  };

  const sortData = (field, direction) => {
    const sorted = [...expenseData].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setExpenseData(sorted);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...expenseData.map(row => [row.date, `"${row.description}"`, row.category, row.amount].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Expense_Sheet.csv';
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
            {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
          <span>Expense Sheet - Acadexa</span>
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
            {expenseData.map((row, index) => (
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
            <tr className="total-row">
              {showHeadings ? <td className="row-header">{expenseData.length + 1}</td> : <td className="row-header-placeholder"></td>}
              <td></td>
              <td></td>
              <td className="total-label">TOTAL</td>
              <td className="total-value">₹ {totalExpense.toLocaleString()}</td>
              <td></td>
            </tr>
            {[...Array(10)].map((_, i) => (
              <tr key={`empty-${i}`} className="empty-row">
                {showHeadings ? <td className="row-header">{expenseData.length + 2 + i}</td> : <td className="row-header-placeholder"></td>}
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
          <span>Entries: {expenseData.length}</span>
          <span>Total: ₹{totalExpense.toLocaleString()}</span>
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

        .excel-titlebar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 32px;
          background: #c0392b;
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
          color: #c0392b;
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
          background: #a93226;
        }

        .excel-ribbon {
          background: #c0392b;
          border-bottom: 1px solid #a93226;
        }

        .ribbon-tabs {
          display: flex;
          gap: 0;
          padding: 0 8px;
          background: #c0392b;
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
          color: #c0392b;
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
          background: #c0392b;
          color: white;
        }

        .ribbon-btn.primary:hover {
          background: #a93226;
        }

        .save-msg {
          color: #27ae60;
          font-weight: 600;
          margin-left: auto;
        }

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
          background: #fce8e8;
        }

        .excel-cell.selected {
          outline: 2px solid #c0392b;
          outline-offset: -1px;
          background: #fce8e8;
        }

        .excel-cell.number {
          justify-content: flex-end;
          font-family: 'Consolas', monospace;
        }

        .excel-input {
          width: 100%;
          height: 100%;
          border: 2px solid #c0392b;
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
          color: #c0392b;
          background: #fce8e8;
        }

        .total-row {
          background: #fce8e8;
          font-weight: 600;
        }

        .total-row .total-label {
          text-align: right;
          padding-right: 8px;
        }

        .total-row .total-value {
          font-family: 'Consolas', monospace;
          color: #c0392b;
          text-align: right;
          padding-right: 8px;
        }

        .empty-row td {
          background: white;
        }

        .empty-row .row-header {
          background: #f0f0f0;
        }

        .excel-statusbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 24px;
          padding: 0 12px;
          background: #c0392b;
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

export default ExpenseSheet;
