import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Sidebar from '../shared/Sidebar';
import * as XLSX from 'xlsx/xlsx.mjs';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  FileSpreadsheet,
  Plus,
  Trash2,
  Save,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Edit2,
  Check
} from 'lucide-react';

const IncomeDashboard = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [activeSheet, setActiveSheet] = useState(null); // 'income' or 'expense'

  // Load data from API
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          api.get('/incomes'),
          api.get('/expenses')
        ]);

        if (incomeRes.data.success) {
          setIncomeData(incomeRes.data.data.incomes);
        }
        if (expenseRes.data.success) {
          setExpenseData(expenseRes.data.data.expenses);
        }
      } catch (error) {
        console.error('Failed to fetch finance data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [editingRow, setEditingRow] = useState(null);
  const [editingData, setEditingData] = useState({});

  // Calculate totals
  const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpense = expenseData.reduce((sum, item) => sum + Number(item.amount), 0);
  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;

  // Category-wise breakdown
  const incomeByCategory = incomeData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const expenseByCategory = expenseData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  // Add new row
  const addNewRow = (type) => {
    const newRow = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: type === 'income' ? 'Fees' : 'Salary',
      amount: 0
    };

    if (type === 'income') {
      setIncomeData([...incomeData, newRow]);
    } else {
      setExpenseData([...expenseData, newRow]);
    }
    setEditingRow(newRow.id);
    setEditingData(newRow);
  };

  // Delete row
  const deleteRow = (type, id) => {
    if (type === 'income') {
      setIncomeData(incomeData.filter(item => item.id !== id));
    } else {
      setExpenseData(expenseData.filter(item => item.id !== id));
    }
  };

  // Start editing
  const startEditing = (row) => {
    setEditingRow(row.id);
    setEditingData({ ...row });
  };

  // Save editing
  const saveEditing = (type) => {
    if (type === 'income') {
      setIncomeData(incomeData.map(item =>
        item.id === editingRow ? { ...editingData, amount: parseFloat(editingData.amount) || 0 } : item
      ));
    } else {
      setExpenseData(expenseData.map(item =>
        item.id === editingRow ? { ...editingData, amount: parseFloat(editingData.amount) || 0 } : item
      ));
    }
    setEditingRow(null);
    setEditingData({});
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingRow(null);
    setEditingData({});
  };

  const incomeCategories = ['Fees', 'Admission', 'Donation', 'Other'];
  const expenseCategories = ['Salary', 'Utilities', 'Supplies', 'Maintenance', 'Other'];

  // Download as Excel file
  const downloadExcel = (type) => {
    const data = type === 'income' ? incomeData : expenseData;
    const filename = type === 'income' ? 'Income_Sheet.xlsx' : 'Expense_Sheet.xlsx';

    // Prepare data for Excel
    const excelData = data.map((item, index) => ({
      'S.No': index + 1,
      'Date': new Date(item.date).toLocaleDateString('en-IN'),
      'Description': item.description,
      'Category': item.category,
      'Amount (₹)': item.amount
    }));

    // Add total row
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    excelData.push({
      'S.No': '',
      'Date': '',
      'Description': '',
      'Category': 'Total',
      'Amount (₹)': total
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws['!cols'] = [
      { wch: 6 },   // S.No
      { wch: 12 },  // Date
      { wch: 40 },  // Description
      { wch: 15 },  // Category
      { wch: 15 }   // Amount
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type === 'income' ? 'Income' : 'Expenses');

    // Download file
    XLSX.writeFile(wb, filename);
  };

  const pageContent = (
    <div className="income-dashboard-page" style={embedded ? { padding: 0, background: 'transparent', minHeight: 'auto' } : {}}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <DollarSign size={32} />
          </div>
          <div>
            <h1>{embedded ? 'Finance Management' : 'Income Dashboard'}</h1>
            <p>Track and manage your institute's finances</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card income">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Income</p>
            <h2 className="stat-value">₹{totalIncome.toLocaleString()}</h2>
            <div className="stat-badge positive">
              <ArrowUpRight size={14} />
              +12.5% this month
            </div>
          </div>
        </div>

        <div className="stat-card expense">
          <div className="stat-icon">
            <TrendingDown size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Expenses</p>
            <h2 className="stat-value">₹{totalExpense.toLocaleString()}</h2>
            <div className="stat-badge negative">
              <ArrowDownRight size={14} />
              +8.2% this month
            </div>
          </div>
        </div>

        <div className={`stat-card ${netProfit >= 0 ? 'profit' : 'loss'}`}>
          <div className="stat-icon">
            <PiggyBank size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">{netProfit >= 0 ? 'Net Profit' : 'Net Loss'}</p>
            <h2 className="stat-value">₹{Math.abs(netProfit).toLocaleString()}</h2>
            <div className={`stat-badge ${netProfit >= 0 ? 'positive' : 'negative'}`}>
              {netProfit >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {profitMargin}% margin
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="breakdown-section">
        <div className="breakdown-card">
          <h3>Income by Category</h3>
          <div className="category-list">
            {Object.entries(incomeByCategory).map(([category, amount]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-amount income">₹{amount.toLocaleString()}</span>
                <div className="category-bar">
                  <div
                    className="bar-fill income"
                    style={{ width: `${(amount / totalIncome) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="breakdown-card">
          <h3>Expenses by Category</h3>
          <div className="category-list">
            {Object.entries(expenseByCategory).map(([category, amount]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-amount expense">₹{amount.toLocaleString()}</span>
                <div className="category-bar">
                  <div
                    className="bar-fill expense"
                    style={{ width: `${(amount / totalExpense) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sheet Buttons */}
      <div className="sheet-buttons">
        <button
          className="sheet-btn income"
          onClick={() => navigate('/admin/income-sheet')}
        >
          <FileSpreadsheet size={20} />
          Open Income Sheet
          <span className="count">{incomeData.length}</span>
        </button>
        <button
          className="sheet-btn expense"
          onClick={() => navigate('/admin/expense-sheet')}
        >
          <FileSpreadsheet size={20} />
          Open Expense Sheet
          <span className="count">{expenseData.length}</span>
        </button>
      </div>

      <style>{`
        .income-dashboard-page {
          padding: 2rem;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Header */
        .page-header {
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .page-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .page-header p {
          color: #64748b;
          margin: 0.25rem 0 0 0;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border-left: 4px solid transparent;
        }

        .stat-card.income {
          border-left-color: #10b981;
        }

        .stat-card.expense {
          border-left-color: #ef4444;
        }

        .stat-card.profit {
          border-left-color: #3b82f6;
        }

        .stat-card.loss {
          border-left-color: #f59e0b;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-card.income .stat-icon {
          background: #d1fae5;
          color: #10b981;
        }

        .stat-card.expense .stat-icon {
          background: #fee2e2;
          color: #ef4444;
        }

        .stat-card.profit .stat-icon {
          background: #dbeafe;
          color: #3b82f6;
        }

        .stat-card.loss .stat-icon {
          background: #fef3c7;
          color: #f59e0b;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0 0 0.5rem 0;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .stat-badge.positive {
          background: #d1fae5;
          color: #10b981;
        }

        .stat-badge.negative {
          background: #fee2e2;
          color: #ef4444;
        }

        /* Breakdown Section */
        .breakdown-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .breakdown-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .breakdown-card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1.25rem 0;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .category-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.5rem;
          align-items: center;
        }

        .category-name {
          font-size: 0.9rem;
          color: #64748b;
        }

        .category-amount {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .category-amount.income {
          color: #10b981;
        }

        .category-amount.expense {
          color: #ef4444;
        }

        .category-bar {
          grid-column: 1 / -1;
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .bar-fill.income {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .bar-fill.expense {
          background: linear-gradient(90deg, #ef4444, #f87171);
        }

        /* Sheet Buttons */
        .sheet-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .sheet-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.25rem 2rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sheet-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .sheet-btn.income {
          background: linear-gradient(135deg, #10b981, #059669);
          border-color: transparent;
          color: white;
        }

        .sheet-btn.expense {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-color: transparent;
          color: white;
        }

        .sheet-btn .count {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.625rem;
          border-radius: 12px;
          font-size: 0.85rem;
          color: white;
        }

        .sheet-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Sheet Container */
        .sheet-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .sheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .sheet-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .add-row-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-row-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
        }

        /* Excel Table */
        .excel-table-wrapper {
          overflow-x: auto;
        }

        .excel-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .excel-table th {
          background: #f8fafc;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #64748b;
          border-bottom: 2px solid #e2e8f0;
          white-space: nowrap;
        }

        .excel-table td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
        }

        .excel-table tbody tr:hover {
          background: #fafafa;
        }

        .excel-table tbody tr.editing {
          background: #fffbeb;
        }

        .col-sn { width: 50px; text-align: center; }
        .col-date { width: 120px; }
        .col-desc { min-width: 200px; }
        .col-cat { width: 120px; }
        .col-amount { width: 140px; text-align: right; }
        .col-actions { width: 100px; text-align: center; }

        .excel-table input,
        .excel-table select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .excel-table input:focus,
        .excel-table select:focus {
          outline: none;
          border-color: #FEA3BE;
        }

        .category-tag {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .category-tag.income {
          background: #d1fae5;
          color: #059669;
        }

        .category-tag.expense {
          background: #fee2e2;
          color: #dc2626;
        }

        .amount.income {
          color: #10b981;
          font-weight: 600;
        }

        .amount.expense {
          color: #ef4444;
          font-weight: 600;
        }

        .action-icon {
          background: none;
          border: none;
          padding: 0.375rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          margin: 0 0.125rem;
        }

        .action-icon.edit {
          color: #3b82f6;
        }

        .action-icon.edit:hover {
          background: #dbeafe;
        }

        .action-icon.delete {
          color: #ef4444;
        }

        .action-icon.delete:hover {
          background: #fee2e2;
        }

        .action-icon.save {
          color: #10b981;
        }

        .action-icon.save:hover {
          background: #d1fae5;
        }

        .action-icon.cancel {
          color: #64748b;
        }

        .action-icon.cancel:hover {
          background: #f1f5f9;
        }

        /* Table Footer */
        .excel-table tfoot td {
          background: #f8fafc;
          font-weight: 700;
          border-top: 2px solid #e2e8f0;
        }

        .total-label {
          text-align: right;
          color: #64748b;
        }

        .total-amount {
          text-align: right;
        }

        .total-amount.income {
          color: #10b981;
        }

        .total-amount.expense {
          color: #ef4444;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .income-dashboard-page {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .sheet-buttons {
            flex-direction: column;
          }

          .sheet-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .add-row-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );

  // Return with or without layout wrapper based on embedded prop
  if (embedded) {
    return pageContent;
  }

  return (
    <div className="admin-layout">
      <Sidebar role="admin" />
      <div className="admin-main">
        {pageContent}
      </div>
    </div>
  );
};

export default IncomeDashboard;
