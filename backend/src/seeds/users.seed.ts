import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { logSeed } from './seed.utils';

export const DEMO_USER_EMAIL = 'demo@example.local';
export const DEMO_USER_NAME = 'Demo User';
export const DEMO_USER_RAW_PASSWORD = 'Demo123!Pass'; // Development credential only

/**
 * Creates or updates the dedicated demo user in MongoDB.
 * Password is strictly hashed using bcrypt.
 */
export async function seedDemoUser(): Promise<IUser> {
  const normalizedEmail = DEMO_USER_EMAIL.toLowerCase();
  let user = await User.findOne({ email: normalizedEmail });

  const hashedPassword = await bcrypt.hash(DEMO_USER_RAW_PASSWORD, 10);

  if (!user) {
    user = new User({
      email: normalizedEmail,
      name: DEMO_USER_NAME,
      provider: 'email',
      passwordHash: hashedPassword,
    });
    await user.save();
    logSeed(`✅ Demo user created: ${user.email} (ID: ${user._id})`);
  } else {
    user.name = DEMO_USER_NAME;
    user.provider = 'email';
    user.passwordHash = hashedPassword;
    await user.save();
    logSeed(`✅ Demo user existing & synced: ${user.email} (ID: ${user._id})`);
  }

  return user;
}
