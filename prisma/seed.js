const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
 
const prisma = new PrismaClient();
 
async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
  
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
 
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
    },
  });

  // Default About content
  const about = await prisma.about.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      title: 'About Me',
      description: 'I am a dedicated creative professional with over 8 years of experience in visual storytelling. \n\nWhether it\'s the precise color grading in DaVinci Resolve, intricate 3D modeling in Blender, or high-end photo retouching in Photoshop, I bring a meticulous eye for detail to every project.',
      expertise: [
        "Photography", "Video Editing", "DaVinci Resolve", 
        "Adobe Photoshop", "Blender 3D", "After Effects",
        "Color Grading", "Visual Effects", "Digital Composition"
      ]
    },
  });

  console.log({ admin, about });
}
 
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });