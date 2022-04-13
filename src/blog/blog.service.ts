import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleDto } from 'src/dtos/article.dto';
import { CommentDto } from 'src/dtos/comment.dto';
import { Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';
import { CommentEntity } from './entities/comment.entity';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articlesRepository : Repository<ArticleEntity>,
        @InjectRepository(CommentEntity)
        private readonly commentsRepository : Repository<CommentEntity>,
        @InjectRepository(TagEntity)
        private readonly tagsRepository : Repository<TagEntity>
    ){}

    getArticles(limit:number, offset:number){
        return this.articlesRepository.find(
            {
            skip:offset,
            take: limit,
            relations : ['comments']
    });
    }

    async getOneArticle(articleId : number){
        const article =  await this.articlesRepository.findOne(articleId)
        if(article)
            return article;
        return null;

    }

    async createArticle(articleDto: ArticleDto){
        const article = await this.articlesRepository.save(articleDto)
        return article;
    }

    async updateArticle(articleId : number,articleDto : ArticleDto){
        const article = await this.articlesRepository.findOne(articleId);
        if(!article)
            return null;
        await this.articlesRepository.update(articleId, articleDto)
        return article
    }

    async removeArticle(articleId : number){
        const article = await this.articlesRepository.findOne(articleId);
        if(!article)
            return null;
        this.articlesRepository.remove(article)
        return article;
    }

    async addComment(articleId : number, commentDto : CommentDto){
        const article = await this.articlesRepository.findOne(articleId, {relations : ['comments']});
        if(!article)
            return null;
        const comment = new CommentEntity();
        comment.message = commentDto.message;
        comment.article = article;
        return this.commentsRepository.save(comment);
    }

    async addTag(name :string){
        let tag = new TagEntity();
        tag.name = name
        tag = await this.tagsRepository.save(tag)
        if(tag)
            return tag
        return null;
    }

    async tagArticle(articleId, tagId){
        const article = await this.articlesRepository.findOne(articleId, {relations : ['tags']});
        if(!article)
            return null;
        const tag = await this.tagsRepository.findOne(tagId);
        if(!tag)
            return null;
        article.tags.push(tag)
        this.articlesRepository.save(article)
        return this.articlesRepository.findOne(articleId, {relations : ['tags', 'comments']});

        
    }
}
