import React from 'react';
import Sidebar from '../shared/Sidebar';
import BirthdayWishes from '../shared/BirthdayWishes';

const StudentBirthdays = () => {
    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <BirthdayWishes />
            </div>
        </div>
    );
};

export default StudentBirthdays;
