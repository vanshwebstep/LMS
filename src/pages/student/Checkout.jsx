import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    alert('Payment Successful! Course added to your dashboard.');
    navigate('/student/dashboard');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
      
      {/* Payment Form */}
      <div style={{ flex: '1 1 400px', background: '#fff', padding: '30px', border: '1px solid #eee', borderRadius: '8px' }}>
        <h2>Secure Checkout</h2>
        <form onSubmit={handlePayment} style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name on Card</label>
            <input type="text" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Card Number</label>
            <input type="text" required placeholder="XXXX XXXX XXXX XXXX" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Expiry</label>
              <input type="text" placeholder="MM/YY" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>CVC</label>
              <input type="text" placeholder="123" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>
          <button type="submit" style={{ width: '100%', background: '#28a745', color: '#fff', border: 'none', padding: '15px', fontSize: '16px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
            Pay $99.00
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div style={{ flex: '1 1 250px', background: '#f9f9f9', padding: '30px', border: '1px solid #eee', borderRadius: '8px', height: 'fit-content' }}>
        <h3>Order Summary</h3>
        <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #ddd' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span>Fullstack Bootcamp</span>
          <strong>$99.00</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666' }}>
          <span>Tax</span>
          <span>$0.00</span>
        </div>
        <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #ddd' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
          <span>Total</span>
          <span>$99.00</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
