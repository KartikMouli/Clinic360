const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);


const generateDummyData = async () => {
  const patients = await Patient.create([
    { firstName: "John", lastName: "Doe", email: "john@example.com", password: await bcrypt.hash("password123", 10) },
    { firstName: "Jane", lastName: "Smith", email: "jane@example.com", password: await bcrypt.hash("password123", 10) },
    { firstName: "Michael", lastName: "Johnson", email: "michael@example.com", password: await bcrypt.hash("password123", 10) },
    { firstName: "Emily", lastName: "Brown", email: "emily@example.com", password: await bcrypt.hash("password123", 10) },
    { firstName: "David", lastName: "Wilson", email: "david@example.com", password: await bcrypt.hash("password123", 10) },
    { firstName: "Sarah", lastName: "Taylor", email: "sarah@example.com", password: await bcrypt.hash("password123", 10) },
    { firstName: "Robert", lastName: "Anderson", email: "robert@example.com", password: await bcrypt.hash("password123", 10) },
    { firstName: "Lisa", lastName: "Martinez", email: "lisa@example.com", password: await bcrypt.hash("password123", 10) },
    { firstName: "William", lastName: "Garcia", email: "william@example.com", password: await bcrypt.hash("password123", 10) },
    { firstName: "Jennifer", lastName: "Lopez", email: "jennifer@example.com", password: await bcrypt.hash("password123", 10) }
  ]);

  const doctors = await Doctor.create([
    { firstName: "Dr. Alice", lastName: "Johnson", email: "alice@example.com", password: await bcrypt.hash("password123", 10), specialization: "Cardiology", experience: 10, location: "New York", availabilitySlots: [] },
    { firstName: "Dr. Bob", lastName: "Williams", email: "bob@example.com", password: await bcrypt.hash("password123", 10), specialization: "Dermatology", experience: 8, location: "Los Angeles", availabilitySlots: [] },
    { firstName: "Dr. Carol", lastName: "Davis", email: "carol@example.com", password: await bcrypt.hash("password123", 10), specialization: "Pediatrics", experience: 12, location: "Chicago", availabilitySlots: [] },
    { firstName: "Dr. Daniel", lastName: "Miller", email: "daniel@example.com", password: await bcrypt.hash("password123", 10), specialization: "Orthopedics", experience: 15, location: "Houston", availabilitySlots: [] },
    { firstName: "Dr. Eva", lastName: "Wilson", email: "eva@example.com", password: await bcrypt.hash("password123", 10), specialization: "Neurology", experience: 9, location: "Phoenix", availabilitySlots: [] },
    { firstName: "Dr. Frank", lastName: "Moore", email: "frank@example.com", password: await bcrypt.hash("password123", 10), specialization: "Oncology", experience: 14, location: "Philadelphia", availabilitySlots: [] },
    { firstName: "Dr. Grace", lastName: "Taylor", email: "grace@example.com", password: await bcrypt.hash("password123", 10), specialization: "Gynecology", experience: 11, location: "San Antonio", availabilitySlots: [] },
    { firstName: "Dr. Henry", lastName: "Anderson", email: "henry@example.com", password: await bcrypt.hash("password123", 10), specialization: "Psychiatry", experience: 7, location: "San Diego", availabilitySlots: [] },
    { firstName: "Dr. Isabel", lastName: "Thomas", email: "isabel@example.com", password: await bcrypt.hash("password123", 10), specialization: "Endocrinology", experience: 13, location: "Dallas", availabilitySlots: [] },
    { firstName: "Dr. Jack", lastName: "Jackson", email: "jack@example.com", password: await bcrypt.hash("password123", 10), specialization: "Urology", experience: 6, location: "San Jose", availabilitySlots: [] }
  ]);

  // Generate some availability slots for doctors
  for (let doctor of doctors) {
    const slots = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      slots.push({
        date: date,
        startTime: "09:00",
        isAvailable: true
      });
    }
    doctor.availabilitySlots = slots;
    await doctor.save();
  }

  const appointments = await Appointment.create([
    { patientId: patients[0]._id, doctorId: doctors[0]._id, appointmentDate: new Date("2025-03-10"), startTime: "10:00", status: "Scheduled" },
    { patientId: patients[1]._id, doctorId: doctors[1]._id, appointmentDate: new Date("2025-03-15"), startTime: "14:00", status: "Scheduled" },
    { patientId: patients[2]._id, doctorId: doctors[2]._id, appointmentDate: new Date("2025-03-20"), startTime: "09:00", status: "Scheduled" },
    { patientId: patients[3]._id, doctorId: doctors[3]._id, appointmentDate: new Date("2025-03-25"), startTime: "11:00", status: "Scheduled" },
    { patientId: patients[4]._id, doctorId: doctors[4]._id, appointmentDate: new Date("2025-04-01"), startTime: "13:00", status: "Scheduled" },
    { patientId: patients[5]._id, doctorId: doctors[5]._id, appointmentDate: new Date("2025-04-05"), startTime: "15:00", status: "Scheduled" },
    { patientId: patients[6]._id, doctorId: doctors[6]._id, appointmentDate: new Date("2025-04-10"), startTime: "10:30", status: "Scheduled" },
    { patientId: patients[7]._id, doctorId: doctors[7]._id, appointmentDate: new Date("2025-04-15"), startTime: "14:30", status: "Scheduled" },
    { patientId: patients[8]._id, doctorId: doctors[8]._id, appointmentDate: new Date("2025-04-20"), startTime: "09:30", status: "Scheduled" },
    { patientId: patients[9]._id, doctorId: doctors[9]._id, appointmentDate: new Date("2025-04-25"), startTime: "11:30", status: "Scheduled" }
  ]);

  console.log(`Generated ${patients.length} patients, ${doctors.length} doctors, and ${appointments.length} appointments.`);
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
