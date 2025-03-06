export const deleteSeminar = async (seminarId: number): Promise<boolean> => {
    try {
        const response = await fetch(`http://localhost:5001/seminars/${seminarId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            return true;
        } else {
            throw new Error('Failed to delete seminar');
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};
