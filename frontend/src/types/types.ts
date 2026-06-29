export type User = {
    statusCode?:number,
    _id: string,
    name: string,
    surname : string,
    role: 'TEAMLEAD' | 'GOD' | 'DEVELOPER'
    password:string,
    email : string,
    phone : number,
    projects : Project[],
    tasks:Task[],
    settings : Settings,
    createdAt:Date,
    updatedAt:Date
}

export type Project = {
    _id:string,
    name : string,
    state : 'on_hold' | 'active' | 'completetd',
    tasksCount : number,
    completedCount : number,
    favoritedBy:string[],
    teamLeadId: string,
    createdAt:Date,
    updatedAt:Date
}

export type Settings = {
    appearance : 'dark' | 'light' | 'system',
    avatar : string
}

export type Task = {
    _id:string
    title : string,
    priority : 'low' | 'medium' | 'high' | 'urgent',
    projectId: string,
    userId : string,
    status : 'todo' | 'in_process' | 'review' | 'done',
    subtasks : {title:string,done:boolean}[],
    createdAt:Date,
    updatedAt:Date
}

