import { 
    createEnquiryType,
     getAllEnquiryTypes,
      updateEnquiryType, deleteEnquiryType} from "../services/enquiryType.service.js"

export const fetchEnquiryTypes = async(req,res,next)=>{
    try{
        const data = await getAllEnquiryTypes();

        res.json({
            success: true,
            data
        });
    }catch(error){
        next(error);
    }
};

export const addEnquiryType = async(req,res,next)=>{
    try{
        const data = await createEnquiryType(req.body.name);
        res.status(201).json({
            success: true,
            message: "Enquiry type created",
            data
        });
    }catch(error){
        next(error);
    }
};

export const editEnquiryType = async(req,res,next)=>{
    try{
        const data = await updateEnquiryType(req.params.id, req.body.name);
        res.status(200).json({
            success: true,
            message: "Enquiry type updated",
            data
        });
    }catch(error){
        next(error);
    }
};

export const removeEnquiryType = async(req,res,next)=>{
    try{
        const data = await deleteEnquiryType(req.params.id);
        res.status(200).json({
            success: true,
            message: "Enquiry type deleted",
            data
        });
    }catch(error){
        next(error);
    }
};