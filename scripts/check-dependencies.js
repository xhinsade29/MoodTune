const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const checkDependencies = () => {
  console.log("\nChecking project dependencies...\n");

  // Check environment variables
  const requiredEnvVars = [
    "VITE_SPOTIFY_CLIENT_ID",
    "VITE_SPOTIFY_CLIENT_SECRET",
    "VITE_OPENAI_API_KEY",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    console.error("❌ Missing environment variables:");
    missingEnvVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error("\nPlease add these variables to your .env file");
  } else {
    console.log("✅ Environment variables: All present");
  }

  // Check package.json dependencies
  const packagePath = path.join(process.cwd(), "package.json");
  const packageLockPath = path.join(process.cwd(), "package-lock.json");
  const nodeModulesPath = path.join(process.cwd(), "node_modules");

  try {
    const package = require(packagePath);
    const allDeps = {
      ...package.dependencies,
      ...package.devDependencies,
    };

    // Check if node_modules exists
    if (!fs.existsSync(nodeModulesPath)) {
      console.error("❌ node_modules directory is missing. Run npm install");
      process.exit(1);
    }

    // Check if package-lock.json exists
    if (!fs.existsSync(packageLockPath)) {
      console.warn("⚠️ package-lock.json is missing. Run npm install");
    }

    // Check essential dependencies
    const essentialDeps = [
      "react",
      "react-dom",
      "axios",
      "typescript",
      "vite",
      "@vitejs/plugin-react",
    ];

    const missingDeps = essentialDeps.filter((dep) => !allDeps[dep]);

    if (missingDeps.length > 0) {
      console.error("❌ Missing essential dependencies:");
      missingDeps.forEach((dep) => {
        console.error(`   - ${dep}`);
      });
      console.error("\nRun: npm install " + missingDeps.join(" "));
      process.exit(1);
    }

    console.log("✅ Dependencies: All essential packages present");
  } catch (error) {
    console.error("❌ Error checking dependencies:", error.message);
    process.exit(1);
  }

  console.log("\nDependency check completed.\n");
};

checkDependencies();
