import React from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import BirthdayWishes from '../shared/BirthdayWishes';

const FacultyBirthdays = () => {
    return (
        <div className="admin-layout">
            <Sidebar role="faculty" />
            <div className="admin-main">
                <Navbar />
                <div className="admin-content" style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
                    <BirthdayWishes />
                </div>
            </div>
        </div>
    );
};

export default FacultyBirthdays;
