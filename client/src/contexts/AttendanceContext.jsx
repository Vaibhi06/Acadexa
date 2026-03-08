import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AttendanceContext = createContext(null);



export const useAttendance = () => {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error('useAttendance must be used within AttendanceProvider');
    }
    return context;
};

export const AttendanceProvider = ({ children }) => {
    // We don't cache all records anymore as it's too large.
    // We rely on getAttendance fetching specific data.
    // However, some analytics components might expect all records (or class records).
    // Let's adopt a fetch-on-demand strategy.



    // Save attendance for a specific date and class
    const saveAttendance = async (date, classCode, students) => {
        try {
            const response = await api.post('/attendance', { date, classCode, students });
            const data = response.data;

            // const data = await response.json(); // api returns data in response.data

            if (data.success) {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Failed to save attendance' };
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            return { success: false, message: 'Network error saving attendance' };
        }
    };

    // Get attendance (Single date or Range)
    const getAttendance = async (date, classCode, startDate = null, endDate = null) => {
        try {
            let query = `classCode=${classCode}`;

            if (date) {
                query += `&date=${date}`;
            } else if (startDate && endDate) {
                query += `&startDate=${startDate}&endDate=${endDate}`;
            }

            const response = await api.get(`/attendance?${query}`);
            const data = response.data;


            if (data.success) {
                return data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching attendance:', error);
            return null;
        }
    };

    // Get all attendance records (Used for analytics/export)
    const getAllAttendance = async () => {
        // Implementation for downloading ALL records might be heavy.
        // For now, let's return [] or implement a dedicated endpoint if needed.
        // Or fetch strictly what's needed.
        // The frontend calls getAllAttendance() in exportToCSV and analytics.
        // Ideally we should move analytics to Backend.
        console.warn('getAllAttendance is deprecated for full DB. Use specific fetch.');
        return [];
    };

    const value = {
        saveAttendance,
        getAttendance,
        getAllAttendance
    };

    return (
        <AttendanceContext.Provider value={value}>
            {children}
        </AttendanceContext.Provider>
    );
};
