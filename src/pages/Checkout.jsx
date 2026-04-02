import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, total, clearCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const shippingFee = 0;
  const discountAmount = 0;
  const taxAmount = Math.round(total * 0.07);
  const grandTotal = total + shippingFee + taxAmount - discountAmount;
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    paymentMethod: "โอนเงินผ่านธนาคาร",
    paidAt: "",
    paymentNote: "",
    slipUrl: ""
  });
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isCod = form.paymentMethod === "เก็บเงินปลายทาง";
  const isBankTransfer = form.paymentMethod === "โอนเงินผ่านธนาคาร";
  const needsPaymentDetails = !isCod;

  const itemPayload = useMemo(
    () =>
      cartItems.map((item) => ({
        productId: item.productId?._id || item.productId,
        quantity: item.quantity
      })),
    [cartItems]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let uploadedSlipUrl = form.slipUrl;

      if (needsPaymentDetails && slipFile) {
        const uploadForm = new FormData();
        uploadForm.append("slip", slipFile);
        const { data: uploadData } = await api.post("/orders/upload-slip", uploadForm, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        uploadedSlipUrl = uploadData.slipUrl;
      }

      await api.post("/orders", {
        items: itemPayload,
        subtotalPrice: total,
        shippingFee,
        discountAmount,
        taxAmount,
        totalPrice: grandTotal,
        paymentMethod: form.paymentMethod,
        paymentDetails: {
          transactionId: "",
          bankName: "",
          accountName: "",
          accountNumber: "",
          paidAt: form.paidAt || null,
          paymentNote: form.paymentNote,
          slipUrl: uploadedSlipUrl
        },
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          address: form.address
        }
      });
      clearCart();
      await fetchCart();
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถสร้างคำสั่งซื้อได้");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSlipChange = (e) => {
    const file = e.target.files?.[0];
    setSlipFile(file || null);
    if (file && file.type.startsWith("image/")) {
      setSlipPreview(URL.createObjectURL(file));
      return;
    }
    setSlipPreview("");
  };

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="section-title">ชำระเงิน</h1>
        <p className="section-subtitle">กรอกข้อมูลจัดส่ง เลือกวิธีชำระเงิน และยืนยันคำสั่งซื้อของคุณ</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-card p-6">
            <h2 className="text-xl font-semibold text-white">ข้อมูลจัดส่ง</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                className="input-field"
                placeholder="ชื่อผู้รับ"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="input-field"
                placeholder="เบอร์โทรศัพท์"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <textarea
                className="input-field md:col-span-2"
                rows="4"
                placeholder="ที่อยู่จัดส่ง"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-card p-6">
            <h2 className="text-xl font-semibold text-white">วิธีการชำระเงิน</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {["โอนเงินผ่านธนาคาร", "เก็บเงินปลายทาง", "บัตรเครดิต (ตัวอย่าง)"].map((method) => (
                <label key={method} className="cursor-pointer rounded-2xl border border-white/10 p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={form.paymentMethod === method}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="mr-2 accent-brand-400"
                  />
                  <span className="text-sm text-slate-200">{method}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-brand-400/20 bg-brand-500/10 p-5 text-sm text-slate-200">
              {form.paymentMethod === "โอนเงินผ่านธนาคาร" && (
                <div className="space-y-3">
                  <p className="font-semibold text-white">รายละเอียดบัญชีสำหรับโอน</p>
                  <p>ธนาคาร: กสิกรไทย</p>
                  <p>ชื่อบัญชี: CameraHub TH Co., Ltd.</p>
                  <p>เลขบัญชี: 123-4-56789-0</p>
                  <p className="text-slate-400">หลังโอนชำระ กรุณากรอกข้อมูลอ้างอิงด้านล่างเพื่อให้ทีมงานตรวจสอบได้เร็วขึ้น</p>
                </div>
              )}
              {form.paymentMethod === "เก็บเงินปลายทาง" && (
                <div className="space-y-2">
                  <p className="font-semibold text-white">เก็บเงินปลายทาง</p>
                  <p>ชำระกับเจ้าหน้าที่ขนส่งเมื่อได้รับสินค้า</p>
                  <p className="text-slate-400">คำสั่งซื้อจะอยู่ในสถานะรอยืนยันและชำระเมื่อจัดส่งสำเร็จ</p>
                </div>
              )}
              {form.paymentMethod === "บัตรเครดิต (ตัวอย่าง)" && (
                <div className="space-y-2">
                  <p className="font-semibold text-white">ชำระด้วยบัตรเครดิต</p>
                  <p>หน้านี้เป็นตัวอย่างการเชื่อมระบบชำระเงิน สามารถต่อ Stripe/Omise/2C2P เพิ่มได้ภายหลัง</p>
                </div>
              )}
            </div>

            {needsPaymentDetails && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {isBankTransfer ? (
                  <>
                    <label className="flex cursor-pointer items-center rounded-xl border border-dashed border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 md:col-span-2">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        className="hidden"
                        onChange={handleSlipChange}
                      />
                      {slipFile ? `ไฟล์สลิป: ${slipFile.name}` : "อัปโหลดไฟล์สลิป / หลักฐานชำระเงิน"}
                    </label>
                    <input
                      className="input-field md:col-span-2"
                      type="datetime-local"
                      value={form.paidAt}
                      onChange={(e) => setForm({ ...form, paidAt: e.target.value })}
                    />
                  </>
                ) : (
                  <>
                    <input
                      className="input-field"
                      placeholder="ธนาคารที่ใช้โอน / ผู้ออกบัตร"
                      value={form.bankName}
                      onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                    />
                    <input
                      className="input-field"
                      placeholder="ชื่อผู้ชำระเงิน"
                      value={form.accountName}
                      onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                    />
                    <input
                      className="input-field"
                      placeholder="เลขอ้างอิง / เลข 4 ตัวท้าย"
                      value={form.transactionId}
                      onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                    />
                    <input
                      className="input-field"
                      placeholder="เลขบัญชีผู้โอน (ถ้ามี)"
                      value={form.accountNumber}
                      onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                    />
                    <input
                      className="input-field"
                      type="datetime-local"
                      value={form.paidAt}
                      onChange={(e) => setForm({ ...form, paidAt: e.target.value })}
                    />
                    <label className="flex cursor-pointer items-center rounded-xl border border-dashed border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        className="hidden"
                        onChange={handleSlipChange}
                      />
                      {slipFile ? `ไฟล์สลิป: ${slipFile.name}` : "อัปโหลดไฟล์สลิป / หลักฐานชำระเงิน"}
                    </label>
                  </>
                )}
                {(slipPreview || form.slipUrl) && (
                  <div className="md:col-span-2 rounded-2xl border border-white/10 p-4">
                    <p className="mb-3 text-sm text-slate-300">ตัวอย่างหลักฐานชำระเงิน</p>
                    {slipPreview ? (
                      <a href={slipPreview} target="_blank" rel="noreferrer" className="block">
                        <img src={slipPreview} alt="Slip Preview" className="max-h-64 rounded-xl object-contain" />
                      </a>
                    ) : (
                      <a
                        href={form.slipUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-200 underline"
                      >
                        เปิดดูสลิปที่อัปโหลด
                      </a>
                    )}
                  </div>
                )}
                <textarea
                  className="input-field md:col-span-2"
                  rows="3"
                  placeholder="หมายเหตุการชำระเงิน เช่น เวลาโอน / ขอใบกำกับภาษี / ชำระโดยบริษัท"
                  value={form.paymentNote}
                  onChange={(e) => setForm({ ...form, paymentNote: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel h-fit rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-white">สรุปคำสั่งซื้อ</h2>
          <div className="mt-6 space-y-4">
            {cartItems.map((item) => {
              const product = item.product || item.productId;
              return (
                <div key={product._id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-300">
                    {product.name} x {item.quantity}
                  </span>
                  <span className="text-white">฿{(product.price * item.quantity).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 border-t border-white/10 pt-6">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>ราคาสินค้า</span>
                <span>฿{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ค่าจัดส่ง</span>
                <span>{shippingFee === 0 ? "ฟรี" : `฿${shippingFee.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between">
                <span>ส่วนลด</span>
                <span>-฿{discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT 7%</span>
                <span>฿{taxAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-5 flex justify-between text-lg font-bold">
              <span>ยอดชำระสุทธิ</span>
              <span className="text-brand-200">฿{grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <button type="submit" className="btn-primary mt-6 w-full" disabled={submitting}>
            {submitting ? "กำลังสร้างคำสั่งซื้อ..." : "ยืนยันการสั่งซื้อ"}
          </button>
        </div>
      </form>
    </div>
  );
}
