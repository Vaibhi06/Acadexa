import React, { createContext, useState, useContext, useEffect } from 'react';

const ClassesContext = createContext(null);

const API_URL = '/api/classes';

export const useClasses = () => {
    const context = useContext(ClassesContext);
    if (!context) {
        throw new Error('useClasses must be used within ClassesProvider');
    }
    return context;
};

export const ClassesProvider = ({ children }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get token from localStorage
    const getToken = () => {
        return localStorage.getItem('token');
    };

    // Fetch all classes from API
    const fetchClasses = async () => {
        setLoading(true);
        try {
            console.log('📚 [ClassesContext] Fetching classes from API...');
            const token = getToken();

            if (!token) {
                console.warn('⚠️ [ClassesContext] No authentication token found.');
                setError('Not authenticated. Please log in.');
                setLoading(false);
                return;
            }

            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            console.log('📡 [ClassesContext] API Response status:', response.status);
            const data = await response.json();
            console.log('📦 [ClassesContext] API Response data:', data);

            if (data.success && data.data) {
                const fetchedClasses = data.data.classes || [];
                console.log(`✅ [ClassesContext] ${fetchedClasses.length} classes loaded successfully`);
                setClasses(fetchedClasses);
                setError(null);
            } else {
                console.error('❌ [ClassesContext] API error:', data.message);
                setError(data.message || 'Failed to load classes');
            }
        } catch (error) {
            console.error('❌ [ClassesContext] Network/Parse error:', error);
            setError('Failed to connect to server. Please ensure backend is running.');
            setClasses([]); // Reset on error
        } finally {
            setLoading(false);
        }
    };

    // Load classes on mount
    useEffect(() => {
        fetchClasses();
    }, []);

    // Add new class
    const addClass = async (classData) => {
        try {
            const token = getToken();
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(classData)
            });

            const data = await response.json();

            if (data.success) {
                await fetchClasses(); // Refresh the list
                return { success: true, message: data.message };
            }

            return { success: false, message: data.message };
        } catch (error) {
            console.error('Error adding class:', error);
            return { success: false, message: 'Failed to add class' };
        }
    };

    // Delete class
    const deleteClass = async (id) => {
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
                await fetchClasses(); // Refresh the list
                setError(null); // Clear any previous errors
                return { success: true, message: data.message };
            }

            setError(data.message || 'Failed to delete class');
            return { success: false, message: data.message };
        } catch (error) {
            console.error('❌ [ClassesContext] Error deleting class:', error);
            setError('Failed to delete class. Please check your connection.');
            // No need to setClasses([]) here, as fetchClasses() will be called on success,
            // and on network error, the current list might still be valid.
            return { success: false, message: 'Failed to delete class' };
        }
    };

    // Update class
    const updateClass = async (id, classData) => {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(classData)
            });

            const data = await response.json();

            if (data.success) {
                await fetchClasses(); // Refresh the list
                return { success: true, message: data.message };
            }

            return { success: false, message: data.message };
        } catch (error) {
            console.error('Error updating class:', error);
            return { success: false, message: 'Failed to update class' };
        }
    };

    // Get all classes
    const getClasses = () => {
        return classes;
    };

    // Get class by ID
    const getClassById = (id) => {
        return classes.find(c => c.id === id);
    };

    // Get class names only (for dropdowns)
    const getClassNames = () => {
        return classes.map(c => c.name);
    };

    const value = {
        classes,
        loading,
        error,
        addClass,
        deleteClass,
        updateClass,
        getClasses,
        getClassById,
        getClassNames,
        refreshClasses: fetchClasses
    };

    return (
        <ClassesContext.Provider value={value}>
            {children}
        </ClassesContext.Provider>
    );
};
