import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { BanStatus, DbSortDirection, SortDirection } from './enums';
import { SortSetting } from './types';

export const getFilterByDbId = (id: string): { _id: Types.ObjectId } => ({
  _id: new Types.ObjectId(id),
});

export const countSkipValue = (
  pageNumber: number,
  pageSize: number,
): number => {
  return (pageNumber - 1) * pageSize;
};

export const setSortValue = (
  sortBy: string,
  sortDirection: SortDirection,
): SortSetting => {
  return {
    [sortBy]:
      sortDirection === SortDirection.asc
        ? DbSortDirection.ASC
        : DbSortDirection.DESC,
  };
};

export const setBanFilter = (value: BanStatus) => {
  switch (value) {
    case BanStatus.BANNED:
      return { ['banInfo.isBanned']: true };
    case BanStatus.NOT_BANNED:
      return { ['banInfo.isBanned']: false };
    default:
      return {};
  }
};

export const validateOrRejectInputDto = async (
  dto: object,
  classConstructor: { new (): object },
): Promise<void> => {
  if (!(dto instanceof classConstructor)) {
    throw new Error('Incorrect input data!');
  }

  try {
    await validateOrReject(dto);
  } catch (error) {
    throw new Error(error);
  }
};

export const makeCapitalizeString = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateCustomBadRequestException = (
  message: string,
  field: string,
): never => {
  throw new BadRequestException([{ message, field }]);
};
