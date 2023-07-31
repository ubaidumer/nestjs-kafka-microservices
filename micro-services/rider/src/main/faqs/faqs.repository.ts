import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Faqs } from 'src/entity/faqs.entity';
import { ILike, Repository } from 'typeorm';

// repository to rider feedback table where we can make query requests to database
@Injectable()
export class FAQSRepository {
  constructor(
    @InjectRepository(Faqs)
    private faqsRepo: Repository<Faqs>,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      return await this.faqsRepo.insert(body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // search query and exception handling
  async find(data) {
    const { skip, take, sort, status, type, question } = data;
    let query = {};

    query = {
      ...(status && {
        status,
      }),
      ...(type && {
        type,
      }),
      ...(question && {
        question: ILike('%' + question + '%'),
      }),
    };
    const response = await this.faqsRepo.findAndCount({
      skip,
      take,
      order: { createdAt: sort.toUpperCase() },
      where: {
        ...query,
      },
    });

    return {
      data: response[0],
      page: skip,
      limit: take,
      count: response[1],
    };
  }

  // search by rider feedback id query and exception handling
  async findById(id) {
    try {
      return await this.faqsRepo.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // update by rider Leaves id query and exception handling
  async update(id, body) {
    try {
      return await this.faqsRepo.update(id, body);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // delete by Faqs id query and exception handling
  async delete(id) {
    try {
      return await this.faqsRepo.delete(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
