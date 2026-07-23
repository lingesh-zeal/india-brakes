import api from "./api";

export const getHeroBanner = async()=>{
    const response = await api.get("/hero-banner");
    return response.data;
};

export const updateHeroBanner = async(formData)=>{
    const response = await api.put(
        "/hero-banner",
        formData
        // {
        //     headers:{
        //         "Content-Type":"multipart/form-data"
        //     }
        // }
    );

    return response.data;
};