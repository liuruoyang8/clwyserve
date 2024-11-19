const express=require('express');
const router=express.Router();
//拿到数据库里模型
const { Category,Course } = require('../../models');
//模糊查询条件
const { Op } = require('sequelize');
const {
    NotFoundError,
    success,
    failure
  } = require('../../utils/responses');
  /**
 * 公共方法：查询当前分类
 */
async function getCategory(req) {
  const { id } = req.params;
  const condition = {
    include: [
      {
        model: Course,
        as: 'courses',
      },
    ]
  }

  const category = await Category.findByPk(id, condition);
  if (!category) {
    throw new NotFoundError(`ID: ${ id }的分类未找到。`)
  }

  return category;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{name, rank: (string|string|DocumentFragment|*)}}
 */
function filterBody(req) {
    return {
      name: req.body.name,
      rank: req.body.rank
    };
  }
  
  //根据分类ID查询分类详情
router.get('/:id',async (req,res)=>{
    try{
        //查询分类

        const category=await getCategory(req);
        success(res,'success',{category});
    }catch(err){
        res.status(500).json({
            status:false,
            message:'查询失败',
            error:err.message
        })
    }
    
  })
/**
 * 创建分类
 * POST /admin/categories
 */
router.post('/', async function (req, res)  {
    const data=filterBody(req.body)
    try{
        const category=await Category.create(data);
        success(res,'success',category);
    }catch(err){
        res.status(500).json({
            status:false,
            message:'error',
            error:err.message
        })
    }
  });
  //删除接口
  router.delete('/:id',async (req,res)=>{
    try{
        
        const category = await getCategory(req);
        const count = await Course.count({ where: { categoryId: req.params.id } });
        if (count > 0) {
          throw new Error('当前分类有课程，无法删除。');
        }
        await category.destroy();
        success(res, '删除分类成功。');
    }catch(error){
      failure(res, error);
    }
  })
  //更新接口
  router.put('/:id',async (req,res)=>{
    try{
        const {id}=req.params;
        //查询数据库里是否有这个分类
        const category=await Category.findByPk(id);
        //拿到前端更新的数据
        const webdata=filterBody(req.body)
        if(category){
            await category.update(webdata);
            success(res,'update successful',category)
        }else{
            res.status(404).json({
                status:false,
                message:'update filed',
            })
        }
    }catch(err){
        res.status(500).json({
            status:false,
            message:err.message
        })
    }
    
  })
  /**
 * 查询分类列表
 * GET /admin/categories
 * 带分页
 */
router.get('/', async function (req, res) {
    try {
      // 获取查询参数
      const query = req.query;
  
      // 获取分页所需要的两个参数，currentPage 和 pageSize
      // 如果没有传递这两个参数，就使用默认值
      // 默认是第1页
      // 默认每页显示 10 条数据
      const currentPage = Math.abs(Number(query.currentPage)) || 1;
      const pageSize = Math.abs(Number(query.pageSize)) || 10;
  
      // 计算offset
      const offset = (currentPage - 1) * pageSize;
  
      // 定义查询条件
      const condition = {
        order: [['id', 'DESC']],
  
        // 在查询条件中添加 limit 和 offset
        limit: pageSize,
        offset: offset
      };
  
      // 如果有 name 查询参数，就添加到 where 条件中
      if (query.name) {
        condition.where = {
          name: {
            [Op.like]: `%${query.name}%`
          }
        };
      }
  
      // 查询数据
      // 将 findAll 方法改为 findAndCountAll 方法
      // findAndCountAll 方法会返回一个对象，对象中有两个属性，一个是 count，一个是 rows，
      // count 是查询到的数据的总数，rows 中才是查询到的数据
      const { count, rows } = await Category.findAndCountAll(condition);
  // 查询分类列表
success(res, '查询分类列表成功。', {
    categories: rows,
    pagination: {
      total: count,
      currentPage,
      pageSize,
    }
  });
      
    } catch (error) {
      // 返回错误信息
      res.status(500).json({
        status: false,
        message: '查询分类列表失败。',
        errors: [error.message]
      });
    }
  });
  
module.exports=router;