
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const path = require("path");

const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

const apiKey = process.env.GOOGLE_API_KEY2 || process.env.GOOGLE_API_KEY;
const client = new GoogleGenAI({ apiKey: apiKey });

async function main() {
    console.log("--- fileSearchStores Methods ---");
    // Get property names including prototype
    let obj = client.fileSearchStores;
    let props = [];
    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));
    console.log(props.sort().filter((v, i, a) => a.indexOf(v) === i && !v.startsWith('_')));

    console.log("\n--- files Methods ---");
    obj = client.files;
    props = [];
    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));
    console.log(props.sort().filter((v, i, a) => a.indexOf(v) === i && !v.startsWith('_')));
}
main();

export {};
