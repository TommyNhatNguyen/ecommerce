import { Op, Transaction } from 'sequelize';
import { Includeable, Sequelize, WhereOptions } from 'sequelize';
import { imageModelName } from 'src/infras/repository/image/dto';
import { ImagePersistence } from 'src/infras/repository/image/dto';
import {
  BlogsConditionDTOSchema,
  BlogsCreateDTOSchema,
  BlogsUpdateDTOSchema,
} from 'src/modules/blogs/models/blogs.dto';
import { IBlogsRepository } from 'src/modules/blogs/models/blogs.interface';
import { Blogs } from 'src/modules/blogs/models/blogs.model';
import {
  userModelName,
  UserPersistence,
} from 'src/modules/user/infras/repo/dto';
import { EXCLUDE_ATTRIBUTES } from 'src/share/constants/exclude-attributes';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class PostgresBlogsPersistence implements IBlogsRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelname: string
  ) {}
  async get(
    id: string,
    condition?: BlogsConditionDTOSchema,
    t?: Transaction
  ): Promise<Blogs | null> {
    const include: Includeable[] = [];
    if (condition?.include_image) {
      include.push({
        model: ImagePersistence,
        as: imageModelName.toLowerCase(),
        attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
      });
    }
    if (condition?.include_users) {
      include.push({
        model: UserPersistence,
        as: userModelName.toLowerCase(),
        attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
      });
    }
    if (t) {
      const blogs = await this.sequelize.models[this.modelname].findByPk(id, {
        include,
        transaction: t,
      });
      return blogs?.dataValues;
    } else {
      const blogs = await this.sequelize.models[this.modelname].findByPk(id, {
        include,
      });
      return blogs?.dataValues;
    }
  }
  async list(
    paging: PagingDTO,
    condition?: BlogsConditionDTOSchema,
    t?: Transaction
  ): Promise<ListResponse<Blogs[]>> {
    const include: Includeable[] = [];
    if (condition?.include_image) {
      include.push({
        model: ImagePersistence,
        as: imageModelName.toLowerCase(),
        attributes: { exclude: [...EXCLUDE_ATTRIBUTES] },
      });
    }
    if (condition?.include_users) {
      include.push({
        model: UserPersistence,
        as: userModelName.toLowerCase(),
        attributes: { exclude: [...EXCLUDE_ATTRIBUTES, 'hash_password'] },
      });
    }
    const { page, limit } = paging;
    if (t) {
      const { rows, count } = await this.sequelize.models[
        this.modelname
      ].findAndCountAll({
        include,
        transaction: t,
        offset: (page - 1) * limit,
        limit,
        order: [['created_at', 'DESC']],
        where: {
          status: {
            [Op.not]: 'DELETED',
          },
        },
      });
      return {
        data: rows.map((row) => row.dataValues),
        meta: {
          total_count: count,
          total_page: Math.ceil(count / limit),
          current_page: page,
          limit,
        },
      };
    } else {
      const { rows, count } = await this.sequelize.models[
        this.modelname
      ].findAndCountAll({
        include,
        offset: (page - 1) * limit,
        limit,
        order: [['created_at', 'DESC']],
        where: {
          status: {
            [Op.not]: 'DELETED',
          },
        },
      });
      return {
        data: rows.map((row) => row.dataValues),
        meta: {
          total_count: count,
          total_page: Math.ceil(count / limit),
          current_page: page,
          limit,
        },
      };
    }
  }
  async insert(data: BlogsCreateDTOSchema, t?: Transaction): Promise<Blogs> {
    if (t) {
      const blogs = await this.sequelize.models[this.modelname].create(data, {
        transaction: t,
        returning: true,
      });
      return blogs.dataValues;
    } else {
      const blogs = await this.sequelize.models[this.modelname].create(data, {
        returning: true,
      });
      return blogs.dataValues;
    }
  }
  async update(
    id: string,
    data: BlogsUpdateDTOSchema,
    t?: Transaction
  ): Promise<Blogs> {
    if (t) {
      const blogs = await this.sequelize.models[this.modelname].update(data, {
        where: { id },
        transaction: t,
        returning: true,
      });
      return blogs[1][0].dataValues;
    } else {
      const blogs = await this.sequelize.models[this.modelname].update(data, {
        where: { id },
        returning: true,
      });
      return blogs[1][0].dataValues;
    }
  }
  async delete(id: string, t?: Transaction): Promise<boolean> {
    if (t) {
      await this.sequelize.models[this.modelname].destroy({
        where: { id },
        transaction: t,
      });
      return true;
    } else {
      await this.sequelize.models[this.modelname].destroy({
        where: { id },
      });
      return true;
    }
  }
}
