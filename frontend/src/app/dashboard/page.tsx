import React from "react";
import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Dashboard</h1>
        <p className={styles.subtitle}>Manage your guides and bookings</p>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Saved Guides</h2>
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <div className={styles.itemTitle}>How to fix a leaky faucet</div>
              <div className={styles.itemMeta}>Saved 2 days ago</div>
            </li>
            <li className={styles.listItem}>
              <div className={styles.itemTitle}>Replacing laptop battery</div>
              <div className={styles.itemMeta}>Saved 1 week ago</div>
            </li>
          </ul>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Active Bookings</h2>
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <div className={styles.itemTitle}>Plumber - John Smith</div>
              <div className={styles.itemMeta}>Tomorrow at 10:00 AM</div>
            </li>
          </ul>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Submitted Guides</h2>
          </div>
          <div className={styles.emptyState}>
            You haven't submitted any guides yet.
          </div>
        </section>
      </div>
    </div>
  );
}
