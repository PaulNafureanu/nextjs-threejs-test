"use client";
import styles from "./page.module.css";
import init from "./three/script";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    init();
  }, []);
  return <></>;
}
