/*
  Migration: Ensure all users have `subscription` field set (explicit null) so DB documents show the field.
  Run: `node ./scripts/migrate-set-subscription-null.js` from backend directory (after installing dependencies).
*/

const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const User = require('../models/User');

(async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    const res = await User.updateMany(
      { subscription: { $exists: false } },
      { $set: { subscription: null } }
    );

    console.log('Migration result:', res);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
})();
