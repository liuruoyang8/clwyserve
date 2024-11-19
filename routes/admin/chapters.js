const express = require('express');
const router = express.Router();
const { Chapter } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');


/**
 * 查询文章列表
 * GET /admin/chapters
 */
router.get('/', async function (req, res) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;
    console.log(query.courseId,'queryssss')
    if (!query.courseId) {
        throw new Error('获取章节列表失败，课程ID不能为空。');
      }
      
      const condition = {
        ...getCondition(),
        order: [['rank', 'ASC'], ['id', 'ASC']],
        limit: pageSize,
        offset: offset
      };
    condition.where = {
        courseId: {
          [Op.eq]: query.courseId
        }
      };
    if (query.title) {
        condition.where = {
          title: {
            [Op.like]: `%${ query.title }%`
          }
        };
      }

    const { count, rows } = await Chapter.findAndCountAll(condition);
    success(res, '查询文章列表成功。', {
      chapters: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      }
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询文章详情
 * GET /admin/chapters/:id
 */
router.get('/:id', async function (req, res) {
  try {
    const chapter = await getChapter(req);
    success(res, '查询文章成功。', { chapter });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 创建文章
 * POST /admin/chapters
 */
router.post('/', async function (req, res) {
  try {
    const body = filterBody(req);

    const chapter = await Chapter.create(body);
    success(res, '创建文章成功。', { chapter }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 更新文章
 * PUT /admin/chapters/:id
 */
router.put('/:id', async function (req, res) {
  try {
    const chapter = await getChapter(req);
    const body = filterBody(req);

    await chapter.update(body);
    success(res, '更新文章成功。', { chapter });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除文章
 * DELETE /admin/chapters/:id
 */
router.delete('/:id', async function (req, res) {
  try {
    const chapter = await getChapter(req);

    await chapter.destroy();
    success(res, '删除文章成功。');
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：查询当前章节
 */
async function getChapter(req) {
    const { id } = req.params;
    const condition = getCondition();
  
    const chapter = await Chapter.findByPk(id, condition);
    if (!chapter) {
      throw new NotFoundError(`ID: ${ id }的章节未找到。`)
    }
  
    return chapter;
  }
  
/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{rank: (number|*), video: (string|boolean|MediaTrackConstraints|VideoConfiguration|*), title, courseId: (number|*), content}}
 */
function filterBody(req) {
    return {
      courseId: req.body.courseId,
      title: req.body.title,
      content: req.body.content,
      video: req.body.video,
      rank: req.body.rank
    };
  }

  /**
 * 公共方法：关联课程数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
    return {
      attributes: { exclude: ['CourseId'] },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name']
        }
      ]
    }
  }
  
module.exports = router;
