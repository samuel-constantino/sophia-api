// services/postman.ts

import { sendMessage } from "../helpers";
import dotenv from "dotenv";

dotenv.config();
const letterPhone = process.env.LETTER_PHONE;
const letterMessage = process.env.LETTER_MESSAGE;

export const sendLetter = async () => {
    if(!letterPhone || letterPhone === "") {
        throw new Error("telefone da carta inválida");
    }

    if(!letterMessage || letterMessage === "") {
        throw new Error("mensagem da carta inválida");
    }

    const res = await sendMessage(letterPhone, letterMessage);
    
    return { success: true, data: res.data};
  };