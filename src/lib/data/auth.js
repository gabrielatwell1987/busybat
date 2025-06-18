import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Use environment variables in production, fallback to defaults for development
const SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Replace with env variable in production
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'BusiestBat702!';

// Initialize admin credentials - this will be called when needed
let adminPasswordHash = null;

async function getAdminPasswordHash() {
	if (!adminPasswordHash) {
		adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
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

	if (username === ADMIN_USERNAME && (await bcrypt.compare(password, adminHash))) {
		return jwt.sign({ username }, SECRET, { expiresIn: '1h' });
	}
	return null;
}
