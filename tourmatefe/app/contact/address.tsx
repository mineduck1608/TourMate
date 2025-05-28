export default function AddressPage() {
  return (
    <div className="w-full h-screen relative">
      {/* Bản đồ full screen */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.610010397031!2d106.809883!3d10.841127599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1747625103690!5m2!1sen!2s"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bản đồ địa chỉ công ty"
        className="w-full h-full border-0"
      />

      {/* Thông tin địa chỉ chồng lên bản đồ (nằm trên bản đồ) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-lg max-w-xl text-center shadow-lg">
        <p><strong>Địa chỉ:</strong> 7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000</p>
        <p><strong>Điện thoại:</strong> (028) 7300 5588</p>
        <p><strong>Email:</strong> hcmuni.fpt.edu.vn</p>
      </div>
    </div>
  );
}
