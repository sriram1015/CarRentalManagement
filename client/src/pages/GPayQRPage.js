import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function GPayQRPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const totalAmount = location.state?.totalAmount || 0;
  const carName = location.state?.carName || '';  // Retrieve the car name
  const carId = location.state?.carId || '';
  const bookedTimeSlots = location.state?.bookedTimeSlots || [];

  const [paymentScreenshot, setPaymentScreenshot] = useState(null);  // To store uploaded screenshot
  const [isSubmitting, setIsSubmitting] = useState(false);  // Handle submit button state

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!paymentScreenshot) {
      alert('Please upload a payment screenshot');
      return;
    }

    setIsSubmitting(true);  // Disable the button during submission

    const formData = new FormData();
    formData.append('carId', carId);
    formData.append('totalAmount', totalAmount);
    formData.append('bookedTimeSlots', JSON.stringify(bookedTimeSlots));  // Ensure it’s in proper format
    formData.append('paymentScreenshot', paymentScreenshot);

    try {
      const response = await axios.post('/api/bookings/bookcar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Booking successful!');
      console.log('Booking response:', response.data);
      navigate('/'); // Navigate to home page after success
    } catch (error) {
      console.error('Error processing the booking:', error);
      alert('There was an error processing the payment.');
    } finally {
      setIsSubmitting(false);  // Re-enable the submit button
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Total Amount: ₹{totalAmount}</h2>
      <p>Car: <b>{carName}</b></p>
      <p>Scan the QR code below to complete the payment with Google Pay:</p>
      <div style={{ margin: '20px' }}>
        <img src='/gpay.jpg' alt="Google Pay QR Code" style={{ width: '500px', height: '500px' }} />
      </div>

      <h3>Upload Payment Screenshot</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {paymentScreenshot && (
        <div>
          <h4>Payment Screenshot:</h4>
          <img
            src={URL.createObjectURL(paymentScreenshot)}
            alt="Payment Screenshot"
            style={{ width: '300px', height: '300px', marginTop: '20px' }}
          />
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSubmit} className="btn1" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Payment'}
        </button>
      </div>
    </div>
  );
}

export default GPayQRPage;
