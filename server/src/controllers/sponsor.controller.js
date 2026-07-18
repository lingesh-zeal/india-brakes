import { 
    createSponsorInquiry, 
    getSponsorInquiries, 
    updateSponsorStatus,
    updateSponsorInquiry
} from "../services/sponsor.service.js";

export const submitSponsorInquiry = async(req, res, next)=>{
    try{
        const data= await createSponsorInquiry(req.body);
        res.status(201).json({
            success: true, 
            message: "Your Inquiry has been submitted successfully",
            data
        });
    }catch(error){
        next(error);
    }
};

export const fetchSponsorInquiries = async(req,res,next)=>{
    try{
        const data = await getSponsorInquiries();

        res.json({
            success: true,
            data
        });
    }catch(error){
        next(error);
    }
};

export const changeSponsorStatus = async(req,res,next)=>{
    try{
        const data= await updateSponsorStatus(
            req.params.id,
            req.body.status
        );
        res.json({
            success: true,
            message: "Status updated",
            data
        });
    }catch(err){
        next(err)
    }
};

export const editSponsorInquiry = async(req,res,next)=>{
    try{
        const data = await updateSponsorInquiry(
            req.params.id, req.body
        );

        res.json({
            success: true,
            message: "Inquiry Updated",
            data
        });

    }catch(error){
        next(error)
    }
}