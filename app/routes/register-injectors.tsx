import { json } from '@remix-run/node';
import { prisma } from '~/utils/db.server';

export const action = async ({ request }: { request: Request }) => {
  try {
    const data = await request.json();

    const {
      email,
      phone,
      name,
      birthDate,
      gender,
      address,
      occupation,
      approve = false,
      disableSchedule = false,
      image = null,
      otherQualification = null,
      resume = null,
      role,
      AHPRARegistration = null,
      medicalDegree = null,
      password, // This should come from the request payload for creating a User
    } = data;

    // Validate required fields
    if (!email || !name || !birthDate || !gender || !address || !occupation || !role || !password) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Start a transaction to create both Injector and User records atomically
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password, // You might want to hash the password before saving
        role: "injector", // Use the same role as the injector's role
      },
    });

    const newInjector = await prisma.injector.create({
      data: {
        email,
        phone,
        name,
        birthDate: new Date(birthDate),
        gender,
        address,
        occupation,
        approve,
        disableSchedule,
        image,
        otherQualification,
        resume,
        role,
        AHPRARegistration,
        medicalDegree,
        userId: newUser.id, // Link the Injector to the User
      },
    });

    return json({ message: "👍 Injector and User created successfully" });
  } catch (error) {
    console.error('Error creating injector and user:', error);
    return json({ error: 'An error occurred while creating the injector and user' }, { status: 500 });
  }
};
