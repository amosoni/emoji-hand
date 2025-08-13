import fetch from 'node-fetch';

async function testRegister() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.TEST_EMAIL || 'test@example.com',
        password: process.env.TEST_PASSWORD || 'test123456',
        username: process.env.TEST_USERNAME || 'testuser',
        lang: 'en'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testRegister(); 