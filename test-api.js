// Test API route accessibility
// You can use this in browser console or create a simple test

const testApiRoute = async () => {
  try {
    // Test if the order exists first
    const orderResponse = await fetch('/api/orders/cmco9pvb000k504jvqtnx');
    console.log('Order API status:', orderResponse.status);
    
    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      console.log('Order data:', orderData);
    } else {
      console.log('Order API error:', await orderResponse.text());
    }

    // Test payment-proof route (without file)
    const formData = new FormData();
    formData.append('paymentNotes', 'test');
    
    const uploadResponse = await fetch('/api/orders/cmco9pvb000k504jvqtnx/payment-proof', {
      method: 'POST',
      body: formData
    });
    
    console.log('Upload API status:', uploadResponse.status);
    console.log('Upload API response:', await uploadResponse.text());
    
  } catch (error) {
    console.error('Test error:', error);
  }
};

// Run this in browser console:
// testApiRoute();
