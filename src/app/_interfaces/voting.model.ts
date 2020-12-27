import { Category } from "./category.model";

export interface Voting {
    Id: string,
    Name: string,
    Description?: string,
    DateCreated: Date,
    VotersCount: number,
    DueDate: Date,
    Categories: Category
}