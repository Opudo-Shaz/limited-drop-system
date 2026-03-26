import "dotenv/config";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import { expireReservations } from "./services/expiration.service";

// Run expiration every 30 seconds
setInterval(() => {
  expireReservations().catch(console.error);
}, 30 * 1000);