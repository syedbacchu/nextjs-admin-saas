export const safeParse = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    try {
        return typeof data === 'string' ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};