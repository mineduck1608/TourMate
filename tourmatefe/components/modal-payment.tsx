import React, { useState, useEffect } from "react";
import { usePayOS } from "@payos/payos-checkout";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.href,
    ELEMENT_ID: "embedded-payment-container",
    CHECKOUT_URL: "",
    embedded: true,
    onSuccess: () => {
      setMessage("Thanh toán thành công!");
      handleClose();
    },
  });

  const { open, exit } = usePayOS(payOSConfig);

  const handleGetPaymentLink = async () => {
    setIsCreatingLink(true);
    exit();

    try {
      const response = await fetch("http://localhost:3030/create-embedded-payment-link", {
        method: "POST",
      });

      if (!response.ok) {
        setMessage("Lỗi khi tạo link thanh toán");
        setIsCreatingLink(false);
        return;
      }

      const result = await response.json();
      setPayOSConfig((old) => ({
        ...old,
        CHECKOUT_URL: result.checkoutUrl,
      }));

      setIsCreatingLink(false);
    } catch {
      setMessage("Lỗi kết nối thanh toán");
      setIsCreatingLink(false);
    }
  };

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL) {
      open();
    }
  }, [payOSConfig.CHECKOUT_URL]);

  const handleClose = () => {
    exit();
    setMessage("");
    setPayOSConfig((old) => ({ ...old, CHECKOUT_URL: "" }));
    onClose();
  };

  if (!isOpen) return null;

  if (message) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-md p-6 max-w-sm w-full text-center">
          <p className="font-semibold mb-4">{message}</p>
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Thanh toán</h3>
        <div className="mb-4">
          <p>
            <strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly
          </p>
          <p>
            <strong>Giá tiền:</strong> 2000 VNĐ
          </p>
          <p>
            <strong>Số lượng:</strong> 1
          </p>
        </div>
        <div className="mb-4">
          {isCreatingLink ? (
            <div className="text-center font-semibold">Đang tạo link...</div>
          ) : (
            <button
              onClick={handleGetPaymentLink}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Tạo Link thanh toán Embedded
            </button>
          )}
        </div>

        <div
          id="embedded-payment-container"
          className="h-[350px] border rounded mb-4"
        ></div>

        <button
          onClick={handleClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
