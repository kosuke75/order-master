import imageProduct1 from './assets/images/sample.png'; 
import imageProduct2 from './assets/images/sample.png'; 
import imageProduct3 from './assets/images/sample.png'; 

const productsArray = [
    {
        id: "price_1QaVo8Lpw1vqZrCRTtPS0T25",
        title: "唐揚げ丼",
        price: 270,
        image: imageProduct1,
        slug: '唐揚げ丼',
        description: '説明文'
    },
    {
        id: "price_1Qah8GLpw1vqZrCR1YGgHZD5",
        title: "ラーメン",
        price: 300,
        image: imageProduct2,
        slug: 'ラーメン',
        description: '説明文'
    },
    {
        id: "price_1Qah8XLpw1vqZrCRVD6Iuf3V",
        title: "日替わり定食",
        price: 300,
        image: imageProduct3,
        slug: '日替わり定食',
        description: '説明文'
    }
];

// id または slug を使って商品を取得する関数
function getProductData(identifier) {
    let productData;

    // identifier が id か slug かを確認して検索
    if (identifier.startsWith('price_')) {
        // id が渡された場合
        productData = productsArray.find(product => product.id === identifier);
    } else {
        // slug が渡された場合
        productData = productsArray.find(product => product.slug === identifier);
    }

    if (productData === undefined) {
        console.log("Product data does not exist for identifier: " + identifier);
        return undefined;
    }

    return productData;
}

export { productsArray, getProductData };
