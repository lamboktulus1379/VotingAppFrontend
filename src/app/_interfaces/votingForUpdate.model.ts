import { Category } from "./category.model";

export interface votingForUpdate {
    Id: string,
    Name: string,
    Description?: string,
    DateCreated: Date,
    VotersCount: number,
    DueDate: Date,
    CategoryId: string
}