import mongoose from "mongoose";

mongoose
    .connect(
        "mongodb+srv://admin:admin@whatsapp-cluster.38vq8k0.mongodb.net/nxvcfapp?retryWrites=true&w=majority"
    )
    .then(() => console.log("MongoDB Connected OK ✅"))
    .catch(err => console.error("Mongo error ❌", err));
