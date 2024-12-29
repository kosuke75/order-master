import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { CartContext } from '../CartContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';  // Link をインポート

function ProductCard(props) {
    const product = props.product;
    const cart = useContext(CartContext);
    const productQuantity = cart.getProductQuantity(product.id);
    
    return (
        <Card>
            <Card.Body>
                {/* 画像をクリックすると詳細ページに遷移 */}
                {product.image ? (
                    <Link to={`/detail/${product.slug}`}>
                        <Card.Img variant="top" src={product.image} alt={product.title} />
                    </Link>
                ) : (
                    <div>画像がありません</div> 
                )}
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>￥{product.price}</Card.Text>
                
                {productQuantity > 0 ? (
                    <>
                        <Form as={Row}>
                            <Form.Label column="true" sm="6">個数 {productQuantity}</Form.Label>
                            <Col sm="6">
                                <Button sm="6" onClick={() => cart.addOneToCart(product.id)} className="mx-2">+</Button>
                                <Button sm="6" onClick={() => cart.removeOneFromCart(product.id)} className="mx-2">-</Button>
                            </Col>
                        </Form>
                        <Button variant="danger" onClick={() => cart.deleteFromCart(product.id)} className="my-2">削除</Button>
                    </>
                ) : (
                    <Button variant="primary" onClick={() => cart.addOneToCart(product.id)}>カートに追加</Button>
                )}
            </Card.Body>
        </Card>
    );
}

export default ProductCard;
