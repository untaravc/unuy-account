import {RestResponse} from "../../domain/rest_response";

export const dataToRestResponse = (data:any) : RestResponse =>{
    return {
        success: true,
        message: "Sucesss",
        data
    }
}

export const errorToRestResponse = (error:any): RestResponse => {
    return {
        success: false,
        message: error.toString(),
        data: null
    }
}