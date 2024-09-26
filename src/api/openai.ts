import OpenAI from "openai";
import { OPENAI_API_KEY } from '../config'; 

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

// Verifica se a chave da API está definida
if (!OPENAI_API_KEY) {
    throw new Error("A chave da API OpenAI não foi encontrada. Verifique se está definida corretamente.");
}

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Atenção ao uso em produção
});

export async function sendMessage(messages: Message[]) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",  
            messages: messages.map(message => ({
                role: message.role,
                content: message.content
            }))
        });

        const responseMessage = response.choices && response.choices[0]?.message;

        return {
            role: responseMessage?.role || "assistant",
            content: responseMessage?.content || "Nenhuma resposta disponível"
        };
    } catch (error: any) {
        console.error("Erro ao enviar mensagem:", error);
        return { role: "assistant", content: `Erro ao processar a resposta: ${error.message || error}` };
    }
}
