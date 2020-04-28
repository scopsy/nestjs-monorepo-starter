import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Document, Model } from 'mongoose';

export class BaseRepository<T> {
  constructor(protected model: Model<any & Document>, protected entity: ClassType<T>) {}

  async count(query: any): Promise<number> {
    return await this.model.countDocuments(query);
  }

  async aggregate(query: any[]): Promise<any> {
    return await this.model.aggregate(query);
  }

  async findById(id: string, select?: keyof T): Promise<T | null> {
    const data = await this.model.findById(id, select);
    if (!data) return null;

    return this.mapEntity(data.toObject());
  }

  async findOne(query: any, select?: keyof T) {
    const data = await this.model.findOne(query, select);
    if (!data) return null;

    return this.mapEntity(data.toObject());
  }

  async delete(query: any) {
    const data = await this.model.remove(query);
    return data;
  }

  async find(query: any, select?: string, options?: { limit?: number; sort?: any; skip?: number; }): Promise<T[]> {
    if (!options) options = {};

    const data = await this.model.find(query, select, {
      sort: options.sort || null,
    }).skip(options.skip).limit(options.limit).lean().exec();

    return this.mapEntities(data);
  }

  async create(data: Partial<T>): Promise<T> {
    const newEntity = new this.model(data);
    const saved = await newEntity.save();

    return this.mapEntity(saved);
  }

  async createMany(data: T[]) {
    await new Promise((resolve) => {
      this.model.collection.insertMany(data, (err) => {
        resolve();
      });
    });
  }

  async update(query: any, updateBody: any): Promise<{
    matched: number;
    modified: number;
  }> {
    const saved = await this.model.update(query, updateBody, {
      multi: true
    });

    return {
      matched: saved.nMatched,
      modified: saved.nModified
    };
  }

  protected mapEntity(data: any): T {
    return plainToClass<T, T>(this.entity, JSON.parse(JSON.stringify(data))) as any;
  }

  protected mapEntities(data: any): T[] {
    return plainToClass<T, T[]>(this.entity, JSON.parse(JSON.stringify(data)));
  }
}
