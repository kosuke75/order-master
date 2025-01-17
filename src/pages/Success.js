import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { QRCodeCanvas } from 'qrcode.react';
import './Success.css';

const Success = () => {
  const [user, loading, error] = useAuthState(auth);
  const [orderDetails, setOrderDetails] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get('session_id'); // URLからsession_idを取得

  useEffect(() => {
    if (sessionId) {
      fetch(`https://main.d1i2hzm1xh2h9b.amplifyapp.com/getOrderDetails?sessionId=${sessionId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log("Order details fetched:", data);
          setOrderDetails(data);
        })
        .catch(err => {
          console.error('Failed to fetch order details:', err);
          setFetchError('Failed to fetch order details. Please try again later.');
        });
    }
  }, [sessionId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!user) {
    return <p>You need to be logged in to view this page.</p>;
  }

  if (fetchError) {
    return <div>
      <p>{fetchError}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>;
  }

  if (!orderDetails) {
    return <p>Loading order details...</p>;
  }

  // 購入データを整形
  const purchaseData = {
    email: user.email,
    purchaseDate: new Date().toLocaleString(),
    orderId: orderDetails.sessionId,
    sessionId: orderDetails.sessionId,
    items: orderDetails.items,
    totalAmount: orderDetails.totalAmount,
  };

  const qrData = sessionId; // QRコードに埋め込むデータ

  return (
    <div className="success-container">
      <h1>ご購入ありがとうございます</h1>
      <h3 className="caution">※食券の代わりとして利用しますのでスクリーンショットなどで保存してください</h3>
      <p><strong>購入者email:</strong> {user.email}</p>
      <p><strong>購入日時:</strong> {purchaseData.purchaseDate}</p>

      <h2>注文内容</h2>
      <ul>
        {orderDetails.items.map((item, index) => (
          <li key={index}>
            <p><strong>{item.title}</strong></p>
            <p>数量: {item.quantity}</p>
            <p>金額: ¥{item.price}</p>
          </li>
        ))}
      </ul>

      <h3>合計金額: ¥{orderDetails.totalAmount}</h3>

      <QRCodeCanvas value={qrData} size={256} />

    </div>
  );
}

export default Success;
