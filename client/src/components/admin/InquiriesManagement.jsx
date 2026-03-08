import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import { Mail, Phone, User, Calendar, Eye, X, MessageSquare, TrendingUp, Filter, Search, Edit, Plus, List, Send, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import './InquiriesManagement.css';

const InquiriesManagement = () => {
  const [viewMode, setViewMode] = useState('form'); // 'form' or 'list'
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch inquiries
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const output = await api.get('/inquiries');
      const data = output.data;

      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data);
        setInquiries([]);
        return;
      }

      // Transform data if necessary to match UI expectation
      const formattedData = data.map(item => ({
        ...item,
        name: item.studentName || 'Unknown Name',
        phone: item.studentMobile || '',
        date: item.createdAt || new Date().toISOString(),
        class: item.std || 'N/A',
        status: item.status || 'new', // Default status
        email: item.email || '',
        followUps: Array.isArray(item.followUps) ? item.followUps : []
      }));
      setInquiries(formattedData);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    studentMobile: '',
    email: '',
    fatherMobile: '',
    schoolName: '',
    percentage: '',
    std: '',
    medium: '',
    group: '',
    referenceBy: '',
    interestLevel: '',
    followUpDate: '',
    followUpTime: '',
    notes: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // List View State
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [followUpNote, setFollowUpNote] = useState('');

  // --- Actions ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inquiries', formData);
      await fetchInquiries(); // Refresh list
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          studentName: '',
          studentMobile: '',
          email: '',
          fatherMobile: '',
          schoolName: '',
          percentage: '',
          std: '',
          medium: '',
          group: '',
          referenceBy: '',
          interestLevel: '',
          followUpDate: '',
          followUpTime: '',
          notes: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status: newStatus });
      await fetchInquiries(); // Refresh list to get updated data

      // Update selected inquiry local state if it's currently open
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const addFollowUp = async (id) => {
    if (!followUpNote.trim()) return;

    try {
      const { data } = await api.post(`/inquiries/${id}/follow-up`, { note: followUpNote });
      await fetchInquiries();

      if (selectedInquiry?.id === id) {
        // The API returns the updated inquiry object, so we can use its followUps
        const updatedFollowUps = data.followUps || data;

        setSelectedInquiry(prev => ({
          ...prev,
          followUps: Array.isArray(updatedFollowUps) ? updatedFollowUps : prev.followUps
        }));
      }

      setFollowUpNote('');
    } catch (error) {
      console.error('Error adding follow-up:', error);
    }
  };

  const viewDetails = (inquiry) => {
    if (!inquiry) return;
    setSelectedInquiry({
      ...inquiry,
      followUps: Array.isArray(inquiry.followUps) ? inquiry.followUps : []
    });
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedInquiry(null);
    setFollowUpNote('');
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter(inq => {
    if (!inq) return false;
    const matchesStatus = filter === 'all' || inq.status === filter;

    // Safety checks for searching
    const nameMatch = (inq.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (inq.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = (inq.phone || '').includes(searchTerm);

    const matchesSearch = nameMatch || emailMatch || phoneMatch;
    return matchesStatus && matchesSearch;
  });

  // Analytics - safe checks
  const totalInquiries = inquiries.length;
  const newCount = inquiries.filter(i => i?.status === 'new').length;
  const inProgressCount = inquiries.filter(i => i?.status === 'in-progress').length;
  const convertedCount = inquiries.filter(i => i?.status === 'converted').length;
  const conversionRate = totalInquiries > 0 ? ((convertedCount / totalInquiries) * 100).toFixed(1) : 0;

  // Render Helper
  const getStatusBadge = (status) => {
    const s = status || 'new';
    const type = s === 'new' ? 'warning' : s === 'in-progress' ? 'primary' : 'success';
    return <span className={`badge badge-${type}`}>{s.replace('-', ' ')}</span>;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Safety Check */}
      {Sidebar ? <Sidebar role="admin" /> : <div>Sidebar Failed to Load</div>}

      <div className="admin-main">
        <div className="admin-content">
          <div className="page-header">
            <div>
              <h1>Inquiries Management</h1>
              <p className="text-secondary">Manage new and existing admission inquiries</p>
            </div>
            {/* View Mode Toggle */}
            <div className="header-tabs">
              <button
                className={`tab-btn ${viewMode === 'form' ? 'active' : ''}`}
                onClick={() => setViewMode('form')}
              >
                <Plus size={18} />
                New Inquiry
              </button>
              <button
                className={`tab-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
                View All
              </button>
            </div>
          </div>

          {viewMode === 'form' ? (
            <div className="form-container glass-card fade-in">
              <div className="form-header">
                <h2>Add New Inquiry</h2>
                <p>Enter the details of the prospective student/parent.</p>
              </div>

              {formSubmitted ? (
                <div className="success-message">
                  <CheckCircle size={48} />
                  <h3>Inquiry Submitted Successfully!</h3>
                  <p>The inquiry has been added to the list.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        studentName: '',
                        studentMobile: '',
                        email: '',
                        fatherMobile: '',
                        schoolName: '',
                        percentage: '',
                        std: '',
                        medium: '',
                        group: '',
                        referenceBy: '',
                        interestLevel: '',
                        followUpDate: '',
                        followUpTime: '',
                        notes: ''
                      });
                    }}
                  >
                    Add Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="inquiry-form">
                  <div className="form-grid">
                    {/* Student Name */}
                    <div className="form-group full-width">
                      <label>Student's Name <span className="required">*</span></label>
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="form-group full-width">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                      />
                    </div>

                    {/* Mobile Numbers */}
                    <div className="form-group">
                      <label>Student's Mobile No <span className="required">*</span></label>
                      <input
                        type="tel"
                        name="studentMobile"
                        value={formData.studentMobile}
                        onChange={handleInputChange}
                        placeholder="Enter mobile number"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Father's Mobile No <span className="required">*</span></label>
                      <input
                        type="tel"
                        name="fatherMobile"
                        value={formData.fatherMobile}
                        onChange={handleInputChange}
                        placeholder="Enter father's number"
                        required
                      />
                    </div>

                    {/* School Name */}
                    <div className="form-group full-width">
                      <label>School Name <span className="required">*</span></label>
                      <input
                        type="text"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        placeholder="Enter school name"
                        required
                      />
                    </div>

                    {/* Percentage & STD */}
                    <div className="form-group">
                      <label>Percentage <span className="required">*</span></label>
                      <input
                        type="text"
                        name="percentage"
                        value={formData.percentage}
                        onChange={handleInputChange}
                        placeholder="Enter percentage"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>STD <span className="required">*</span></label>
                      <input
                        type="text"
                        name="std"
                        value={formData.std}
                        onChange={handleInputChange}
                        placeholder="Enter standard/grade"
                        required
                      />
                    </div>

                    {/* Medium & Group */}
                    <div className="form-group">
                      <label>Medium <span className="required">*</span></label>
                      <select
                        name="medium"
                        value={formData.medium}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Medium</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Gujarati">Gujarati</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Group <span className="required">*</span></label>
                      <select
                        name="group"
                        value={formData.group}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Group</option>
                        <option value="Science">Science</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Arts">Arts</option>
                        <option value="General">General</option>
                      </select>
                    </div>

                    {/* Reference By */}
                    <div className="form-group full-width">
                      <label>Reference By <span className="required">*</span></label>
                      <input
                        type="text"
                        name="referenceBy"
                        value={formData.referenceBy}
                        onChange={handleInputChange}
                        placeholder="How did they hear about us?"
                        required
                      />
                    </div>

                    {/* Interest Level & Follow-Up Date */}
                    <div className="form-group">
                      <label>Interest Level <span className="required">*</span></label>
                      <select
                        name="interestLevel"
                        value={formData.interestLevel}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Level</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Follow-Up Date</label>
                      <input
                        type="date"
                        name="followUpDate"
                        value={formData.followUpDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Follow-Up Time */}
                    <div className="form-group">
                      <label>Follow-Up Time</label>
                      <input
                        type="time"
                        name="followUpTime"
                        value={formData.followUpTime}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Notes */}
                    <div className="form-group full-width">
                      <label>Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any additional notes or comments..."
                        rows="4"
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary submit-btn">
                      <Send size={18} />
                      Submit Inquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="list-view fade-in">
              {/* Analytics Cards */}
              <div className="stats-grid">
                <div className="stat-card glass-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                    <Mail size={28} />
                  </div>
                  <div>
                    <p className="stat-title">Total Inquiries</p>
                    <h3 className="stat-value">{totalInquiries}</h3>
                  </div>
                </div>

                <div
                  className={`stat-card glass-card ${filter === 'new' ? 'active-filter' : ''}`}
                  onClick={() => setFilter(filter === 'new' ? 'all' : 'new')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <MessageSquare size={28} />
                  </div>
                  <div>
                    <p className="stat-title">New</p>
                    <h3 className="stat-value">{newCount}</h3>
                  </div>
                </div>

                <div
                  className={`stat-card glass-card ${filter === 'in-progress' ? 'active-filter' : ''}`}
                  onClick={() => setFilter(filter === 'in-progress' ? 'all' : 'in-progress')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <Edit size={28} />
                  </div>
                  <div>
                    <p className="stat-title">In Progress</p>
                    <h3 className="stat-value">{inProgressCount}</h3>
                  </div>
                </div>

                <div
                  className={`stat-card glass-card ${filter === 'converted' ? 'active-filter' : ''}`}
                  onClick={() => setFilter(filter === 'converted' ? 'all' : 'converted')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <p className="stat-title">Converted ({conversionRate}%)</p>
                    <h3 className="stat-value">{convertedCount}</h3>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="search-filter-bar glass-card">
                <div className="search-box">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="filter-box">
                  <Filter size={20} />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
              </div>

              {/* Inquiries List */}
              <div className="inquiries-grid">
                {filteredInquiries.length === 0 ? (
                  <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p className="text-secondary">No inquiries found</p>
                  </div>
                ) : (
                  filteredInquiries.map(inquiry => (
                    <div key={inquiry.id || Math.random()} className="inquiry-card glass-card">
                      <div className="inquiry-header">
                        <div>
                          <h3>{inquiry.name}</h3>
                          {getStatusBadge(inquiry.status)}
                        </div>
                        <div className="inquiry-date">
                          <Calendar size={14} />
                          {inquiry.date ? new Date(inquiry.date).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>

                      <div className="inquiry-details">
                        <div className="detail-item">
                          <Mail size={16} />
                          <span>{inquiry.email || 'No Email'}</span>
                        </div>
                        <div className="detail-item">
                          <Phone size={16} />
                          <span>{inquiry.phone || 'No Phone'}</span>
                        </div>
                        <div className="detail-item">
                          <User size={16} />
                          <span>{inquiry.class}</span>
                        </div>
                      </div>

                      <div className="inquiry-actions">
                        <button
                          className="btn btn-outline"
                          onClick={() => viewDetails(inquiry)}
                        >
                          <Eye size={16} />
                          View Details
                        </button>

                        {inquiry.status === 'new' && (
                          <button
                            className="btn btn-primary"
                            onClick={() => updateStatus(inquiry.id, 'in-progress')}
                          >
                            Start Follow-up
                          </button>
                        )}

                        {inquiry.status === 'in-progress' && (
                          <button
                            className="btn btn-primary"
                            onClick={() => updateStatus(inquiry.id, 'converted')}
                          >
                            Mark Converted
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Details Modal */}
          {showDetails && selectedInquiry && (
            <div className="modal-overlay" onClick={closeDetails}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <h2>{selectedInquiry.name}</h2>
                    {getStatusBadge(selectedInquiry.status)}
                  </div>
                  <button className="close-btn" onClick={closeDetails}>
                    <X size={24} />
                  </button>
                </div>

                <div className="modal-body">
                  {/* Contact Information */}
                  <div className="details-section">
                    <h3>Contact Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <Mail size={18} />
                        <div>
                          <p className="info-label">Email</p>
                          <p className="info-value">{selectedInquiry.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <Phone size={18} />
                        <div>
                          <p className="info-label">Phone</p>
                          <p className="info-value">{selectedInquiry.phone || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <Calendar size={18} />
                        <div>
                          <p className="info-label">Inquiry Date</p>
                          <p className="info-value">{selectedInquiry.date ? new Date(selectedInquiry.date).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <User size={18} />
                        <div>
                          <p className="info-label">Interested Class</p>
                          <p className="info-value">{selectedInquiry.class}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="details-section">
                    <h3>Message / Notes</h3>
                    <p className="inquiry-message">{selectedInquiry.notes || selectedInquiry.message || 'No additional notes.'}</p>
                  </div>

                  {/* Follow-ups */}
                  <div className="details-section">
                    <h3>Follow-up History</h3>
                    {(!selectedInquiry.followUps || selectedInquiry.followUps.length === 0) ? (
                      <p className="text-secondary">No follow-ups yet</p>
                    ) : (
                      <div className="follow-ups-list">
                        {selectedInquiry.followUps.map((fu, idx) => (
                          <div key={idx} className="follow-up-item">
                            <div className="follow-up-date">
                              <Calendar size={14} />
                              {fu.date ? new Date(fu.date).toLocaleDateString() : 'Unknown Date'}
                            </div>
                            <p>{fu.note}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Follow-up */}
                  {selectedInquiry.status !== 'converted' && (
                    <div className="details-section">
                      <h3>Add Follow-up Note</h3>
                      <div className="follow-up-form">
                        <textarea
                          className="input-field"
                          placeholder="Enter follow-up details..."
                          value={followUpNote}
                          onChange={(e) => setFollowUpNote(e.target.value)}
                          rows="3"
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() => addFollowUp(selectedInquiry.id)}
                          disabled={!followUpNote.trim()}
                        >
                          Add Follow-up
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="details-section">
                    <h3>Change Status</h3>
                    <div className="status-actions">
                      {selectedInquiry.status === 'new' && (
                        <button
                          className="btn btn-primary"
                          onClick={() => updateStatus(selectedInquiry.id, 'in-progress')}
                        >
                          Mark as In Progress
                        </button>
                      )}
                      {selectedInquiry.status === 'in-progress' && (
                        <>
                          <button
                            className="btn btn-outline"
                            onClick={() => updateStatus(selectedInquiry.id, 'new')}
                          >
                            Back to New
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => updateStatus(selectedInquiry.id, 'converted')}
                          >
                            Mark as Converted
                          </button>
                        </>
                      )}
                      {selectedInquiry.status === 'converted' && (
                        <p className="text-success" style={{ margin: 0 }}>✅ This inquiry has been successfully converted!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiriesManagement;
