const fetch = globalThis.fetch || require('node-fetch');
const loginUrl = 'http://localhost:3000/api/auth/callback/credentials';
const sessionUrl = 'http://localhost:3000/api/auth/session';
async function main() {
  const form = new URLSearchParams();
  form.append('csrfToken', '');
  form.append('email', 'admin@bookswap.local');
  form.append('password', 'Admin123!');
  form.append('callbackUrl', 'http://localhost:3000/dashboard');
  form.append('json', 'true');

  const res = await fetch(loginUrl, {
    method: 'POST',
    body: form,
    redirect: 'manual',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  console.log('login status', res.status, res.statusText);
  console.log('location', res.headers.get('location'));
  const cookies = res.headers.raw()['set-cookie'];
  console.log('cookie count', cookies?.length);
  console.log('cookie sample', cookies?.slice(0, 5));

  if (cookies) {
    const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
    const sess = await fetch(sessionUrl, {
      method: 'GET',
      headers: { cookie: cookieHeader },
    });
    console.log('session status', sess.status);
    console.log('session body', await sess.text());
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
