export const extractFinalJsonAndMessage = (chunk: string): { jsonData: any; message: string } => {
    // Split the chunk into JSON and message parts
    const parts = chunk.split(":END_JSON:");

    const jsonString = parts[0].replace("FINAL_JSON:", "").trim();
    const message = parts[1].trim();

    // Parse the JSON part
    let jsonData;
    try {
        jsonData = JSON.parse(jsonString);
    } catch (error) {
        throw new Error("Invalid JSON format in FINAL_JSON section");
    }

    return { jsonData, message };
};