import api from "./api";

// GET PUBLIC ACTIVE SPONSORS
export const getActiveMarqueeSponsors = () => {
    return api.get("/marquee");
};

// ADMIN GET ALL SPONSORS
export const getAllMarqueeSponsors = () => {
    return api.get("/marquee/admin");
};

// ADMIN CREATE SPONSOR
export const createMarqueeSponsor = (formData) => {
    return api.post(
        "/marquee/admin",
        formData,
        {
            headers:{
                "Content-Type":"multipart/form-data",
            }
        }
    );
};

// ADMIN UPDATE SPONSOR
export const updateMarqueeSponsor = (
    id,
    formData
) => {

    return api.put(
        `/marquee/admin/${id}`,
        formData,
        {
            headers:{
                "Content-Type":"multipart/form-data",
            }
        }
    );

};


// ADMIN TOGGLE STATUS
export const toggleMarqueeSponsor = (id)=>{

    return api.patch(
        `/marquee/admin/${id}/toggle`
    );

};


// ADMIN DELETE SPONSOR
export const deleteMarqueeSponsor = (id)=>{

    return api.delete(
        `/marquee/admin/${id}`
    );

};