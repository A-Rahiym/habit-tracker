export type User = {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
}

export type Session = {
    userId: string;
    email: string;
}

