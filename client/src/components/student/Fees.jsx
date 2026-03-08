import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    CreditCard,
    Download,
    Calendar,
    CheckCircle,
    Clock,
    AlertTriangle,
    IndianRupee,
    FileText,
    Bell
} from 'lucide-react';

const Fees = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Fee structure data
    const feeData = {
        totalFees: 85000,
        paidAmount: 55000,
        pendingAmount: 30000,
        dueDate: 'January 15, 2026',
        academicYear: '2025-26'
    };

    // Installment structure
    const installments = [
        { id: 1, name: 'First Installment', amount: 25000, dueDate: 'Apr 10, 2025', status: 'paid', paidDate: 'Apr 8, 2025', receiptNo: 'REC-2025-001' },
        { id: 2, name: 'Second Installment', amount: 20000, dueDate: 'Jul 10, 2025', status: 'paid', paidDate: 'Jul 5, 2025', receiptNo: 'REC-2025-002' },
        { id: 3, name: 'Third Installment', amount: 10000, dueDate: 'Oct 10, 2025', status: 'paid', paidDate: 'Oct 12, 2025', receiptNo: 'REC-2025-003' },
        { id: 4, name: 'Fourth Installment', amount: 15000, dueDate: 'Jan 15, 2026', status: 'upcoming', paidDate: null, receiptNo: null },
        { id: 5, name: 'Fifth Installment', amount: 15000, dueDate: 'Mar 10, 2026', status: 'pending', paidDate: null, receiptNo: null },
    ];

    // Fee breakdown
    const feeBreakdown = [
        { category: 'Tuition Fee', amount: 50000 },
        { category: 'Lab Fee', amount: 10000 },
        { category: 'Library Fee', amount: 5000 },
        { category: 'Sports Fee', amount: 5000 },
        { category: 'Computer Fee', amount: 8000 },
        { category: 'Examination Fee', amount: 7000 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return '#22c55e';
            case 'upcoming': return '#f59e0b';
            case 'pending': return '#94a3b8';
            case 'overdue': return '#ef4444';
            default: return '#64748b';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid': return <CheckCircle size={18} />;
            case 'upcoming': return <Bell size={18} />;
            case 'pending': return <Clock size={18} />;
            case 'overdue': return <AlertTriangle size={18} />;
            default: return <Clock size={18} />;
        }
    };

    const upcomingInstallment = installments.find(i => i.status === 'upcoming');
    const paidInstallments = installments.filter(i => i.status === 'paid');

    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <Navbar />
                <div className="fees-page">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="header-info">
                            <h1>💰 Fee Management</h1>
                            <p>Academic Year {feeData.academicYear}</p>
                        </div>
                    </div>

                    {/* Fee Overview Cards */}
                    <div className="overview-cards">
                        <div className="overview-card total">
                            <div className="card-icon">
                                <IndianRupee size={24} />
                            </div>
                            <div className="card-content">
                                <span className="card-label">Total Fees</span>
                                <span className="card-value">₹{feeData.totalFees.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="overview-card paid">
                            <div className="card-icon">
                                <CheckCircle size={24} />
                            </div>
                            <div className="card-content">
                                <span className="card-label">Paid Amount</span>
                                <span className="card-value">₹{feeData.paidAmount.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="overview-card pending">
                            <div className="card-icon">
                                <Clock size={24} />
                            </div>
                            <div className="card-content">
                                <span className="card-label">Pending Amount</span>
                                <span className="card-value">₹{feeData.pendingAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-section">
                        <div className="progress-header">
                            <span>Payment Progress</span>
                            <span>{((feeData.paidAmount / feeData.totalFees) * 100).toFixed(0)}% Complete</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(feeData.paidAmount / feeData.totalFees) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Upcoming Installment Alert */}
                    {upcomingInstallment && (
                        <div className="alert-card">
                            <div className="alert-icon">
                                <Bell size={24} />
                            </div>
                            <div className="alert-content">
                                <h3>Upcoming Payment Due</h3>
                                <p><strong>{upcomingInstallment.name}</strong> of ₹{upcomingInstallment.amount.toLocaleString()} is due on <strong>{upcomingInstallment.dueDate}</strong></p>
                            </div>
                            <button className="pay-now-btn">Pay Now</button>
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="tab-nav">
                        <button
                            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Installment Structure
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            Payment History
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'breakdown' ? 'active' : ''}`}
                            onClick={() => setActiveTab('breakdown')}
                        >
                            Fee Breakdown
                        </button>
                    </div>

                    {/* Installment Structure */}
                    {activeTab === 'overview' && (
                        <div className="installments-section">
                            <div className="installments-list">
                                {installments.map((installment, idx) => (
                                    <div key={idx} className={`installment-card ${installment.status}`}>
                                        <div className="installment-status" style={{ background: getStatusColor(installment.status) }}>
                                            {getStatusIcon(installment.status)}
                                        </div>
                                        <div className="installment-info">
                                            <h4>{installment.name}</h4>
                                            <p className="due-date">
                                                <Calendar size={14} />
                                                Due: {installment.dueDate}
                                            </p>
                                        </div>
                                        <div className="installment-amount">
                                            <span className="amount">₹{installment.amount.toLocaleString()}</span>
                                            <span className={`status-badge ${installment.status}`}>
                                                {installment.status.charAt(0).toUpperCase() + installment.status.slice(1)}
                                            </span>
                                        </div>
                                        {installment.status === 'paid' && (
                                            <button className="download-btn" title="Download Receipt">
                                                <Download size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payment History */}
                    {activeTab === 'history' && (
                        <div className="history-section">
                            <div className="history-list">
                                {paidInstallments.map((payment, idx) => (
                                    <div key={idx} className="history-card">
                                        <div className="history-icon">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div className="history-info">
                                            <h4>{payment.name}</h4>
                                            <div className="history-meta">
                                                <span>Paid on {payment.paidDate}</span>
                                                <span className="dot">•</span>
                                                <span>{payment.receiptNo}</span>
                                            </div>
                                        </div>
                                        <div className="history-amount">
                                            ₹{payment.amount.toLocaleString()}
                                        </div>
                                        <button className="receipt-btn">
                                            <FileText size={16} />
                                            Receipt
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="total-paid">
                                <span>Total Paid</span>
                                <span>₹{paidInstallments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    {/* Fee Breakdown */}
                    {activeTab === 'breakdown' && (
                        <div className="breakdown-section">
                            <div className="breakdown-list">
                                {feeBreakdown.map((item, idx) => (
                                    <div key={idx} className="breakdown-item">
                                        <span className="breakdown-category">{item.category}</span>
                                        <span className="breakdown-amount">₹{item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="breakdown-total">
                                    <span>Total</span>
                                    <span>₹{feeBreakdown.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .fees-page {
                    padding: 2rem;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .page-header {
                    margin-bottom: 2rem;
                }

                .header-info h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .header-info p {
                    color: #64748b;
                    margin: 0;
                }

                /* Overview Cards */
                .overview-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .overview-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .card-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .overview-card.total .card-icon { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
                .overview-card.paid .card-icon { background: linear-gradient(135deg, #22c55e, #16a34a); }
                .overview-card.pending .card-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }

                .card-content {
                    display: flex;
                    flex-direction: column;
                }

                .card-label {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .card-value {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #1e293b;
                }

                /* Progress Section */
                .progress-section {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .progress-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                    color: #1e293b;
                }

                .progress-bar {
                    height: 12px;
                    background: #e2e8f0;
                    border-radius: 6px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #22c55e, #16a34a);
                    border-radius: 6px;
                    transition: width 0.5s ease;
                }

                /* Alert Card */
                .alert-card {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    background: linear-gradient(135deg, #fef3c7, #fde68a);
                    border: 2px solid #f59e0b;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }

                .alert-icon {
                    width: 50px;
                    height: 50px;
                    background: #f59e0b;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .alert-content {
                    flex: 1;
                }

                .alert-content h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #92400e;
                    margin: 0 0 0.25rem 0;
                }

                .alert-content p {
                    color: #a16207;
                    margin: 0;
                    font-size: 0.95rem;
                }

                .pay-now-btn {
                    padding: 0.875rem 1.5rem;
                    background: #f59e0b;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .pay-now-btn:hover {
                    background: #d97706;
                }

                /* Tab Navigation */
                .tab-nav {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    background: white;
                    padding: 0.5rem;
                    border-radius: 12px;
                    width: fit-content;
                }

                .tab-btn {
                    padding: 0.75rem 1.25rem;
                    border: none;
                    background: transparent;
                    border-radius: 10px;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .tab-btn:hover {
                    background: #f1f5f9;
                }

                .tab-btn.active {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }

                /* Installments Section */
                .installments-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .installment-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: white;
                    border-radius: 14px;
                    padding: 1.25rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .installment-status {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .installment-info {
                    flex: 1;
                }

                .installment-info h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .due-date {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #64748b;
                    margin: 0;
                }

                .installment-amount {
                    text-align: right;
                }

                .amount {
                    display: block;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-top: 0.25rem;
                }

                .status-badge.paid { background: #dcfce7; color: #16a34a; }
                .status-badge.upcoming { background: #fef3c7; color: #d97706; }
                .status-badge.pending { background: #f1f5f9; color: #64748b; }

                .download-btn {
                    width: 44px;
                    height: 44px;
                    background: #dcfce7;
                    border: none;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #22c55e;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .download-btn:hover {
                    background: #bbf7d0;
                }

                /* History Section */
                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .history-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: white;
                    border-radius: 14px;
                    padding: 1.25rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .history-icon {
                    width: 44px;
                    height: 44px;
                    background: #dcfce7;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #22c55e;
                }

                .history-info {
                    flex: 1;
                }

                .history-info h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .history-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: #64748b;
                }

                .dot {
                    color: #cbd5e1;
                }

                .history-amount {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #22c55e;
                }

                .receipt-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1rem;
                    background: #f1f5f9;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .receipt-btn:hover {
                    background: #e2e8f0;
                    color: #1e293b;
                }

                .total-paid {
                    display: flex;
                    justify-content: space-between;
                    background: white;
                    border-radius: 14px;
                    padding: 1.25rem;
                    margin-top: 1rem;
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: #1e293b;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                /* Breakdown Section */
                .breakdown-list {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .breakdown-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                }

                .breakdown-category {
                    color: #64748b;
                }

                .breakdown-amount {
                    font-weight: 600;
                    color: #1e293b;
                }

                .breakdown-total {
                    display: flex;
                    justify-content: space-between;
                    padding: 1.25rem 1.5rem;
                    background: #f8fafc;
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: #1e293b;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .fees-page {
                        padding: 1rem;
                    }

                    .alert-card {
                        flex-direction: column;
                        text-align: center;
                    }

                    .installment-card,
                    .history-card {
                        flex-wrap: wrap;
                    }

                    .installment-amount,
                    .history-amount {
                        width: 100%;
                        text-align: left;
                        margin-top: 0.5rem;
                    }

                    .tab-nav {
                        width: 100%;
                        overflow-x: auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default Fees;
