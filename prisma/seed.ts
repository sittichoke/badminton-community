import { PrismaClient } from "@prisma/client";
import { addDays, setHours, setMinutes } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  await prisma.eventParticipant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.groupFollow.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: { name: "โค้ชแนน", email: "alice@example.com" },
  });
  const bob = await prisma.user.create({
    data: { name: "ต้อม", email: "bob@example.com" },
  });
  const charlie = await prisma.user.create({
    data: { name: "มด", email: "charlie@example.com" },
  });

  const groupA = await prisma.group.create({
    data: {
      name: "Bangkok Smashers",
      description: "กลุ่มตีแบดหลังเลิกงาน เน้นสนุกและได้เหงื่อ",
      coverImageUrl:
        "https://images.unsplash.com/photo-1501601968270-6ce5f337fd5c?auto=format&fit=crop&w=800&q=80",
      createdById: alice.id,
      members: {
        create: [
          { userId: alice.id, role: "ADMIN" },
          { userId: bob.id, role: "MEMBER" },
        ],
      },
    },
  });

  const groupB = await prisma.group.create({
    data: {
      name: "Sukhumvit Power Play",
      description: "ซ้อมจริงจังสำหรับคนอยากอัปเกรดเกม",
      coverImageUrl:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
      createdById: bob.id,
      members: {
        create: [
          { userId: bob.id, role: "ADMIN" },
          { userId: alice.id, role: "MEMBER" },
        ],
      },
    },
  });

  const upcomingDate = addDays(new Date(), 2);
  const createEventData = [
    {
      title: "คู่ซ้อมวันพุธ",
      groupId: groupA.id,
      createdById: alice.id,
      startAt: setMinutes(setHours(upcomingDate, 18), 30),
      endAt: setMinutes(setHours(upcomingDate, 20), 30),
      locationText: "สนาม XYZ บางนา",
      mapUrl: "https://maps.google.com",
      courtCost: 1200,
      shuttleCost: 400,
      otherCost: 0,
      pricePerPerson: 160,
      maxParticipants: 10,
      allowOverbook: false,
      skillLevels: JSON.stringify(["INTERMEDIATE", "ADVANCED"]),
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
      ]),
    },
    {
      title: "ตีเช้าเสาร์",
      groupId: groupA.id,
      createdById: alice.id,
      startAt: setMinutes(setHours(addDays(new Date(), 4), 8), 0),
      endAt: setMinutes(setHours(addDays(new Date(), 4), 10), 0),
      locationText: "สนามสุขสวัสดิ์ อุดมสุข",
      courtCost: 1000,
      shuttleCost: 300,
      otherCost: 200,
      pricePerPerson: 150,
      maxParticipants: 10,
      allowOverbook: true,
      skillLevels: JSON.stringify(["BEGINNER", "INTERMEDIATE"]),
      imageUrls: JSON.stringify([]),
    },
    {
      title: "เกมดุๆ วันอาทิตย์",
      groupId: groupB.id,
      createdById: bob.id,
      startAt: setMinutes(setHours(addDays(new Date(), 6), 17), 0),
      endAt: setMinutes(setHours(addDays(new Date(), 6), 19), 0),
      locationText: "สนามราชดำริ คอร์ท 5",
      courtCost: 1500,
      shuttleCost: 500,
      otherCost: 0,
      pricePerPerson: 250,
      maxParticipants: 8,
      allowOverbook: false,
      skillLevels: JSON.stringify(["ADVANCED", "COMPETITIVE"]),
      imageUrls: JSON.stringify([]),
    },
    {
      title: "มินิลีกจบงาน",
      groupId: groupB.id,
      createdById: bob.id,
      startAt: setMinutes(setHours(addDays(new Date(), -2), 19), 0),
      endAt: setMinutes(setHours(addDays(new Date(), -2), 21), 0),
      locationText: "สนามสำโรง",
      courtCost: 1800,
      shuttleCost: 600,
      otherCost: 300,
      pricePerPerson: 275,
      maxParticipants: 12,
      allowOverbook: false,
      skillLevels: JSON.stringify(["ADVANCED"]),
      imageUrls: JSON.stringify([]),
    },
    {
      title: "รับน้องใหม่",
      groupId: groupA.id,
      createdById: alice.id,
      startAt: setMinutes(setHours(addDays(new Date(), 1), 19), 0),
      endAt: setMinutes(setHours(addDays(new Date(), 1), 21), 0),
      locationText: "สนามลาดกระบัง",
      courtCost: 800,
      shuttleCost: 200,
      otherCost: 0,
      pricePerPerson: 100,
      maxParticipants: 12,
      allowOverbook: true,
      skillLevels: JSON.stringify(["BEGINNER", "INTERMEDIATE"]),
      imageUrls: JSON.stringify([]),
    },
    {
      title: "ซ้อมแข่งขัน",
      groupId: groupB.id,
      createdById: bob.id,
      startAt: setMinutes(setHours(addDays(new Date(), -5), 18), 0),
      endAt: setMinutes(setHours(addDays(new Date(), -5), 20), 0),
      locationText: "สนามปิ่นเกล้า",
      courtCost: 1300,
      shuttleCost: 400,
      otherCost: 150,
      pricePerPerson: 185,
      maxParticipants: 10,
      allowOverbook: false,
      skillLevels: JSON.stringify(["INTERMEDIATE", "ADVANCED"]),
      imageUrls: JSON.stringify([]),
    },
  ];

  const createdEvents = [];
  for (const data of createEventData) {
    createdEvents.push(
      await prisma.event.create({
        data,
      }),
    );
  }

  await prisma.groupFollow.createMany({
    data: [
      { userId: alice.id, groupId: groupB.id },
      { userId: bob.id, groupId: groupA.id },
    ],
  });

  await prisma.eventParticipant.createMany({
    data: [
      {
        eventId: createdEvents[0].id,
        userId: alice.id,
        status: "JOINED",
      },
      {
        eventId: createdEvents[0].id,
        userId: bob.id,
        status: "JOINED",
      },
      {
        eventId: createdEvents[2].id,
        userId: charlie.id,
        status: "JOINED",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
