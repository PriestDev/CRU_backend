const jwt = require('jsonwebtoken');
const http = require('http');
const secret = 'your_jwt_secret_key_here_change_in_production';

function request(path, method, token, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Length': data ? Buffer.byteLength(data) : 0,
      },
    }, (res) => {
      let output = '';
      res.on('data', (chunk) => { output += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: output }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  const riderToken = jwt.sign({ id: 17, email: 'testrider@campusride.test', role: 'driver' }, secret, { expiresIn: '1h' });
  const passengerToken = jwt.sign({ id: 12, email: 'test@uniport.edu.ng', role: 'student' }, secret, { expiresIn: '1h' });
  const requestResult = await request('/api/v1/bookings/12/status', 'PATCH', riderToken, { status: 'completion_requested' });
  console.log('REQUEST', requestResult.status, requestResult.body);
  const approveResult = await request('/api/v1/bookings/12/complete-approval', 'PATCH', passengerToken, { userId: 12, approved: true });
  console.log('APPROVE', approveResult.status, approveResult.body);
})();
