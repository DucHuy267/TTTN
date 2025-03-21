import axios from 'axios';

const API_URL = "http://localhost:4000/brands";

export async function getAllBrand() {
    try {
        const response = await axios.get(`${API_URL}/getAll`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error?.message);
        return [];
    }
}

export async function addBrand(newBrand) {
    try {
        const response = await axios.post(`${API_URL}/addBrand`, newBrand, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error?.message);
        return [];
    }
}

export async function getDetailBrand(brandId) {
    try {
        const response = await axios.get(`${API_URL}/getDetailBrand/${brandId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error?.message);
        return [];
    }
}

export async function updateBrand(brandId, updatedData) {
    try {
        const response = await axios.put(`${API_URL}/updateBrand/${brandId}`, updatedData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error?.message);
        return [];
    }
}

export async function deleteBrand(brandId) {
    try {
        const response = await axios.delete(`${API_URL}/deleteBrand/${brandId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error?.message);
        return [];
    }
}
