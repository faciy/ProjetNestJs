import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ArticleDto } from 'src/dtos/article.dto';
import { CommentDto } from 'src/dtos/comment.dto';
import { BlogService } from './blog.service';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger'

@Controller('blog')
export class BlogController {
    constructor(
        private readonly blogService: BlogService
    ){}

    @ApiQuery({name:'limit'})
    @ApiQuery({name:'offset'})
    @Get()
    getAll(@Query('limit') limit=10 , @Query('offset') offset=0 ){
        return this.blogService.getArticles(limit, offset);
    }

    // @ApiOperation({summary:'Afficher un article...'})
    // @ApiParam({name:'articleId'})
    @Get(':articleId')
    async getOne(@Param('articleId') articleId){
        Logger.log('Get One Artcile', 'BlogController', articleId);
        const article = await this.blogService.getOneArticle(articleId)
        if(article)
            return article;
        throw new HttpException('Article not found', HttpStatus.NOT_ACCEPTABLE);
    }

    @Post()
    async create(@Body() articleDto : ArticleDto ){
        Logger.log('Create One Artcile', 'BlogController');
        const article = await this.blogService.createArticle(articleDto)
        if(article)
            return article;
        throw new HttpException('Not created', HttpStatus.NOT_MODIFIED)
    }

    @ApiParam({name:'articleId'})
    @Put(':articleId')
    async update(@Param('articleId') articleId ,@Body() articleDto ){
        Logger.log('Update One Artcile', 'BlogController');
        const article = await this.blogService.updateArticle(articleId, articleDto)
        if(article)
            return article;
        throw new HttpException('Not modified', HttpStatus.NOT_MODIFIED)
    }

    @ApiParam({name:'articleId'})
    @Delete(':articleId')
    async remove(@Param('articleId') articleId ){
        Logger.log('Delete One Artcile', 'BlogController');
        const article = await this.blogService.removeArticle(articleId)
        if(article)
            return article;
        throw new HttpException('Not Found',HttpStatus.NOT_FOUND)
    }

    @ApiParam({name:'articleId'})
    @Post('comment/:articleId')
    addComment(@Param('articleId') articleId, @Body() commentDto : CommentDto ){
        const comment  = this.blogService.addComment(articleId,commentDto);
        if(comment)
            return comment 
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }

    @ApiParam({name:'tagName'})
    @Post('tag/:tagName')
    addTag(@Param('tagName') tagName){
        const tag = this.blogService.addTag(tagName)
        if(tag)
            return tag;
        throw new HttpException('Not Modified',HttpStatus.NOT_FOUND)
    }

    @ApiParam({name:'articleId'})
    @Patch(':articleId/tag/:tagId')
    async tagArticle(@Param('articleId') articleId: number, @Param('tagId') tagId ){
        const article = await this.blogService.tagArticle(articleId,tagId);
        if(article) 
            return article;
        throw new HttpException('Not Modified',HttpStatus.NOT_FOUND)
        
    }
}
