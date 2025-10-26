import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// tiny 1x1 png base64 (same used in tests) without data: prefix
const tinyPngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

function ensureDir(dir: string) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

function writeImage(dir: string, filename: string, base64: string) {
  ensureDir(dir);
  const out = path.join(dir, filename);
  fs.writeFileSync(out, Buffer.from(base64, 'base64'));
  return out.replace(/\\/g, '/');
}

async function main() {
  console.log('Seeding database...');

  // create uploads and sample images
  const brandsDir = path.resolve('./uploads/brands');
  const productsDir = path.resolve('./uploads/products');

  const brandLogo1 = writeImage(
    brandsDir,
    `brand-1-${Date.now()}.png`,
    tinyPngBase64,
  );
  const brandLogo2 = writeImage(
    brandsDir,
    `brand-2-${Date.now()}.png`,
    tinyPngBase64,
  );

  const productImg1 = writeImage(
    productsDir,
    `prod-1-${Date.now()}.png`,
    tinyPngBase64,
  );
  const productImg2 = writeImage(
    productsDir,
    `prod-2-${Date.now()}.png`,
    tinyPngBase64,
  );
  const productImg3 = writeImage(
    productsDir,
    `prod-3-${Date.now()}.png`,
    tinyPngBase64,
  );

  // Users (hash passwords)
  const hashedAdmin = await bcrypt.hash('Administrador1pass', 10);
  const hashedUser = await bcrypt.hash('User1pass', 10);
  const hashedAuditor = await bcrypt.hash('Auditor1pass', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'administrador1@example.com' },
    update: {},
    create: {
      email: 'administrador1@example.com',
      password: hashedAdmin,
      firstName: 'Administrador',
      lastName: 'Uno',
      role: 'ADMIN',
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: hashedUser,
      firstName: 'User',
      lastName: 'Uno',
      role: 'USER',
    },
  });

  const auditor = await prisma.user.upsert({
    where: { email: 'auditor1@example.com' },
    update: {},
    create: {
      email: 'auditor1@example.com',
      password: hashedAuditor,
      firstName: 'Auditor',
      lastName: 'Uno',
      role: 'AUDITOR',
    },
  });

  // Brands
  // Brands - electronics/compute focused
  const brandNames = [
    {
      name: 'LogiTech',
      logo: brandLogo1,
      description: 'Periféricos y accesorios',
    },
    { name: 'Asus', logo: brandLogo2, description: 'Portátiles y componentes' },
    { name: 'Dell', logo: brandLogo1, description: 'Equipos y servidores' },
    {
      name: 'Kingston',
      logo: brandLogo2,
      description: 'Memorias y almacenamiento',
    },
    { name: 'Netgear', logo: brandLogo1, description: 'Networking y routers' },
  ];

  const brands: any[] = [];
  for (const b of brandNames) {
    const item = await prisma.brand.upsert({
      where: { name: b.name },
      update: {},
      create: { name: b.name, logo: b.logo, description: b.description },
    });
    brands.push(item);
  }

  // Categories for electronics store
  const categoryNames = [
    { name: 'Laptops', description: 'Portátiles y ultrabooks' },
    { name: 'Components', description: 'Placas, CPUs, GPUs, etc.' },
    { name: 'Peripherals', description: 'Teclados, ratones, monitores' },
    { name: 'Storage', description: 'Discos SSD/HDD, memorias' },
    { name: 'Networking', description: 'Routers, switches' },
    { name: 'Accessories', description: 'Cables, fundas, adaptadores' },
  ];

  const categories: any[] = [];
  for (const c of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: { name: c.name, description: c.description },
    });
    categories.push(cat);
  }

  // Providers - wholesalers / distributors
  const provs = [
    {
      code: 'D-TECH',
      name: 'Distribuciones Tech',
      email: 'disttech@example.com',
    },
    {
      code: 'COMP-SUP',
      name: 'Componentes S.A.',
      email: 'compsup@example.com',
    },
    { code: 'NET-SUP', name: 'Net Supplies', email: 'netsup@example.com' },
  ];
  const providers: any[] = [];
  for (const p of provs) {
    const pr = await prisma.provider.upsert({
      where: { email: p.email },
      update: {},
      create: { code: p.code, name: p.name, email: p.email },
    });
    providers.push(pr);
  }

  // Customers (B2C sample)
  const customersData = [
    {
      firstName: 'Carlos',
      lastName: 'Gonzalez',
      email: 'client1@example.com',
      dni: 'DNI123',
    },
    {
      firstName: 'María',
      lastName: 'Pérez',
      email: 'client2@example.com',
      dni: 'DNI124',
    },
    {
      firstName: 'Luis',
      lastName: 'Fernández',
      email: 'client3@example.com',
      dni: 'DNI125',
    },
  ];
  const customers: any[] = [];
  for (const c of customersData) {
    const cu = await prisma.customer.upsert({
      where: { email: c.email },
      update: {},
      create: c,
    });
    customers.push(cu);
  }

  // Products - create a realistic catalog for an electronics store
  const productsSeed = [
    {
      name: 'ASUS ZenBook 14',
      price: 999.0,
      stock: 20,
      brand: 'Asus',
      provider: providers[0].id,
      categories: ['Laptops'],
    },
    {
      name: 'Dell Inspiron 15',
      price: 749.0,
      stock: 30,
      brand: 'Dell',
      provider: providers[0].id,
      categories: ['Laptops'],
    },
    {
      name: 'LogiTech MX Master 3',
      price: 99.99,
      stock: 150,
      brand: 'LogiTech',
      provider: providers[1].id,
      categories: ['Peripherals'],
    },
    {
      name: 'Kingston A400 480GB SSD',
      price: 45.5,
      stock: 120,
      brand: 'Kingston',
      provider: providers[1].id,
      categories: ['Storage'],
    },
    {
      name: 'Netgear Nighthawk Router',
      price: 179.0,
      stock: 50,
      brand: 'Netgear',
      provider: providers[2].id,
      categories: ['Networking'],
    },
    {
      name: 'Gaming GPU RTX 4060',
      price: 329.0,
      stock: 15,
      brand: 'Asus',
      provider: providers[1].id,
      categories: ['Components'],
    },
    {
      name: '16GB DDR4 3200MHz',
      price: 59.0,
      stock: 200,
      brand: 'Kingston',
      provider: providers[1].id,
      categories: ['Components', 'Storage'],
    },
    {
      name: '27" 144Hz Gaming Monitor',
      price: 259.0,
      stock: 40,
      brand: 'Dell',
      provider: providers[0].id,
      categories: ['Peripherals'],
    },
    {
      name: 'USB-C 3.1 Adapter',
      price: 14.99,
      stock: 300,
      brand: 'LogiTech',
      provider: providers[2].id,
      categories: ['Accessories'],
    },
    {
      name: 'External HDD 2TB',
      price: 79.0,
      stock: 80,
      brand: 'Kingston',
      provider: providers[1].id,
      categories: ['Storage'],
    },
    {
      name: 'Wireless Keyboard Combo',
      price: 49.0,
      stock: 120,
      brand: 'LogiTech',
      provider: providers[2].id,
      categories: ['Peripherals', 'Accessories'],
    },
    {
      name: 'Office Router Basic',
      price: 59.0,
      stock: 90,
      brand: 'Netgear',
      provider: providers[2].id,
      categories: ['Networking'],
    },
  ];

  const createdProducts: any[] = [];
  for (let i = 0; i < productsSeed.length; i++) {
    const p = productsSeed[i];
    const imgPath = writeImage(
      productsDir,
      `prod-${i + 10}-${Date.now()}.png`,
      tinyPngBase64,
    );
    // find brand id
    const brandObj = brands.find((b) => b.name === p.brand);
    const exists = await prisma.product.findFirst({ where: { name: p.name } });
    if (!exists) {
      const connectCats = p.categories.map((cn: string) => ({
        id: categories.find((c) => c.name === cn)!.id,
      }));
      const prod = await prisma.product.create({
        data: {
          name: p.name,
          price: p.price,
          stock: p.stock,
          imageURL: imgPath,
          brandId: brandObj ? brandObj.id : null,
          providerId: p.provider,
          categories: { connect: connectCats },
        },
      });
      createdProducts.push(prod);
    } else {
      createdProducts.push(exists);
    }
  }

  // Create a couple of invoices to show sales history
  if (createdProducts.length >= 3) {
    const invoice1Items = [
      {
        productId: createdProducts[0].id,
        quantity: 1,
        unitPrice: createdProducts[0].price,
      },
      {
        productId: createdProducts[2].id,
        quantity: 2,
        unitPrice: createdProducts[2].price,
      },
    ];
    const total1 = invoice1Items.reduce(
      (s, it) => s + it.unitPrice * it.quantity,
      0,
    );
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${Date.now()}-001`,
        userId: admin.id,
        customerId: customers[0].id,
        total: total1,
        items: {
          create: invoice1Items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            subtotal: it.unitPrice * it.quantity,
          })),
        },
      },
    });

    const invoice2Items = [
      {
        productId: createdProducts[4].id,
        quantity: 1,
        unitPrice: createdProducts[4].price,
      },
      {
        productId: createdProducts[6].id,
        quantity: 4,
        unitPrice: createdProducts[6].price,
      },
    ];
    const total2 = invoice2Items.reduce(
      (s, it) => s + it.unitPrice * it.quantity,
      0,
    );
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${Date.now()}-002`,
        userId: normalUser.id,
        customerId: customers[1].id,
        total: total2,
        items: {
          create: invoice2Items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            subtotal: it.unitPrice * it.quantity,
          })),
        },
      },
    });
  }

  console.log('Seed completed:');
  console.log({
    admin: admin.email,
    user: normalUser.email,
    auditor: auditor.email,
    brands: brands.map((b) => b.name),
    categories: categories.map((c) => c.name),
    products: createdProducts.map((p) => p.name),
    customers: customers.map((c) => c.email),
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
