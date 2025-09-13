import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Tenant from './models/Tenant.js';
import User from './models/User.js';

dotenv.config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('Clearing old data...');
  await Tenant.deleteMany({});
  await User.deleteMany({});

  console.log('Seeding new data...');

  const acme = await Tenant.create({ name: 'Acme', slug: 'acme' });
  const globex = await Tenant.create({ name: 'Globex', slug: 'globex' });

  await User.create([
    { email: 'admin@acme.test', password: 'password', role: 'admin', tenantId: acme._id },
    { email: 'user@acme.test', password: 'password', role: 'member', tenantId: acme._id },
    { email: 'admin@globex.test', password: 'password', role: 'admin', tenantId: globex._id },
    { email: 'user@globex.test', password: 'password', role: 'member', tenantId: globex._id },
  ]);

  console.log('Database seeded successfully! 🌱');
  mongoose.connection.close();
};

seedData().catch(console.error);
