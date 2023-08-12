"use client";
import styles from "./page.module.css";
import InitThreeJS from "./three/script";
import { useEffect } from "react";

export default function Home() {
  useEffect(InitThreeJS, []);
  return <></>;
}
