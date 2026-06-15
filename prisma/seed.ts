import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hookTypes = [
  { name: "Good = Bad", description: "Membalik ekspektasi antara hal baik dan buruk" },
  { name: "Crazy Math", description: "Angka/statistik yang mengejutkan dan tidak terduga" },
  { name: "Broken Label", description: "Melanggar label atau kategori yang sudah ada" },
  { name: "Silent Killer", description: "Ancaman tersembunyi yang tidak disadari" },
  { name: "Time Shock", description: "Kejutan berbasis waktu yang mengubah perspektif" },
  { name: "Dark Horse", description: "Pemenang tak terduga dari situasi yang tidak mungkin" },
  { name: "Future Shock", description: "Prediksi masa depan yang mengejutkan" },
  { name: "Hidden Pattern", description: "Pola tersembunyi yang jarang disadari orang" },
  { name: "Reverse Logic", description: "Logika terbalik yang bertentangan dengan intuisi" },
  { name: "Confession", description: "Pengakuan jujur yang mengejutkan atau kontroversial" },
  { name: "Prediction", description: "Prediksi spesifik yang berani dan terukur" },
  { name: "Comparison", description: "Perbandingan mengejutkan antara dua hal" },
  { name: "Identity Clash", description: "Konflik identitas yang relatable bagi audiens" },
  { name: "Unexpected Truth", description: "Kebenaran yang bertentangan dengan kepercayaan umum" },
  { name: "Contrarian", description: "Pendapat yang berlawanan dengan mainstream" },
];

const emotions = ["Gain", "Pain", "Curiosity"];

async function main() {
  console.log("Seeding hook types...");
  for (const ht of hookTypes) {
    await prisma.hookType.upsert({
      where: { name: ht.name },
      update: {},
      create: ht,
    });
  }

  console.log("Seeding emotions...");
  for (const e of emotions) {
    await prisma.hookEmotion.upsert({
      where: { name: e },
      update: {},
      create: { name: e },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());