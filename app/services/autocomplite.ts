export async function fetchLocationSuggestions (input:string) {
    try{
        
        const response = await fetch(`api/ingredients?input=${input}`);
        if (!response.ok) return console.error('Server Error!');
        const data = await response.json()

        return data
    }catch(error){
        console.error(error)
    }
}