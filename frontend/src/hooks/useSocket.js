import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const useSocket = () => useContext(ChatContext);

export default useSocket;
