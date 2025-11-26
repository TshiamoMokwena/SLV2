import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function HomeRoot() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#5470FD',
                tabBarInactiveTintColor: "black",
                tabBarShowLabel: true,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 25,
                    left: 0,
                    right: 0,
                    elevation: 5,
                    backgroundColor: 'white',
                    borderRadius: 50,
                    height: 70,
                    borderTopColor: "transparent",
                    shadowColor: '#7F5DF0',
                    shadowOpacity: 0.25,
                    shadowOffset: { width: 0, height: 15 },
                    shadowRadius: 3.5,
                    marginHorizontal: 20,
                    paddingTop: 10,
                    paddingBottom: 10,
                }
            }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
