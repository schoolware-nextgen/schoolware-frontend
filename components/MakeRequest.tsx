export async function MakeRequest(url:string): Promise<JSON[]> {
    var data : JSON[] = 
    await fetch(url)    
    .then(res => res.json())
    .then(text => data = text);
    console.log(data)
    return data
}