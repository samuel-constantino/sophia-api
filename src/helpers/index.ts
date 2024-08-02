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
    const sortedTasks = tasks.sort((a,b) => {
        if(!a.startAt) return 1;
        if(!b.startAt) return -1;
    
        const aDate = new Date(a.startAt);
        const bDate = new Date(b.startAt);
    
        if(aDate > bDate) return 1;
        if(aDate < bDate) return -1;
        
        return 0;
      });

      return sortedTasks;
}