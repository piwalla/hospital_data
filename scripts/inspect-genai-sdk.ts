
try {
    const pkg = require("@google/genai");
    console.log("Exports:", Object.keys(pkg));
    if (pkg.Client) {
        console.log("Client found.");
    }
} catch(e) {
    console.error("Failed to require @google/genai:", e);
}
