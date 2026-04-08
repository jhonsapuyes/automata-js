

import { Stack } from 'expo-router';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';

export default function RootLayout() {

  useEffect(() => {
    async function checkUpdate() {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync(); // 🔄 reinicia con la nueva versión
        }
      } catch (error) {
        console.log("Error buscando update:", error);
      }
    }

    checkUpdate();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}