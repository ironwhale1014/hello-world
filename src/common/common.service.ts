import { BadRequestException, Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { PagePaginationDto } from './dto/PaginationDto';

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

  async applyCursorPagination<T>(
    qb: SelectQueryBuilder<T>,
    take: number,
    order: string[],
    cursor: string,
  ) {
    if (cursor) {
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
    const nextCursor = this.generateCursor(await qb.getMany(), order);
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
