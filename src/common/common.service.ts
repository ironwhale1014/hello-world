import { BadRequestException, Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { PagePaginationDto } from './dto/PaginationDto';
import { CursorDto } from './dto/cursor.dto';

@Injectable()
export class CommonService {
  constructor() {}

  applyPagePaginationParamsToQb<T>(
    qb: SelectQueryBuilder<T>,
    dto: PagePaginationDto,
  ) {
    const { page, take } = dto;

    const skip = (page - 1) * take;
    qb.take(take);
    qb.skip(skip);
  }

  async applyCursorPagination<T>(qb: SelectQueryBuilder<T>, dto: CursorDto) {
    let { order } = dto;
    const { take, cursor } = dto;

    if (cursor) {
      const parsedCursor = Buffer.from(cursor, 'base64').toString('utf-8');
      const jsonCursor = JSON.parse(parsedCursor);
      // {
      //   values: {
      //     id: 5;
      //   }
      // ,
      //   order: ['id_ASC'];
      // }
      //(movie.column1, movie.column2, movie.column3) > (:value1, :value2, :value3)
      order = jsonCursor.order;
      const values = jsonCursor.values;
      const directionCondition = order.some((o) => o.endsWith('ASC'))
        ? '>'
        : '<';
      const columns = Object.keys(values)
        .map((value) => `${qb.alias}.${value}`)
        .join(', ');
      const valueConditions = Object.keys(values)
        .map((value) => `:${value}`)
        .join(', ');

      console.log(`(${columns}) ${directionCondition} (${valueConditions})`);

      qb.where(
        `(${columns}) ${directionCondition} (${valueConditions})`,
        values,
      );
    }

    for (let i = 0; i < order.length; i++) {
      const [column, direction] = order[i].split('_');
      if (direction !== 'ASC' && direction !== 'DESC') {
        throw new BadRequestException('Must be ASC or DESC');
      }

      if (i === 0) {
        qb.orderBy(`${qb.alias}.${column}`, direction);
      } else {
        qb.addOrderBy(`${qb.alias}.${column}`, direction);
      }
    }

    qb.take(take);
    const results = await qb.getMany();
    const nextCursor = this.generateCursor(results, order);
    return { qb, nextCursor };
  }

  generateCursor<T>(results: T[], order: string[]): null | string {
    if (results.length === 0) {
      return null;
    }
    /*
        return 
    {
    values:{
        }
        
     order :[id_ASC]
    }     
     */

    const lastItem = results[results.length - 1];
    const values = {};
    order.forEach((item) => {
      const [column] = item.split('_');
      values[column] = lastItem[column];
    });

    const cursorObj = { values, order };
    return Buffer.from(JSON.stringify(cursorObj)).toString('base64');
  }
}
