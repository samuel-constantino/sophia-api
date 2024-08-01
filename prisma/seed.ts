import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient()

async function main() {
    const adminPhone = process.env.ADMIN_PHONE;
    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL;

    if(!adminPhone || !adminName || !adminEmail) {
        throw new Error("variável(s) de ambiente incorreta(s)");
    }

    await prisma.user.upsert({
        where: { phone: adminPhone },
        update: {},
        create: {
            email: adminEmail,
            name: adminName,
            phone: adminPhone,
            role: "ADMIN",
        },
    })

    console.log(`administrador ${adminName} cadastrado com sucesso`);
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })