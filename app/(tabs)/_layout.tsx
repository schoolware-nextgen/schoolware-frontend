import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Entypo } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';



// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}



export default function TabLayout() {




  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.tint,

        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
      initialRouteName="agenda"
      >
      
      <Tabs.Screen
        name="points"
        options={{
          title: 'punten',
          tabBarIcon: ({ color }) => <Entypo name="bar-graph" size={24} color={color} />,
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable>
                {({ pressed }) => (
                  <View>
                  <FontAwesome
                    name="gear"
                    size={25}
                    color={Colors.dark.text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
  
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'agenda',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable>
                {({ pressed }) => (
                  <View>
                  <FontAwesome
                    name="gear"
                    size={25}
                    color={Colors.dark.text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'taken',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-ul" color={color} />,
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable>
                {({ pressed }) => (
                  <View>
                  <FontAwesome
                    name="gear"
                    size={25}
                    color={Colors.dark.text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    
    <Tabs.Screen
        name="berichten"
        options={{
          title: 'berichten',
          tabBarIcon: ({ color }) => <TabBarIcon name="envelope" color={color} />,
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable>
                {({ pressed }) => (
                  <View>
                  <FontAwesome
                    name="gear"
                    size={25}
                    color={Colors.dark.text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

    </Tabs>
    
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "rgb(25, 25, 25)",
    color: "black"
  }

})