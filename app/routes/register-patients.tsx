// app/routes/api/patients.tsx
import { json } from '@remix-run/node';
import { prisma } from '~/utils/db.server'; // Adjust the import according to your setup

export const action = async ({ request }: { request: Request }) => {
  try {
    const data = await request.json();
    
    const email = data.email;
    const phone = data.phone;
    const name = data.name;
    const birthDate = data.birthDate;
    const gender = data.gender;
    const address = data.address;
    const occupation = data.occupation;
    const emergencyContactNumber = data.emergencyContactNumber || null;
    const currentMedication = data.currentMedication || null;
    const pastMedicalHistory = data.pastMedicalHistory || null;
    const allergies = data.allergies || null;
    const image = data.image || null;
    const treatmentPlace = data.treatmentPlace || null;

    console.log({ email, phone, name, birthDate, gender, address, occupation, emergencyContactNumber, currentMedication, pastMedicalHistory, allergies, image, treatmentPlace });

    // Validate required fields
    if (!email || !phone || !name || !birthDate || !gender || !address || !occupation) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct patient data object
    const patient = {
      email,
      phone,
      name,
      birthDate: new Date(birthDate),
      gender,
      address,
      occupation,
      emergencyContactNumber,
      currentMedication,
      pastMedicalHistory,
      allergies,
      image,
      treatmentPlace
    };

    // Create patient record
    const newPatient = await prisma.patient.create({
      data: patient,
    });

    return "👍Patient created successfully";
  } catch (error) {
    console.error('Error creating patient:', error);
    return json({ error: 'An error occurred while creating the patient' }, { status: 500 });
  }
};
