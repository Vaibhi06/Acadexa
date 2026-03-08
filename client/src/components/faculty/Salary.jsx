import React, { useState, useRef } from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    DollarSign,
    Calendar,
    TrendingUp,
    Download,
    FileText,
    Clock,
    BookOpen,
    CheckCircle,
    ChevronRight,
    Printer
} from 'lucide-react';

const FacultySalary = () => {
    const [selectedMonth, setSelectedMonth] = useState('current');
    const slipRef = useRef(null);

    // Faculty info
    const facultyInfo = {
        id: 'FAC001',
        name: 'John Smith',
        department: 'Mathematics',
        designation: 'Senior Teacher',
        bankAccount: 'XXXX XXXX 1234',
        panNumber: 'ABCDE1234F'
    };

    // Per-lecture rate
    const perLectureRate = 500;

    // Current month data
    const currentMonthData = {
        month: 'January',
        year: 2026,
        lectures: [
            { date: '2026-01-02', subject: 'Mathematics', class: '10th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2026-01-02', subject: 'Physics', class: '11th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2026-01-03', subject: 'Mathematics', class: '10th Grade B', duration: '1 hour', status: 'completed' },
            { date: '2026-01-03', subject: 'Mathematics', class: '11th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2026-01-06', subject: 'Physics', class: '10th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2026-01-06', subject: 'Mathematics', class: '10th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2026-01-07', subject: 'Mathematics', class: '10th Grade B', duration: '1.5 hours', status: 'completed' },
        ],
        allowances: 2000,
        deductions: 1500
    };

    // Previous month data
    const previousMonthData = {
        month: 'December',
        year: 2025,
        lectures: [
            { date: '2025-12-02', subject: 'Mathematics', class: '10th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2025-12-02', subject: 'Physics', class: '11th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2025-12-03', subject: 'Mathematics', class: '10th Grade B', duration: '1 hour', status: 'completed' },
            { date: '2025-12-04', subject: 'Mathematics', class: '11th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2025-12-05', subject: 'Physics', class: '10th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2025-12-06', subject: 'Mathematics', class: '10th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2025-12-09', subject: 'Mathematics', class: '10th Grade B', duration: '1 hour', status: 'completed' },
            { date: '2025-12-10', subject: 'Physics', class: '11th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2025-12-11', subject: 'Mathematics', class: '10th Grade A', duration: '1 hour', status: 'completed' },
            { date: '2025-12-12', subject: 'Mathematics', class: '11th Grade A', duration: '1 hour', status: 'completed' },
        ],
        allowances: 2000,
        deductions: 1800,
        isPaid: true
    };

    const activeData = selectedMonth === 'current' ? currentMonthData : previousMonthData;

    // Calculate totals
    const totalLectures = activeData.lectures.length;
    const lectureEarnings = totalLectures * perLectureRate;
    const grossSalary = lectureEarnings + activeData.allowances;
    const netSalary = grossSalary - activeData.deductions;

    // Download salary slip
    const downloadSalarySlip = () => {
        const slipContent = `
SALARY SLIP
===========
${activeData.month} ${activeData.year}

Faculty Information
-------------------
Name: ${facultyInfo.name}
ID: ${facultyInfo.id}
Department: ${facultyInfo.department}
Designation: ${facultyInfo.designation}

Earnings
--------
Lectures Conducted: ${totalLectures}
Per Lecture Rate: ₹${perLectureRate}
Lecture Earnings: ₹${lectureEarnings.toLocaleString()}
Allowances: ₹${activeData.allowances.toLocaleString()}
Gross Salary: ₹${grossSalary.toLocaleString()}

Deductions
----------
Total Deductions: ₹${activeData.deductions.toLocaleString()}

Net Salary: ₹${netSalary.toLocaleString()}
===========

Generated on: ${new Date().toLocaleString()}
        `;

        const blob = new Blob([slipContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Salary_Slip_${activeData.month}_${activeData.year}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    // Print salary slip
    const printSalarySlip = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Salary Slip - ${activeData.month} ${activeData.year}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { margin: 0; color: #333; }
                    .header p { color: #666; margin: 5px 0; }
                    .section { margin-bottom: 25px; }
                    .section h3 { color: #FEA3BE; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
                    .label { color: #666; }
                    .value { font-weight: bold; color: #333; }
                    .total { background: #f8f8f8; padding: 15px; border-radius: 8px; margin-top: 20px; }
                    .total .row { border: none; font-size: 1.2em; }
                    .positive { color: #22c55e; }
                    .negative { color: #ef4444; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Acadexa International School</h1>
                    <p>SALARY SLIP</p>
                    <p>${activeData.month} ${activeData.year}</p>
                </div>
                
                <div class="section">
                    <h3>Faculty Information</h3>
                    <div class="row"><span class="label">Name</span><span class="value">${facultyInfo.name}</span></div>
                    <div class="row"><span class="label">Employee ID</span><span class="value">${facultyInfo.id}</span></div>
                    <div class="row"><span class="label">Department</span><span class="value">${facultyInfo.department}</span></div>
                    <div class="row"><span class="label">Designation</span><span class="value">${facultyInfo.designation}</span></div>
                </div>
                
                <div class="section">
                    <h3>Earnings</h3>
                    <div class="row"><span class="label">Lectures Conducted</span><span class="value">${totalLectures}</span></div>
                    <div class="row"><span class="label">Per Lecture Rate</span><span class="value">₹${perLectureRate}</span></div>
                    <div class="row"><span class="label">Lecture Earnings</span><span class="value positive">₹${lectureEarnings.toLocaleString()}</span></div>
                    <div class="row"><span class="label">Allowances</span><span class="value positive">+₹${activeData.allowances.toLocaleString()}</span></div>
                    <div class="row"><span class="label">Gross Salary</span><span class="value">₹${grossSalary.toLocaleString()}</span></div>
                </div>
                
                <div class="section">
                    <h3>Deductions</h3>
                    <div class="row"><span class="label">Total Deductions</span><span class="value negative">-₹${activeData.deductions.toLocaleString()}</span></div>
                </div>
                
                <div class="total">
                    <div class="row"><span class="label">Net Salary Payable</span><span class="value">₹${netSalary.toLocaleString()}</span></div>
                </div>
                
                <p style="color: #999; font-size: 12px; margin-top: 40px; text-align: center;">
                    Generated on: ${new Date().toLocaleString()}
                </p>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="admin-layout">
            <Sidebar role="faculty" />
            <div className="admin-main">
                <Navbar />
                <div className="salary-page">
                    {/* Page Header */}
                    <div className="page-header-section">
                        <div className="header-content">
                            <h1>Salary Information</h1>
                            <p className="page-subtitle">View your salary details and payment history</p>
                        </div>
                        <div className="header-actions">
                            <button className="action-btn download" onClick={downloadSalarySlip}>
                                <Download size={18} />
                                Download Slip
                            </button>
                            <button className="action-btn print" onClick={printSalarySlip}>
                                <Printer size={18} />
                                Print
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="salary-stats-grid">
                        <div className="salary-stat-card">
                            <div className="stat-icon-box lectures">
                                <BookOpen size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{totalLectures}</span>
                                <span className="stat-label">Lectures</span>
                            </div>
                        </div>

                        <div className="salary-stat-card">
                            <div className="stat-icon-box rate">
                                <Clock size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">₹{perLectureRate}</span>
                                <span className="stat-label">Per Lecture</span>
                            </div>
                        </div>

                        <div className="salary-stat-card">
                            <div className="stat-icon-box earnings">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">₹{lectureEarnings.toLocaleString()}</span>
                                <span className="stat-label">Lecture Earnings</span>
                            </div>
                        </div>

                        <div className="salary-stat-card highlight">
                            <div className="stat-icon-box net">
                                <DollarSign size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">₹{netSalary.toLocaleString()}</span>
                                <span className="stat-label">Net Salary</span>
                            </div>
                        </div>
                    </div>

                    {/* Month Tabs */}
                    <div className="month-tabs-container">
                        <div className="month-tabs">
                            <button
                                className={`month-tab ${selectedMonth === 'current' ? 'active' : ''}`}
                                onClick={() => setSelectedMonth('current')}
                            >
                                Current Month
                            </button>
                            <button
                                className={`month-tab ${selectedMonth === 'previous' ? 'active' : ''}`}
                                onClick={() => setSelectedMonth('previous')}
                            >
                                Previous Month
                            </button>
                        </div>
                        <div className="month-info">
                            <Calendar size={18} />
                            <span>{activeData.month} {activeData.year}</span>
                            {activeData.isPaid && (
                                <span className="paid-badge">
                                    <CheckCircle size={14} />
                                    Paid
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="salary-content-grid">
                        {/* Per-Lecture Payment Details */}
                        <div className="content-card lectures-card">
                            <div className="card-header">
                                <div className="header-left">
                                    <BookOpen size={20} />
                                    <h3>Per-Lecture Payment Details</h3>
                                </div>
                                <span className="lecture-count">{totalLectures} lectures</span>
                            </div>

                            <div className="lectures-list">
                                {activeData.lectures.map((lecture, idx) => (
                                    <div key={idx} className="lecture-item">
                                        <div className="lecture-date">
                                            <span className="date">{formatDate(lecture.date)}</span>
                                        </div>
                                        <div className="lecture-details">
                                            <h4>{lecture.subject}</h4>
                                            <p>{lecture.class} • {lecture.duration}</p>
                                        </div>
                                        <div className="lecture-amount">
                                            <CheckCircle size={16} className="completed-icon" />
                                            <span>₹{perLectureRate}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lectures-total">
                                <span>Total Lecture Earnings</span>
                                <span className="total-amount">₹{lectureEarnings.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Salary Summary */}
                        <div className="content-card summary-card">
                            <div className="card-header">
                                <div className="header-left">
                                    <FileText size={20} />
                                    <h3>Monthly Salary Summary</h3>
                                </div>
                            </div>

                            <div className="summary-content" ref={slipRef}>
                                {/* Earnings Section */}
                                <div className="summary-section">
                                    <h4 className="section-title earnings-title">Earnings</h4>
                                    <div className="summary-row">
                                        <span>Lecture Earnings ({totalLectures} × ₹{perLectureRate})</span>
                                        <span className="positive">₹{lectureEarnings.toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Allowances</span>
                                        <span className="positive">+₹{activeData.allowances.toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row subtotal">
                                        <span>Gross Salary</span>
                                        <span>₹{grossSalary.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Deductions Section */}
                                <div className="summary-section">
                                    <h4 className="section-title deductions-title">Deductions</h4>
                                    <div className="summary-row">
                                        <span>Tax & Other Deductions</span>
                                        <span className="negative">-₹{activeData.deductions.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Net Salary */}
                                <div className="net-salary-box">
                                    <div className="net-label">
                                        <DollarSign size={24} />
                                        <span>Net Salary Payable</span>
                                    </div>
                                    <span className="net-amount">₹{netSalary.toLocaleString()}</span>
                                </div>

                                {/* Payment Status */}
                                <div className={`payment-status ${activeData.isPaid ? 'paid' : 'pending'}`}>
                                    {activeData.isPaid ? (
                                        <>
                                            <CheckCircle size={18} />
                                            <span>Payment credited to account ending {facultyInfo.bankAccount.slice(-4)}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Clock size={18} />
                                            <span>Payment will be processed by end of month</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .salary-page {
                    padding: 2rem;
                    background: var(--bg-primary, #f8fafc);
                    min-height: 100vh;
                }
                
                .page-header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .header-content h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--text-primary, #1e293b);
                    margin: 0 0 0.5rem 0;
                }
                
                .page-subtitle {
                    color: var(--text-secondary, #64748b);
                    font-size: 0.95rem;
                    margin: 0;
                }
                
                .header-actions {
                    display: flex;
                    gap: 0.75rem;
                }
                
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                
                .action-btn.download {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }
                
                .action-btn.download:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
                }
                
                .action-btn.print {
                    background: var(--bg-card, white);
                    color: var(--text-primary, #1e293b);
                    border: 2px solid var(--border-color, #e2e8f0);
                }
                
                .action-btn.print:hover {
                    border-color: #FEA3BE;
                    color: #FEA3BE;
                }
                
                /* Stats Grid */
                .salary-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .salary-stat-card {
                    background: var(--bg-card, white);
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    border: 1px solid var(--border-color, #e2e8f0);
                }
                
                .salary-stat-card.highlight {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    border: none;
                }
                
                .salary-stat-card.highlight .stat-number,
                .salary-stat-card.highlight .stat-label {
                    color: white !important;
                }
                
                .salary-stat-card.highlight .stat-icon-box {
                    background: rgba(255,255,255,0.2) !important;
                }
                
                .stat-icon-box {
                    width: 52px;
                    height: 52px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                
                .stat-icon-box.lectures { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
                .stat-icon-box.rate { background: linear-gradient(135deg, #f59e0b, #d97706); }
                .stat-icon-box.earnings { background: linear-gradient(135deg, #FEA3BE, #FBA2AB); }
                .stat-icon-box.net { background: rgba(255,255,255,0.3); }
                
                .stat-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .stat-number {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--text-primary, #1e293b);
                }
                
                .stat-label {
                    font-size: 0.8rem;
                    color: var(--text-secondary, #64748b);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                /* Month Tabs */
                .month-tabs-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .month-tabs {
                    display: flex;
                    background: var(--bg-card, white);
                    border-radius: 12px;
                    padding: 4px;
                    border: 1px solid var(--border-color, #e2e8f0);
                }
                
                .month-tab {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    background: transparent;
                    color: var(--text-secondary, #64748b);
                    font-weight: 600;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                
                .month-tab.active {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }
                
                .month-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-primary, #1e293b);
                    font-weight: 600;
                }
                
                .month-info svg {
                    color: #FEA3BE;
                }
                
                .paid-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.75rem;
                    background: #dcfce7;
                    color: #16a34a;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-left: 0.5rem;
                }
                
                /* Content Grid */
                .salary-content-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                
                .content-card {
                    background: var(--bg-card, white);
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    border: 1px solid var(--border-color, #e2e8f0);
                }
                
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid var(--border-color, #f1f5f9);
                }
                
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #FEA3BE;
                }
                
                .header-left h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: var(--text-primary, #1e293b);
                }
                
                .lecture-count {
                    padding: 0.375rem 0.75rem;
                    background: #f1f5f9;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    color: var(--text-secondary, #64748b);
                    font-weight: 600;
                }
                
                /* Lectures List */
                .lectures-list {
                    max-height: 400px;
                    overflow-y: auto;
                    margin-bottom: 1rem;
                }
                
                .lecture-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                    margin-bottom: 0.75rem;
                    transition: all 0.2s;
                }
                
                .lecture-item:hover {
                    background: #f1f5f9;
                }
                
                .lecture-date {
                    min-width: 60px;
                }
                
                .lecture-date .date {
                    font-weight: 600;
                    color: var(--text-primary, #1e293b);
                    font-size: 0.9rem;
                }
                
                .lecture-details {
                    flex: 1;
                }
                
                .lecture-details h4 {
                    margin: 0 0 0.25rem 0;
                    font-size: 0.95rem;
                    color: var(--text-primary, #1e293b);
                }
                
                .lecture-details p {
                    margin: 0;
                    font-size: 0.8rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .lecture-amount {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 700;
                    color: #22c55e;
                }
                
                .completed-icon {
                    color: #22c55e;
                }
                
                .lectures-total {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem;
                    background: linear-gradient(135deg, #fef7f9, #fff5f7);
                    border-radius: 12px;
                    border: 1px solid #fecdd3;
                }
                
                .lectures-total span:first-child {
                    font-weight: 600;
                    color: var(--text-primary, #1e293b);
                }
                
                .total-amount {
                    font-weight: 800;
                    color: #FEA3BE;
                    font-size: 1.1rem;
                }
                
                /* Summary Card */
                .summary-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                
                .summary-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .section-title {
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin: 0 0 0.5rem 0;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                
                .earnings-title { color: #22c55e; }
                .deductions-title { color: #ef4444; }
                
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem 1rem;
                    background: #f8fafc;
                    border-radius: 8px;
                    font-size: 0.95rem;
                }
                
                .summary-row span:first-child {
                    color: var(--text-secondary, #64748b);
                }
                
                .summary-row.subtotal {
                    background: #f1f5f9;
                    font-weight: 600;
                }
                
                .summary-row.subtotal span {
                    color: var(--text-primary, #1e293b);
                }
                
                .positive { color: #22c55e; font-weight: 600; }
                .negative { color: #ef4444; font-weight: 600; }
                
                .net-salary-box {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    border-radius: 16px;
                    color: white;
                }
                
                .net-label {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-weight: 600;
                }
                
                .net-amount {
                    font-size: 1.75rem;
                    font-weight: 800;
                }
                
                .payment-status {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                
                .payment-status.paid {
                    background: #dcfce7;
                    color: #166534;
                }
                
                .payment-status.pending {
                    background: #fef3c7;
                    color: #92400e;
                }
                
                /* Responsive */
                @media (max-width: 1024px) {
                    .salary-content-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                @media (max-width: 768px) {
                    .salary-page {
                        padding: 1rem;
                    }
                    
                    .page-header-section {
                        flex-direction: column;
                    }
                    
                    .header-actions {
                        width: 100%;
                    }
                    
                    .action-btn {
                        flex: 1;
                        justify-content: center;
                    }
                    
                    .month-tabs-container {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .net-salary-box {
                        flex-direction: column;
                        text-align: center;
                        gap: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacultySalary;
