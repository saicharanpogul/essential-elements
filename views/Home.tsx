import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Connected from "../components/Connected";
import Disconnected from "../components/Disconnected";
import MainLayout from "../components/MainLayout";

const Home = () => {
  const { connected } = useWallet();
  return (
    <MainLayout>{connected ? <Connected /> : <Disconnected />}</MainLayout>
  );
};

export default Home;
