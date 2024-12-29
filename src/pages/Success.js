import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { QRCodeCanvas } from 'qrcode.react';
import './Success.css';

const Success = () => {
  const [user, loading, error] = useAuthState(auth);
  const [orderDetails, setOrderDetails] = useState(null);
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get('session_id'); // URLからsession_idを取得

  useEffect(() => {
    if (sessionId) {
      fetch(`http://localhost:4000/getOrderDetails?sessionId=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          console.log("Order details fetched:", data);  // サーバーからのデータを確認
          setOrderDetails(data);
        })
        .catch(err => console.error(err));
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

  if (!orderDetails) {
    return <p>Loading order details...</p>;
  }

  // 購入データを整形
  const purchaseData = {
    email: user.email,
    purchaseDate: new Date().toLocaleString(),
    orderId: orderDetails.sessionId, // 注文IDを注文詳細から取得
    sessionId: orderDetails.sessionId, // sessionIdを追加
    items: orderDetails.items,
    totalAmount: orderDetails.totalAmount,
  };

  const qrData = sessionId; // QRコードに埋め込むデータ

//   const handleBackButtonClick = () => {
//     navigate('/order'); // 'order' ページに戻る
//   };

  return (
    <div className="success-container">
      <h1>ご購入ありがとうございます</h1>
      <h3 class="caution">※食券の代わりとして利用しますのでスクリーンショットなどで保存してください</h3>
      <p><strong>購入者email:</strong> {user.email}</p>
      <p><strong>購入日時:</strong> {purchaseData.purchaseDate}</p>

      <h2>注文内容</h2>
      <ul>
        {orderDetails.items.map((item, index) => (
          <li key={index}>
            <p><strong>{item.title}</strong></p> {/* 商品名: title に変更 */}
            <p>数量: {item.quantity}</p>
            <p>金額: ¥{item.price}</p>
          </li>
        ))}
      </ul>

      <h3>合計金額: ¥{orderDetails.totalAmount}</h3>

      {/* <h2>購入内容のQRコード</h2> */}
      <QRCodeCanvas value={qrData} size={256} />

      {/* <p>QRコードをスキャンして、購入情報を確認できます。</p> */}
    </div>
  );
}

export default Success;
