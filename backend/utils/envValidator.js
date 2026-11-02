const envValidator = () => {
  const requiredEnvs = [
    "MONGODB_URI",
    "JWT_SECRET",
    "PORT"
  ];

  const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

  if (missingEnvs.length > 0) {
    console.error(
      "❌ FATAL ERROR: Missing required environment variables: " +
        missingEnvs.join(", ")
    );
    process.exit(1);
  }
};

module.exports = envValidator;
