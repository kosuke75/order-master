const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51QShcjLpw1vqZrCR8TkQOP3d8fFukAHgr0DrJPXitxsULZtBbSj2JomfXaIUFDUrsMEoHjz83bMPjVam0V1SPonO00Mk91ErR9');

const app = express();
app.use(cors());
app.use(express.json());

// 商品データ（実際にはデータベースなどで管理することをお勧めします）
const productsArray = [
    {
        id: "price_1QaVo8Lpw1vqZrCRTtPS0T25",
        title: "唐揚げ丼",
        price: 270
    },
    {
        id: "price_1Qah8GLpw1vqZrCR1YGgHZD5",
        title: "ラーメン",
        price: 300
    },
    {
        id: "price_1Qah8XLpw1vqZrCRVD6Iuf3V",
        title: "日替わり定食",
        price: 300
    }
];

// セッション情報を保存するための仮のストレージ
const orderSessions = {};

app.post("/checkout", async (req, res) => {
    console.log("Checkout request:", req.body);
    const items = req.body.items;
    const email = req.body.email;

    // 商品IDに基づいて商品情報を取得
    const lineItems = items.map(item => {
        const product = productsArray.find(product => product.id === item.id);  // 商品を探す
        if (product) {
            return {
                price: item.id, 
                quantity: item.quantity,
            };
        } else {
            console.error(`Product with ID ${item.id} not found`);
            return null;  // 商品が見つからなかった場合
        }
    }).filter(item => item !== null);  // nullを除外

    // 合計金額を計算
    const totalAmount = items.reduce((total, item) => {
        const product = productsArray.find(p => p.id === item.id); // 商品情報を取得
        if (product) {
            return total + (product.price * item.quantity);  // 価格と数量を掛けて合計
        }
        return total;
    }, 0);

    console.log("Calculated totalAmount:", totalAmount);  // 合計金額をログに出力

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:3000/cancel",
            metadata: { email, items: JSON.stringify(items) },
        });

        orderSessions[session.id] = {
            email,
            items: items.map(item => {
                const product = productsArray.find(product => product.id === item.id); // 商品IDに対応する商品を探す
                return {
                    ...item,
                    title: product ? product.title : '商品名不明',  // 商品が見つからない場合はデフォルト名
                    price: product ? product.price : 0,  // 商品が見つからない場合は価格を0に設定
                };
            }),
            totalAmount: totalAmount,
            purchaseDate: new Date().toISOString(),
        };
        
        console.log("Order saved in sessions:", orderSessions[session.id]);

        res.send(JSON.stringify({ url: session.url }));
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
});

app.get('/getOrderDetails', (req, res) => {
    const sessionId = req.query.sessionId;
    console.log("Session ID received:", sessionId);
    if (orderSessions[sessionId]) {
        console.log("Order details found:", orderSessions[sessionId]);
        res.json(orderSessions[sessionId]);
    } else {
        console.log("Order not found for sessionId:", sessionId);
        res.status(404).send({ error: 'Order not found' });
    }
});

app.listen(4000, () => console.log("Listening on port 4000!"));
