const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true }, // Unique job link
  title: { type: String, required: true },
  company_name: { type: String, required: true },
  company_logo: { type: String }, // Optional
  category: { type: String },
  tags: { type: [String] }, // Array of tags
  job_type: { type: String }, // full_time, part_time, etc.
  publication_date: { type: Date },
  candidate_required_location: { type: String },
  salary: { type: String }, // Salary information
  description: { type: String }, // Full job description
});

module.exports = mongoose.model("Job", JobSchema);
