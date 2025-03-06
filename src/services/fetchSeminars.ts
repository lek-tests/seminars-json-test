import {Seminar} from "./types.ts";

export const fetchSeminars = async (): Promise<Seminar[]> => {

    try {
        const response = await fetch('http://localhost:5001/seminars');
        if (!response.ok) throw new Error('Failed to fetch seminars');
        const data: Seminar[] = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        return [];
    }
};



