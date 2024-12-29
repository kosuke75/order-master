import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductData } from '../productsStore';  // productsStore からデータをインポート
import './Detail.css';

const Detail = () => {
  const { slug } = useParams();  // URL パラメータから slug を取得
  const [detail, setDetail] = useState(null);  // 初期値は null に設定

  useEffect(() => {
    const productData = getProductData(slug);  // slug に基づいて商品のデータを取得
    if (productData) {
      setDetail(productData);  // 商品が見つかった場合、詳細情報をセット
    } else {
      setDetail(null);  
    }
  }, [slug]);

  if (!detail) {
    return (
      <div className="detail-container">
        <h2>商品が見つかりませんでした。</h2>
        <p>指定された商品は存在しないか、削除された可能性があります。</p>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <h2 className="detail-title">料理について</h2>
      <div className="product-detail">
        <div className="product-image">
          <img src={detail.image} alt={detail.title} />
        </div>
        <div className="product-info">
          <h1 className="product-name">{detail.title}</h1>
          <p className="product-price">￥{detail.price}</p>
          
          {/* 商品の説明を表示 */}
          <p className="product-description">{detail.description}</p>

          {/* 他に必要な情報やカートに追加するボタンなどを追加 */}
        </div>
      </div>
    </div>
  );
};

export default Detail;
