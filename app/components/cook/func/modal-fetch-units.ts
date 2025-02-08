

export interface returnData {
    choice:string,
    amount:number,
    _id:string
}

export async function getUnits (props:string ):Promise<returnData[]>{
    const response = await fetch(props, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Server Error!');
    }
    
    const dataList = await response.json()
    return dataList
}