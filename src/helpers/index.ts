import dotenv from "dotenv";

dotenv.config();

interface taskProps {
    id: number;
    title: string;
    content: string[];
    completed: boolean;
    startAt: Date | null;
    finishAt: Date | null;
    daily: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
}

export const sortTaskByStartDate = (tasks: taskProps[]) => {
    const sortedTasks = tasks.sort((a, b) => {
        if (!a.startAt) return 1;
        if (!b.startAt) return -1;

        const aDate = new Date(a.startAt);
        const bDate = new Date(b.startAt);

        if (aDate > bDate) return 1;
        if (aDate < bDate) return -1;

        return 0;
    });

    return sortedTasks;
}

export const sendMessage = async (phone: string, message: string) => {
    const baseUrl = process.env.INDIER_SKD_BASE_URL;
    if (!baseUrl || baseUrl === "") {
        throw new Error("Indier SDK base URL inválida");
    }

    const token = process.env.INDIER_AUTHORIZATION;
    if (!token || token === "") {
        throw new Error("Indier: token de autorização inválido");
    }

    const instanceId = process.env.INDIER_INSTANCE_ID;
    if (!instanceId || instanceId === "") {
        throw new Error("Indier: ID da instância inválida");
    }

    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: `{"to":"${phone}","message":"${message}"}`
    };

    const response = await fetch(`${baseUrl}?instanceId=${instanceId}`, options);

    if (!response.ok) {
        throw new Error(`Reminder response status: ${response.status}`);
    }

    const json = await response.json();
    
    return {success: true, data: json?.message};
  }