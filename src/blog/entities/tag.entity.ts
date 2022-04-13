import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm"
import { ArticleEntity } from "./article.entity";

@Entity('tags')
export class TagEntity {

    @PrimaryGeneratedColumn({name: 'tag_id'})
    id: number;

    @Column({type: 'text'})
    name: string;

    @ManyToOne(type => ArticleEntity)
    articles : ArticleEntity[]

}