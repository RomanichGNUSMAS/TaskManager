export type User = {
    id: string,
    name: string,
    surname : string,
    email : string,
    phone : number,
    projects : Project[],
    tasks:Task[],
}

export type Project = {
    title : string,
    state : 'on_hold' | 'active' | 'completetd',
    tasksCount : number,
    completedCount : number,
    favoritedBy:string[],
    teamLeadId: string
}

export type Task = {
    title : string,
    priority : 'low' | 'medium' | 'high' | 'urgent',
    projectId: string,
    userId : string,
    status : 'todo' | 'in_process' | 'review' | 'done',
    subtasks : {title:string,done:boolean}[]
}

