export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/40">
      <div className="container-app grid gap-8 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-white">CameraHub TH</h3>
          <p className="mt-3 text-sm text-slate-400">
            ศูนย์รวมกล้องดิจิทัล เลนส์ และอุปกรณ์สำหรับครีเอเตอร์สายภาพนิ่งและวิดีโอ
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white">บริการ</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>จัดส่งทั่วไทย</li>
            <li>ผ่อนชำระและโอนเงิน</li>
            <li>ทีมแนะนำกล้องตามการใช้งาน</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">ติดต่อเรา</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Line: @camerahubth</li>
            <li>โทร: 02-888-2468</li>
            <li>อีเมล: support@camerahubth.com</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
