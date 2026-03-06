const baseURL = 'http://localhost:3000/api';

async function runTests() {
    let sessionCookie = '';
    let csrfToken = '';

    try {
        console.log('--- Iniciando Verificación ---');

        // 1. Obtener Token CSRF
        console.log('1. Obteniendo Token CSRF...');
        const csrfRes = await fetch(`${baseURL}/auth/csrf-token`);
        const csrfData = await csrfRes.json();
        csrfToken = csrfData.csrfToken;

        // Extraer cookie de CSRF
        const setCookie = csrfRes.headers.get('set-cookie');
        const csrfCookie = setCookie ? setCookie.split(';')[0] : '';

        console.log('CSRF Token obtenido:', csrfToken);

        const commonHeaders = {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
            'Cookie': csrfCookie
        };

        // 2. Registro de Usuario
        const email = `test_${Date.now()}@example.com`;
        const password = 'Password123!';
        console.log(`2. Registrando usuario: ${email}...`);
        const regRes = await fetch(`${baseURL}/auth/register`, {
            method: 'POST',
            headers: commonHeaders,
            body: JSON.stringify({ email, password })
        });
        const regData = await regRes.json();
        console.log('Registro exitoso:', regData.id ? 'SÍ' : 'NO', regData);

        // 3. Login con JWT
        console.log('3. Login con JWT (sessionType: jwt)...');
        const loginJwtRes = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: commonHeaders,
            body: JSON.stringify({ email, password, sessionType: 'jwt' })
        });
        const loginJwtData = await loginJwtRes.json();
        const jwtToken = loginJwtData.token;
        console.log('Login JWT exitoso:', jwtToken ? 'SÍ (Token recibido)' : 'NO');

        // 4. Acceso a /profile con JWT
        console.log('4. Verificando acceso a /profile con cabecera Authorization...');
        const profileJwtRes = await fetch(`${baseURL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${jwtToken}` }
        });
        const profileJwtData = await profileJwtRes.json();
        console.log('Acceso a /profile (JWT):', profileJwtData.user && profileJwtData.user.email === email ? 'OK' : 'FALLÓ');

        // 5. Login con Cookie
        console.log('5. Login con Cookie (sessionType: cookie)...');
        const loginCookieRes = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: commonHeaders,
            body: JSON.stringify({ email, password, sessionType: 'cookie' })
        });
        const loginCookieData = await loginCookieRes.json();
        const setCookieHeader = loginCookieRes.headers.get('set-cookie');
        sessionCookie = setCookieHeader ? setCookieHeader.split(';')[0] : '';
        console.log('Login Cookie exitoso. Cookie de sesión recibida:', sessionCookie ? 'SÍ' : 'NO');

        // 6. Acceso a /profile con Cookie
        console.log('6. Verificando acceso a /profile con Cookie...');
        const profileCookieRes = await fetch(`${baseURL}/auth/profile`, {
            headers: { 'Cookie': `${csrfCookie}; ${sessionCookie}` }
        });
        const profileCookieData = await profileCookieRes.json();
        console.log('Acceso a /profile (Cookie):', profileCookieData.user && profileCookieData.user.email === email ? 'OK' : 'FALLÓ');

        // 7. Verificando RBAC (Acceso denegado a Admin para usuario regular)
        console.log('7. Verificando RBAC (Usuario regular intentando acceder a /admin/users)...');
        const adminRes = await fetch(`${baseURL}/admin/users`, {
            headers: { 'Cookie': `${csrfCookie}; ${sessionCookie}` }
        });
        console.log('Acceso a /admin/users denegado (403):', adminRes.status === 403 ? 'SÍ' : 'NO', `Status: ${adminRes.status}`);

        // 8. Logout
        console.log('8. Verificando Logout...');
        const logoutRes = await fetch(`${baseURL}/auth/logout`, {
            method: 'POST',
            headers: { 'Cookie': sessionCookie }
        });
        const logoutSetCookie = logoutRes.headers.get('set-cookie');
        console.log('Logout exitoso. Cookie de sesión eliminada:', logoutSetCookie && logoutSetCookie.includes('Expires=Thu, 01 Jan 1970') ? 'SÍ' : 'NO');

        console.log('--- Verificación Finalizada ---');
    } catch (error) {
        console.error('Error en la verificación:', error.message);
    }
}

runTests();
