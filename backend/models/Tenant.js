import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subscription: {
    plan: { type: String, enum: ["free", "pro"], default: "free" },
  },
});

const Tenant = mongoose.model("Tenant", TenantSchema);

export default Tenant;
