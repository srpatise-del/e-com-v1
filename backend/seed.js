import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Cart from "./models/Cart.js";
import Order from "./models/Order.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

dotenv.config();

const products = [
  {
    name: "Sony Alpha A7 IV",
    brand: "Sony",
    category: "Mirrorless",
    price: 89900,
    stock: 12,
    description: "กล้องฟูลเฟรมไฮบริดยอดนิยมสำหรับสายภาพนิ่งและวิดีโอ 4K คุณภาพสูง",
    specifications: { sensor: "33MP", video: "4K 60fps", lensMount: "Sony E" },
    images: ["/products/mirrorless-alpha.svg", "/products/mirrorless-alpha.svg"]
  },
  {
    name: "Sony Alpha A6700",
    brand: "Sony",
    category: "Mirrorless",
    price: 56900,
    stock: 14,
    description: "กล้อง APS-C สำหรับสายถ่ายภาพและครีเอเตอร์วิดีโอ พร้อม AI autofocus และ 4K คมชัด",
    specifications: { sensor: "26MP", video: "4K 120fps", lensMount: "Sony E" },
    images: ["/products/mirrorless-alpha.svg", "/products/mirrorless-alpha.svg"]
  },
  {
    name: "Sony ZV-E1",
    brand: "Sony",
    category: "Cinema",
    price: 76900,
    stock: 7,
    description: "กล้องฟูลเฟรมเพื่อครีเอเตอร์วิดีโอโดยเฉพาะ พร้อม AI framing และระบบเสียงทันสมัย",
    specifications: { sensor: "12MP", video: "4K 120fps", lensMount: "Sony E" },
    images: ["/products/cinema-rig.svg", "/products/cinema-rig.svg"]
  },
  {
    name: "Sony FX30",
    brand: "Sony",
    category: "Cinema",
    price: 82900,
    stock: 6,
    description: "Cinema Line ขนาดกะทัดรัดสำหรับงานวิดีโอจริงจัง สีสวย เกรดได้ดี และรองรับโปรดักชันครบ",
    specifications: { sensor: "26MP", video: "4K 120fps", lensMount: "Sony E" },
    images: ["/products/cinema-rig.svg", "/products/cinema-rig.svg"]
  },
  {
    name: "Canon EOS R6 Mark II",
    brand: "Canon",
    category: "Mirrorless",
    price: 82900,
    stock: 10,
    description: "กล้องฟูลเฟรมโฟกัสไว เหมาะสำหรับคอนเทนต์กีฬา อีเวนต์ และวิดีโอคมชัด",
    specifications: { sensor: "24.2MP", video: "4K 60fps", lensMount: "Canon RF" },
    images: ["/products/mirrorless-canon.svg", "/products/mirrorless-canon.svg"]
  },
  {
    name: "Canon EOS R8",
    brand: "Canon",
    category: "Mirrorless",
    price: 56900,
    stock: 13,
    description: "ฟูลเฟรมขนาดเบาเหมาะกับผู้เริ่มต้นสายภาพและวิดีโอ ให้สีสวยและใช้งานง่าย",
    specifications: { sensor: "24.2MP", video: "4K 60fps", lensMount: "Canon RF" },
    images: ["/products/mirrorless-canon.svg", "/products/mirrorless-canon.svg"]
  },
  {
    name: "Canon EOS 90D",
    brand: "Canon",
    category: "DSLR",
    price: 42900,
    stock: 9,
    description: "DSLR ตัวคุ้มสำหรับผู้ที่ต้องการแบตอึดและจับถือถนัดมือ ใช้งานได้หลากหลาย",
    specifications: { sensor: "32.5MP", video: "4K", lensMount: "Canon EF" },
    images: ["/products/dslr-classic.svg", "/products/dslr-classic.svg"]
  },
  {
    name: "Fujifilm X-T5",
    brand: "Fujifilm",
    category: "Mirrorless",
    price: 64900,
    stock: 8,
    description: "กล้อง APS-C ดีไซน์คลาสสิก สีสันสวย ฟีลฟิล์ม เหมาะกับสายท่องเที่ยวและคอนเทนต์",
    specifications: { sensor: "40MP", video: "6.2K", lensMount: "FUJIFILM X" },
    images: ["/products/mirrorless-retro.svg", "/products/mirrorless-retro.svg"]
  },
  {
    name: "Fujifilm X-S20",
    brand: "Fujifilm",
    category: "Mirrorless",
    price: 49900,
    stock: 12,
    description: "กล้องสาย hybrid สำหรับผู้เริ่มต้นถึงระดับกลาง น้ำหนักเบา สีสวย และแบตเตอรี่ใช้งานได้นาน",
    specifications: { sensor: "26.1MP", video: "6.2K", lensMount: "FUJIFILM X" },
    images: ["/products/mirrorless-retro.svg", "/products/mirrorless-retro.svg"]
  },
  {
    name: "Nikon Z8",
    brand: "Nikon",
    category: "Mirrorless",
    price: 139000,
    stock: 5,
    description: "เรือธงสำหรับงานภาพนิ่งและวิดีโอระดับโปร เซนเซอร์ความละเอียดสูงและระบบโฟกัสแม่นยำ",
    specifications: { sensor: "45.7MP", video: "8K 60fps", lensMount: "Nikon Z" },
    images: ["/products/mirrorless-retro.svg", "/products/mirrorless-retro.svg"]
  },
  {
    name: "Nikon Zf",
    brand: "Nikon",
    category: "Mirrorless",
    price: 72900,
    stock: 7,
    description: "กล้องฟูลเฟรมสไตล์เรโทร เน้นภาพนิ่งสวย โทนสีดี และการควบคุมแบบคลาสสิก",
    specifications: { sensor: "24.5MP", video: "4K 60fps", lensMount: "Nikon Z" },
    images: ["/products/mirrorless-retro.svg", "/products/mirrorless-retro.svg"]
  },
  {
    name: "Nikon D7500",
    brand: "Nikon",
    category: "DSLR",
    price: 36900,
    stock: 10,
    description: "DSLR สำหรับผู้ที่ต้องการการจับถือมั่นคง โฟกัสไว และภาพนิ่งคุณภาพดีในงบคุ้มค่า",
    specifications: { sensor: "20.9MP", video: "4K UHD", lensMount: "Nikon F" },
    images: ["/products/dslr-classic.svg", "/products/dslr-classic.svg"]
  },
  {
    name: "Panasonic Lumix S5 IIX",
    brand: "Panasonic",
    category: "Cinema",
    price: 79900,
    stock: 6,
    description: "ตัวจบงานวิดีโอด้วยระบบกันสั่นดีเยี่ยมและฟีเจอร์สตรีมมิงในบอดีเดียว",
    specifications: { sensor: "24.2MP", video: "6K", lensMount: "L-Mount" },
    images: ["/products/cinema-rig.svg", "/products/cinema-rig.svg"]
  },
  {
    name: "Panasonic Lumix GH6",
    brand: "Panasonic",
    category: "Cinema",
    price: 58900,
    stock: 9,
    description: "สายวิดีโอ Micro Four Thirds ที่เด่นเรื่อง codec และ frame rate สำหรับงานคอนเทนต์จริงจัง",
    specifications: { sensor: "25.2MP", video: "5.7K 60fps", lensMount: "Micro Four Thirds" },
    images: ["/products/cinema-rig.svg", "/products/cinema-rig.svg"]
  },
  {
    name: "Sony RX100 VII",
    brand: "Sony",
    category: "Compact",
    price: 38900,
    stock: 11,
    description: "กล้องคอมแพคระดับพรีเมียมสำหรับสายเที่ยวและ Vlog พกง่ายแต่ฟีเจอร์ครบ",
    specifications: { sensor: "20.1MP", video: "4K", lensMount: "Fixed Lens" },
    images: ["/products/compact-vlog.svg", "/products/compact-vlog.svg"]
  },
  {
    name: "Canon PowerShot V10",
    brand: "Canon",
    category: "Compact",
    price: 14900,
    stock: 18,
    description: "กล้องคอมแพคสำหรับ Vlog ใช้งานง่าย มีขาตั้งในตัว เหมาะกับสายคอนเทนต์เริ่มต้น",
    specifications: { sensor: "20.9MP", video: "4K 30fps", lensMount: "Fixed Lens" },
    images: ["/products/compact-vlog.svg", "/products/compact-vlog.svg"]
  }
];

const seed = async () => {
  try {
    await connectDB();
    await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany(), Cart.deleteMany()]);

    // ผู้ใช้ตัวอย่างสำหรับทดสอบทั้งบทบาท admin และ user
    const hashedPassword = await bcrypt.hash("123456", 10);

    const [adminUser, normalUser] = await User.create([
      {
        name: "ผู้ดูแลระบบ",
        email: "admin@camerahubth.com",
        password: hashedPassword,
        role: "admin",
        address: "กรุงเทพมหานคร",
        phone: "0800000000"
      },
      {
        name: "ลูกค้าทดลอง",
        email: "user@camerahubth.com",
        password: hashedPassword,
        role: "user",
        address: "เชียงใหม่",
        phone: "0900000000"
      }
    ]);

    const createdProducts = await Product.insertMany(products);

    await Order.create({
      userId: normalUser._id,
      items: [
        { productId: createdProducts[0]._id, quantity: 1 },
        { productId: createdProducts[2]._id, quantity: 1 }
      ],
      totalPrice: createdProducts[0].price + createdProducts[2].price,
      status: "processing",
      shippingAddress: {
        name: "ลูกค้าทดลอง",
        phone: "0900000000",
        address: "เชียงใหม่"
      },
      paymentMethod: "โอนเงินผ่านธนาคาร"
    });

    console.log("Seed data inserted successfully");
    console.log("Admin login: admin@camerahubth.com / 123456");
    console.log("User login: user@camerahubth.com / 123456");
    console.log(`Admin user created: ${adminUser.email}`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
