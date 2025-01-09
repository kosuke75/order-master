const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51QShcjLpw1vqZrCR8TkQOP3d8fFukAHgr0DrJPXitxsULZtBbSj2JomfXaIUFDUrsMEoHjz83bMPjVam0V1SPonO00Mk91ErR9');

const app = express();
app.use(cors());
app.use(express.json());

app.post("/checkout", async (req, res) => {
    console.log(req.body);
    const items = req.body.items;

    // フロントエンドから送信されるitem.idがPrice IDであることを確認
    const lineItems = items.map(item => ({
        price: item.id, // Price IDが正しいことを確認
        quantity: item.quantity,
    }));

    const successUrl = process.env.FRONTEND_URL + "/success";
    const cancelUrl = process.env.FRONTEND_URL + "/cancel";

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl
        });

        res.send({ url: session.url });
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
});

app.listen(4000, () => console.log("Listening on port 4000!"));
