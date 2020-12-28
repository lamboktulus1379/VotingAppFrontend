import { Category } from "./category.model";

export interface votingForUpdate {
    Name: string,
    Description?: string,
    DateCreated: Date,
    VotersCount: number,
    DueDate: Date,
    CategoryId: string
}