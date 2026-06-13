async function testAPI() {
  try {
    const res = await fetch('http://localhost:5000/api/v1/laws');
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Success: ${data.success}`);
    console.log(`Data length: ${data.data ? data.data.length : 'undefined'}`);
    if (data.data && data.data.length > 0) {
      console.log('First item:', data.data[0]);
    }
  } catch (err) {
    console.error('API Error:', err.message);
  }
}

testAPI();
