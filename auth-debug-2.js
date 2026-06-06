const fetch = globalThis.fetch || require('node-fetch');
const csrfUrl = 'http://localhost:3000/api/auth/csrf';
const loginUrl = 'http://localhost:3000/api/auth/callback/credentials';
const sessionUrl = 'http://localhost:3000/api/auth/session';
(async function main() {
  const csrfRes = await fetch(csrfUrl);
  const csrf = await csrfRes.json();
  const csrfCookie = csrfRes.headers.get('set-cookie');
  console.log('csrf', csrf);
  console.log('csrf cookie', csrfCookie);

  const form = new URLSearchParams();
  form.append('csrfToken', csrf.csrfToken);
  form.append('email', 'admin@bookswap.local');
  form.append('password', 'Admin123!');
  form.append('callbackUrl', 'http://localhost:3000/dashboard');
  form.append('json', 'true');

  const cookieHeader = csrfCookie ? csrfCookie.split(/,\s*(?=[^;]+=)/).map((c) => c.split(';')[0]).join('; ') : '';

  const res = await fetch(loginUrl, {
    method: 'POST',
    body: form,
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
  });

  console.log('login status', res.status, res.statusText);
  console.log('location', res.headers.get('location'));
  const setCookieHeader = res.headers.get('set-cookie');
  console.log('login set-cookie', setCookieHeader);

  if (setCookieHeader) {
    const allCookies = setCookieHeader.split(/,\s*(?=[^;]+=)/).map((c) => c.split(';')[0]).join('; ');
    const combinedCookies = [cookieHeader, allCookies].filter(Boolean).join('; ');
    const sessRes = await fetch(sessionUrl, {
      method: 'GET',
      headers: { cookie: combinedCookies },
    });
    console.log('session status', sessRes.status);
    console.log('session body', await sessRes.text());
  }
})();
