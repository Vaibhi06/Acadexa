import React, { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import { DollarSign, Download, Calendar, TrendingUp, Users, CreditCard, AlertCircle, CheckCircle, Filter, Search } from 'lucide-react';

const FinanceManagement = () => {
    const [activeTab, setActiveTab] = useState('overview'); // overview, dues, history, reports
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Sample data - in real app, this would come from context/API
    const feeCollectionOverview = {
        totalCollected: 1250000,
        pending: 180000,
        totalExpected: 1430000,
        students: 165,
        paidStudents: 142,
        pendingStudents: 23
    };

    const monthlyData = [
        { month: 'January', collected: 145000, pending: 25000, expected: 170000 },
        { month: 'February', collected: 138000, pending: 22000, expected: 160000 },
        { month: 'March', collected: 152000, pending: 18000, expected: 170000 },
        { month: 'April', collected: 160000, pending: 20000, expected: 180000 },
        { month: 'May', collected: 155000, pending: 25000, expected: 180000 },
        { month: 'June', collected: 148000, pending: 22000, expected: 170000 },
    ];

    const pendingDues = [
        { id: 'STU001', name: 'John Doe', class: '10th Grade A', amount: 12000, dueDate: '2026-01-15', months: 2 },
        { id: 'STU002', name: 'Jane Smith', class: '10th Grade B', amount: 8000, dueDate: '2026-01-10', months: 1 },
        { id: 'STU003', name: 'Mike Johnson', class: '11th Grade A', amount: 15000, dueDate: '2025-12-30', months: 3 },
        { id: 'STU004', name: 'Sarah Williams', class: '12th Grade A', amount: 10000, dueDate: '2026-01-20', months: 1 },
    ];

    const paymentHistory = [
        { id: 'PAY001', student: 'Emily Davis', studentId: 'STU005', amount: 12000, date: '2026-01-02', method: 'Online', status: 'Success' },
        { id: 'PAY002', student: 'Robert Brown', studentId: 'STU006', amount: 8000, date: '2026-01-01', method: 'Cash', status: 'Success' },
        { id: 'PAY003', student: 'Tom Wilson', studentId: 'STU007', amount: 15000, date: '2025-12-30', method: 'Cheque', status: 'Success' },
        { id: 'PAY004', student: 'Lisa Anderson', studentId: 'STU008', amount: 10000, date: '2025-12-28', method: 'Online', status: 'Success' },
    ];

    const downloadCSV = (data, filename) => {
        let csv = '';
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            csv = headers.join(',') + '\\n';
            data.forEach(row => {
                csv += headers.map(header => row[header]).join(',') + '\\n';
            });
        }

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    const collectionPercentage = ((feeCollectionOverview.totalCollected / feeCollectionOverview.totalExpected) * 100).toFixed(1);
    const currentMonthData = monthlyData[selectedMonth];

    return (
        <div className="admin-layout">
            <Sidebar role="admin" />
            <div className="admin-main">
                <div className="admin-content">
                    <div className="page-header">
                        <div>
                            <h1>Finance Management</h1>
                            <p className="text-secondary">Track fees, payments, and financial reports</p>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="stats-grid">
                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                <CheckCircle size={28} />
                            </div>
                            <div>
                                <p className="stat-title">Total Collected</p>
                                <h3 className="stat-value">₹{feeCollectionOverview.totalCollected.toLocaleString()}</h3>
                                <p className="stat-subtitle">{collectionPercentage}% collected</p>
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                                <AlertCircle size={28} />
                            </div>
                            <div>
                                <p className="stat-title">Pending Dues</p>
                                <h3 className="stat-value">₹{feeCollectionOverview.pending.toLocaleString()}</h3>
                                <p className="stat-subtitle">{feeCollectionOverview.pendingStudents} students</p>
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                                <DollarSign size={28} />
                            </div>
                            <div>
                                <p className="stat-title">Total Expected</p>
                                <h3 className="stat-value">₹{feeCollectionOverview.totalExpected.toLocaleString()}</h3>
                                <p className="stat-subtitle">{feeCollectionOverview.students} students</p>
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                                <Users size={28} />
                            </div>
                            <div>
                                <p className="stat-title">Payment Rate</p>
                                <h3 className="stat-value">{((feeCollectionOverview.paidStudents / feeCollectionOverview.students) * 100).toFixed(0)}%</h3>
                                <p className="stat-subtitle">{feeCollectionOverview.paidStudents}/{feeCollectionOverview.students} paid</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="tabs-container">
                        <button
                            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <TrendingUp size={20} />
                            Overview
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'dues' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dues')}
                        >
                            <AlertCircle size={20} />
                            Pending Dues
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            <CreditCard size={20} />
                            Payment History
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reports')}
                        >
                            <Download size={20} />
                            Reports
                        </button>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <>
                            <div className="finance-overview glass-card">
                                <h3>Monthly Financial Summary</h3>
                                <div className="month-selector">
                                    <select
                                        className="input-field"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    >
                                        {monthlyData.map((m, idx) => (
                                            <option key={idx} value={idx}>{m.month} 2026</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="monthly-stats-grid">
                                    <div className="monthly-stat">
                                        <p className="stat-label">Collected</p>
                                        <p className="stat-value success">₹{currentMonthData?.collected.toLocaleString()}</p>
                                    </div>
                                    <div className="monthly-stat">
                                        <p className="stat-label">Pending</p>
                                        <p className="stat-value danger">₹{currentMonthData?.pending.toLocaleString()}</p>
                                    </div>
                                    <div className="monthly-stat">
                                        <p className="stat-label">Expected</p>
                                        <p className="stat-value">₹{currentMonthData?.expected.toLocaleString()}</p>
                                    </div>
                                    <div className="monthly-stat">
                                        <p className="stat-label">Collection Rate</p>
                                        <p className="stat-value">{((currentMonthData?.collected / currentMonthData?.expected) * 100).toFixed(1)}%</p>
                                    </div>
                                </div>

                                <div className="progress-bar" style={{ marginTop: '1.5rem' }}>
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${(currentMonthData?.collected / currentMonthData?.expected) * 100}%`,
                                            background: 'linear-gradient(135deg, #10b981, #059669)'
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="finance-overview glass-card">
                                <h3>Yearly Summary - 2026</h3>
                                <div className="table-container">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Month</th>
                                                <th>Collected</th>
                                                <th>Pending</th>
                                                <th>Expected</th>
                                                <th>Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monthlyData.map((month, idx) => (
                                                <tr key={idx}>
                                                    <td className="font-semibold">{month.month}</td>
                                                    <td className="success">₹{month.collected.toLocaleString()}</td>
                                                    <td className="danger">₹{month.pending.toLocaleString()}</td>
                                                    <td>₹{month.expected.toLocaleString()}</td>
                                                    <td>
                                                        <span className="badge badge-success">
                                                            {((month.collected / month.expected) * 100).toFixed(1)}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Pending Dues Tab */}
                    {activeTab === 'dues' && (
                        <div className="finance-container glass-card">
                            <div className="finance-header">
                                <h3>Pending Dues Tracking</h3>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => downloadCSV(pendingDues, 'pending_dues_report.csv')}
                                >
                                    <Download size={18} />
                                    Download CSV
                                </button>
                            </div>

                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Student ID</th>
                                            <th>Name</th>
                                            <th>Class</th>
                                            <th>Amount Due</th>
                                            <th>Due Date</th>
                                            <th>Months Pending</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingDues.map(due => (
                                            <tr key={due.id}>
                                                <td><span className="badge badge-primary">{due.id}</span></td>
                                                <td className="font-semibold">{due.name}</td>
                                                <td>{due.class}</td>
                                                <td className="font-semibold danger">₹{due.amount.toLocaleString()}</td>
                                                <td>{new Date(due.dueDate).toLocaleDateString()}</td>
                                                <td>{due.months} month{due.months > 1 ? 's' : ''}</td>
                                                <td>
                                                    <span className={`badge ${new Date(due.dueDate) < new Date() ? 'badge-danger' : 'badge-warning'}`}>
                                                        {new Date(due.dueDate) < new Date() ? 'Overdue' : 'Due Soon'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Payment History Tab */}
                    {activeTab === 'history' && (
                        <div className="finance-container glass-card">
                            <div className="finance-header">
                                <h3>Payment History</h3>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => downloadCSV(paymentHistory, 'payment_history_report.csv')}
                                >
                                    <Download size={18} />
                                    Download CSV
                                </button>
                            </div>

                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Payment ID</th>
                                            <th>Student ID</th>
                                            <th>Student Name</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Method</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentHistory.map(payment => (
                                            <tr key={payment.id}>
                                                <td><span className="badge badge-primary">{payment.id}</span></td>
                                                <td><span className="badge badge-secondary">{payment.studentId}</span></td>
                                                <td className="font-semibold">{payment.student}</td>
                                                <td className="font-semibold success">₹{payment.amount.toLocaleString()}</td>
                                                <td>{new Date(payment.date).toLocaleDateString()}</td>
                                                <td>{payment.method}</td>
                                                <td>
                                                    <span className="badge badge-success">
                                                        <CheckCircle size={14} style={{ marginRight: '4px' }} />
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="finance-container glass-card">
                            <h3>Financial Reports</h3>
                            <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                                Download comprehensive financial reports for analysis and record-keeping
                            </p>

                            <div className="reports-grid">
                                <div className="report-card">
                                    <div className="report-icon">
                                        <DollarSign size={32} />
                                    </div>
                                    <h4>Fee Collection Report</h4>
                                    <p>Complete overview of fee collection with student-wise breakdown</p>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => downloadCSV([feeCollectionOverview], 'fee_collection_summary.csv')}
                                    >
                                        <Download size={18} />
                                        Download CSV
                                    </button>
                                </div>

                                <div className="report-card">
                                    <div className="report-icon">
                                        <Calendar size={32} />
                                    </div>
                                    <h4>Monthly Summary Report</h4>
                                    <p>Month-wise financial breakdown for the current year</p>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => downloadCSV(monthlyData, 'monthly_summary_2026.csv')}
                                    >
                                        <Download size={18} />
                                        Download CSV
                                    </button>
                                </div>

                                <div className="report-card">
                                    <div className="report-icon">
                                        <AlertCircle size={32} />
                                    </div>
                                    <h4>Pending Dues Report</h4>
                                    <p>List of all students with pending fee payments</p>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => downloadCSV(pendingDues, 'pending_dues_detailed.csv')}
                                    >
                                        <Download size={18} />
                                        Download CSV
                                    </button>
                                </div>

                                <div className="report-card">
                                    <div className="report-icon">
                                        <CreditCard size={32} />
                                    </div>
                                    <h4>Payment History Report</h4>
                                    <p>Complete transaction history with payment methods</p>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => downloadCSV(paymentHistory, 'payment_history_detailed.csv')}
                                    >
                                        <Download size={18} />
                                        Download CSV
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #ffffff;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .admin-content {
          flex: 1;
          padding: 1.5rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          color: #1e293b;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .stat-title {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
          color: #1e293b;
        }

        .stat-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0.25rem 0 0 0;
        }

        .tabs-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: #FEA3BE;
        }

        .tab-btn.active {
          color: #FEA3BE;
          border-bottom-color: #FEA3BE;
        }

        .finance-overview,
        .finance-container {
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .finance-overview h3,
        .finance-container h3 {
          margin: 0 0 1.5rem 0;
          color: #1e293b;
          font-size: 1.5rem;
        }

        .month-selector {
          margin-bottom: 1.5rem;
          max-width: 300px;
        }

        .monthly-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .monthly-stat {
          text-align: center;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: #1e293b;
        }

        .stat-value.success {
          color: #10b981;
        }

        .stat-value.danger {
          color: #ef4444;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 6px;
        }

        .finance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .table-container {
          overflow-x: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead tr {
          border-bottom: 2px solid #e2e8f0;
        }

        .data-table th {
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #64748b;
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .data-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          color: #1e293b;
        }

        .data-table tbody tr:hover {
          background: #f8fafc;
        }

        .font-semibold {
          font-weight: 600;
        }

        .success {
          color: #10b981;
        }

        .danger {
          color: #ef4444;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .report-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          text-align: center;
          transition: all 0.3s;
        }

        .report-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          border-color: #FEA3BE;
        }

        .report-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .report-card h4 {
          margin: 0 0 0.75rem 0;
          color: #1e293b;
          font-size: 1.25rem;
        }

        .report-card p {
          color: #64748b;
          margin: 0 0 1.5rem 0;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .admin-content {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .tabs-container {
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .table-container {
            overflow-x: auto;
          }

          .data-table {
            min-width: 800px;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default FinanceManagement;
