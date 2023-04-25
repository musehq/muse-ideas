import { GroupProps } from "@react-three/fiber";
import React from "react";
import LoginForm from "./ideas/LoginForm";

export default function SpotifyDoor() {
  return (
    <LoginForm
      logo="https://i.scdn.co/image/ab67757000003b8255c25988a6ac314394d3fbf5"
      content="log in with spotify"
      visible={true}
    />
  );
}
