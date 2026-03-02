import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Backend Working ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});