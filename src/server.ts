import app from "./app";

const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on localhost ${PORT}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use. Kill the other process or use a different port.`);
    } else {
        console.error("❌ Server error:", err);
    }
    process.exit(1);
});