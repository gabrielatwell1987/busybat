import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET = 'your-secret-key'; // Replace with env variable in production

// Initialize admin credentials - this will be called when needed
let adminPasswordHash = null;

async function getAdminPasswordHash() {
	if (!adminPasswordHash) {
		adminPasswordHash = await bcrypt.hash('BusiestBat702!', 10);
	}
	return adminPasswordHash;
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, SECRET);
	} catch {
		return null;
	}
}

export async function authenticate(username, password) {
	const adminHash = await getAdminPasswordHash();

	if (username === 'admin' && (await bcrypt.compare(password, adminHash))) {
		return jwt.sign({ username }, SECRET, { expiresIn: '1h' });
	}
	return null;
}
