import { Button, Navbar, Modal } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { CartContext } from "../CartContext"; // CartContextをインポート
import CartProduct from './CartProduct';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート

function NavbarComponent() {
    const cart = useContext(CartContext); // CartContextを使用してカート情報を取得
    const navigate = useNavigate(); // useNavigateを使用してナビゲーション

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const checkout = async () => {
        const response = await fetch('https://3.104.64.133/checkout', { // バックエンドURLを更新
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: cart.items, email: cart.email }) // emailも送信する
        });
        
        const data = await response.json();
        if (data.url) {
            window.location.assign(data.url); // Stripeのチェックアウトセッションにリダイレクト
        } else {
            console.error('Checkout failed:', data);
        }
    };

    const productsCount = cart.items.reduce((sum, product) => sum + product.quantity, 0);

    return (
        <>
            <Navbar expand="sm">
                <Button variant="secondary" onClick={() => navigate('/')}>
                    ホームへ戻る
                </Button>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Button onClick={handleShow}>カート ({productsCount})</Button>
                </Navbar.Collapse>
            </Navbar>
        
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>カート</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productsCount > 0 ? (
                        <>
                            {cart.items.map((currentProduct, idx) => (
                                <CartProduct key={idx} id={currentProduct.id} quantity={currentProduct.quantity} />
                            ))}
                            <h1>合計: ￥{cart.getTotalCost().toFixed(2)}</h1>
                            <Button variant="success" onClick={checkout}>
                                購入へ進む
                            </Button>
                        </>
                    ) : (
                        <h1>カートに商品がありません</h1>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default NavbarComponent;
