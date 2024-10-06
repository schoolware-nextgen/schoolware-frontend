export default {
    expo: {
        name: "schoolwareFrontend",
        slug: "schoolwareFrontend",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/schoolware.png",
        scheme: "myapp",
        userInterfaceStyle: "dark",
    
        splash: {
          image: "./assets/images/splash.png",
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        },
        ios: {
          supportsTablet: true
        },
        android: {
          adaptiveIcon: {
            foregroundImage: "./assets/images/schoolware.png",
            backgroundColor: "#ffffff"
          },
          package: "com.mb.schoolwareFrontend",
          googleServicesFile: "google-services.json",
        },
        web: {
          bundler: "metro",
          output: "static",
          favicon: "./assets/images/schoolware.png"
        },
        plugins: [
          "expo-router"
        ],
        experiments: {
          typedRoutes: true
        },
        extra: {
          eas: {
            projectId: "443bfd29-d1ae-4341-bcd1-b8332137f17e"
          }
        }
    }
  };
  