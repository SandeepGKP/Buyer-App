"use client"; // This file needs to be a client component to use localStorage

export const demoUserId = 'user-demo-1'; // Default demo user ID

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') {
    return false; // Server-side rendering, no localStorage
  }
  return localStorage.getItem('isLoggedIn') === 'true';
}

export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering, no localStorage
  }
  return localStorage.getItem('userId');
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
  }
}
