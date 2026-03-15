import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export let socket = io("http://10.0.2.2:4000", {
  autoConnect: false,
});

export const connectSocket = async () => {
  const customUrl = await AsyncStorage.getItem("hazina.backendUrl");
  if (customUrl) {
    const newUri = customUrl.replace("/api", "");
    if ((socket.io as any).uri !== newUri) {
      socket.disconnect();
      socket = io(newUri, { autoConnect: false });
    }
  }
  socket.connect();
};

export const joinChamaRoom = (chamaId: string) => {
  socket.emit("join:chama", chamaId);
};
