export type User = {
    statusCode?:number,
    _id: string,
    name: string,
    avatar:string,
    surname : string,
    role: 'TEAMLEAD' | 'GOD' | 'DEVELOPER'
    password:string,
    email : string,
    phone : number,
    projects : Project[],
    notifications : Notification[]
    tasks:Task[],
    settings : Settings,
    createdAt:string,
    updatedAt:string
}

export type Notification = {
    _id:string,
    text : string,
    isRead: boolean,
    createdAt:string,
    eventId?:string
}

export type ChartSlice = { name: string; value: number; color: string };

export type TasksByProjectDatum = {
  name: string;
  completed: number;
  total: number;
};

export type Event = {
    _id:string,
    title : string,
    project : { name : string, projectId : string },
    link? : string,
    location : string,
    date : string,
    eventType : 'meeting' | 'reminder' | 'deadline',
    participants: string[],
    teamLeadId:string
}

export type Project = {
    _id:string,
    name : string,
    state : 'on_hold' | 'active' | 'completetd',
    tasksCount : number,
    completedCount : number,
    favoritedBy:string[],
    teamLeadId: string,
    createdAt:string,
    updatedAt:string
}

export type Settings = {
    appearance : 'dark' | 'light' | 'system',
    avatar : string
}

export type Task = {
    _id?:string,
    title : string,
    priority : 'low' | 'medium' | 'high' | 'urgent',
    projectId: string,
    userIds : string[],
    status : 'todo' | 'in_process' | 'review' | 'done',
    subtasks? : {title:string,done:boolean,_id:string}[],
    createdAt?:string,
    updatedAt?:string
}

