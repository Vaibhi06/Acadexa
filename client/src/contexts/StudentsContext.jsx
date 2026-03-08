import React, { createContext, useState, useContext, useEffect } from 'react';

const StudentsContext = createContext(null);

const API_URL = 'http://127.0.0.1:5000/api/students';

export const useStudents = () => {
    const context = useContext(StudentsContext);
    if (!context) {
        throw new Error('useStudents must be used within StudentsProvider');
    }
    return context;
};

export const StudentsProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get token from localStorage
    const getToken = () => {
        return localStorage.getItem('token');
    };

    // Fetch all students from API
    const fetchStudents = async () => {
        try {
            const token = getToken();
            console.log('📡 Fetching students from API...');
            console.log('Token exists:', !!token);

            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (data.success && data.data) {
                console.log(`✅ Loaded ${data.data.students.length} students from database`);
                setStudents(data.data.students);
            } else {
                console.error('❌ API returned success:false or missing data:', data);
            }
            setLoading(false);
        } catch (error) {
            console.error('❌ [StudentsContext] Error fetching students:', error);
            setStudents([]); // Reset on error
            setLoading(false);
        }
    };

    // Load students on mount
    useEffect(() => {
        fetchStudents();
    }, []);

    // Add new student
    const addStudent = async (studentData) => {
        try {
            const token = getToken();
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(studentData)
            });

            const data = await response.json();

            if (data.success) {
                await fetchStudents(); // Refresh the list
                return { success: true, message: data.message };
            }

            return { success: false, message: data.message };
        } catch (error) {
            console.error('Error adding student:', error);
            return { success: false, message: 'Failed to add student' };
        }
    };

    // Delete student
    const deleteStudent = async (id) => {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                await fetchStudents(); // Refresh the list
                return { success: true, message: data.message };
            }

            return { success: false, message: data.message };
        } catch (error) {
            console.error('Error deleting student:', error);
            return { success: false, message: 'Failed to delete student' };
        }
    };

    // Get all students
    const getStudents = () => {
        return students;
    };

    // Get student by ID
    const getStudentById = (id) => {
        return students.find(s => s.id === id);
    };

    // Get students by class
    const getStudentsByClass = (classCode) => {
        return students.filter(s => s.classCode === classCode);
    };

    // Get total count
    const getTotalCount = () => {
        return students.length;
    };

    // Get class distribution
    const getClassDistribution = () => {
        const distribution = {};
        students.forEach(s => {
            const code = s.classCode || 'Unknown';
            distribution[code] = (distribution[code] || 0) + 1;
        });
        return distribution;
    };

    const value = {
        students,
        loading,
        addStudent,
        deleteStudent,
        getStudents,
        getStudentById,
        getStudentsByClass,
        getTotalCount,
        getClassDistribution,
        refreshStudents: fetchStudents
    };

    return (
        <StudentsContext.Provider value={value}>
            {children}
        </StudentsContext.Provider>
    );
};
