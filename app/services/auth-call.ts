import { RequestData } from "../../config/auth/auth";



export async function postCall<T>(requestData: RequestData<T>): Promise<Response> {
    try {
        const response = await fetch(requestData.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData.data),
        });

        if (!response.ok) {
            console.error('Response error:', response.status, response.statusText);
            throw new Error(`Request execution error: ${response.status} ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('Query execution error:', error);
        throw new Error(`Error during query execution: ${error}`);
    }
}



export async function getCall(url: string):Promise<Response>{
    try{
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            console.error('Response error:', response.status, response.statusText);
            throw new Error(`Request execution error: ${response.status} ${response.statusText}`);
        }

        return response;
    }catch(error){
        console.error('Query execution error:', error);
        throw new Error(`Error during query execution: ${error}`);
    }
}