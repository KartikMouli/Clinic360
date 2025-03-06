const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);


const generateDummyData = async () => {

  const doctors = await Doctor.create([
    { firstName: "Dr. Alice", lastName: "Johnson", email: "alice@example.com", password: await bcrypt.hash("password123", 10), specialization: "Cardiologist", experience: 10, location: "New York", availabilitySlots: [] },
    { firstName: "Dr. Bob", lastName: "Williams", email: "bob@example.com", password: await bcrypt.hash("password123", 10), specialization: "Dermatologist", experience: 8, location: "Los Angeles", availabilitySlots: [] },
    { firstName: "Dr. Carol", lastName: "Davis", email: "carol@example.com", password: await bcrypt.hash("password123", 10), specialization: "Pediatrician", experience: 12, location: "Chicago", availabilitySlots: [] },
    { firstName: "Dr. Daniel", lastName: "Miller", email: "daniel@example.com", password: await bcrypt.hash("password123", 10), specialization: "Orthopedics", experience: 15, location: "Houston", availabilitySlots: [] },
    { firstName: "Dr. Eva", lastName: "Wilson", email: "eva@example.com", password: await bcrypt.hash("password123", 10), specialization: "Neurologist", experience: 9, location: "Phoenix", availabilitySlots: [] },
    { firstName: "Dr. Frank", lastName: "Moore", email: "frank@example.com", password: await bcrypt.hash("password123", 10), specialization: "Orthopedic", experience: 14, location: "Philadelphia", availabilitySlots: [] },
    { firstName: "Dr. Grace", lastName: "Taylor", email: "grace@example.com", password: await bcrypt.hash("password123", 10), specialization: "Gynecologist", experience: 11, location: "San Antonio", availabilitySlots: [] },
    { firstName: "Dr. Henry", lastName: "Anderson", email: "henry@example.com", password: await bcrypt.hash("password123", 10), specialization: "Psychiatrist", experience: 7, location: "San Diego", availabilitySlots: [] },
    { firstName: "Dr. Isabel", lastName: "Thomas", email: "isabel@example.com", password: await bcrypt.hash("password123", 10), specialization: "ENT Specialist", experience: 13, location: "Dallas", availabilitySlots: [] },
    { firstName: "Dr. Jack", lastName: "Jackson", email: "jack@example.com", password: await bcrypt.hash("password123", 10), specialization: "General Physician", experience: 6, location: "San Jose", availabilitySlots: [] }
  ]);




  for (let doctor of doctors) {
    await doctor.save();
  }



  console.log(`Generated ${doctors.length} doctors.`);
};

const main = async () => {
  try {
    await generateDummyData();
    console.log("Dummy data generation completed successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

main();
