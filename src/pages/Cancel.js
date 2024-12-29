import { useNavigate } from 'react-router-dom';

function Cancel() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/order');
    };

    return (
        <div>
            <h1>支払いをキャンセルしました</h1>
        </div>
    );
}

export default Cancel;
