import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Document } from 'mongoose';
import { CreateIndexesOptions } from 'mongodb';

export abstract class AbstractRepository<TDocument extends Document> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: TDocument): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument | undefined> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true }).exec();

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as unknown as TDocument;
  }

  async findById(
    id: string,
  ): Promise<TDocument | undefined> {
    const document = await this.model.findById(id, {}, { lean: true }).exec();

    if (!document) {
      this.logger.warn('Document not found with id', id);
      throw new NotFoundException('Document not found.');
    }

    return document as unknown as TDocument;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as unknown as TDocument;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(
      filterQuery,
      {},
      { lean: true },
    ) as unknown as TDocument[];
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery, {
      lean: true,
    }) as unknown as TDocument;
  }

  async createIndex(options: CreateIndexesOptions) {
    return this.model.createIndexes(options as any);
  }
}
