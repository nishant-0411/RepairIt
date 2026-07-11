"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Welcome to RepairIt</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputGroup}>
              <label htmlFor="login-email" className={styles.label}>Email Address</label>
              <input type="email" id="login-email" className={styles.input} placeholder="you@example.com" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="login-password" className={styles.label}>Password</label>
              <input type="password" id="login-password" className={styles.input} placeholder="••••••••" required />
            </div>
            <button type="submit" className={styles.button}>Sign In</button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputGroup}>
              <label htmlFor="signup-name" className={styles.label}>Full Name</label>
              <input type="text" id="signup-name" className={styles.input} placeholder="John Doe" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="signup-email" className={styles.label}>Email Address</label>
              <input type="email" id="signup-email" className={styles.input} placeholder="you@example.com" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="signup-password" className={styles.label}>Password</label>
              <input type="password" id="signup-password" className={styles.input} placeholder="••••••••" required />
            </div>
            <button type="submit" className={styles.button}>Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
}
