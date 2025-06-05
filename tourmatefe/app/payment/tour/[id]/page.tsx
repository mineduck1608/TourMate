'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchScheduleByInvoiceId } from '@/app/api/schedule.api'; // bạn đảm bảo api này đúng
import { TourSchedule } from '@/types/tour-schedule';

const TourPaymentPage = () => {
  const params = useParams();
  const invoiceId = params?.id ?? ''; // lấy invoiceId từ router

  const [schedule, setSchedule] = useState<TourSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    async function loadSchedule() {
      if (!invoiceId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await fetchScheduleByInvoiceId(Number(invoiceId));
        setSchedule(data);
        setLoading(false);   // <- thêm dòng này
      } catch (e) {
        setError('Không tìm thấy lịch hẹn hoặc có lỗi xảy ra');
        console.error('Error fetching schedule:', e);
        setLoading(false);
      }
    }
    loadSchedule();
  }, [invoiceId]);

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    if (!schedule) {
      alert('Không có dữ liệu lịch hẹn');
      return;
    }

    setPaying(true);

    const paymentUrl = `/api/payment/${selectedMethod.toLowerCase()}?invoiceId=${invoiceId}`;
    window.location.href = paymentUrl;
  };

  if (loading) return <p>Đang tải thông tin lịch hẹn...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!schedule) return <p>Không tìm thấy lịch hẹn</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row gap-8">
      {/* Thông tin lịch hẹn bên trái */}
      <div className="flex-1">
        <h1 className="text-2xl font-semibold mb-4">Thanh toán lịch hẹn #{invoiceId}</h1>
        <div className="mb-6 space-y-2">
          <p><strong>Khách hàng:</strong> {schedule.customerName}</p>
          <p><strong>Tour:</strong> {schedule.tourName}</p>
          <p><strong>Ngày:</strong> {new Date(schedule.startDate).toLocaleDateString('vi-VN')}</p>
          <p><strong>Ghi chú:</strong> {schedule.note || <span className="text-gray-400">Không có</span>}</p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Chọn phương thức thanh toán:</h2>
          <div className="flex flex-col gap-3">
            {['VNPAY', 'MOMO', 'Bank'].map(method => (
              <label key={method} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={selectedMethod === method}
                  onChange={() => setSelectedMethod(method)}
                  disabled={paying}
                />
                <span>{method === 'Bank' ? 'Tài khoản ngân hàng' : method}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={paying}
          className={`px-5 py-2 rounded-lg text-white ${paying ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition`}
        >
          {paying ? 'Đang xử lý...' : 'Thanh toán'}
        </button>
      </div>

      {/* Số tiền bên phải */}
      <div className="w-full md:w-80 flex-shrink-0 flex flex-col items-center justify-center bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="text-lg text-gray-500 mb-2">Số tiền cần thanh toán</div>
        <div className="text-3xl font-bold text-blue-700 mb-4">
          {schedule.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </div>
      </div>
    </div>
  );
};

export default TourPaymentPage;
