const express=require('express');
const router=express.Router();
//拿到数据库里模型
const { Setting } = require('../../models');
//模糊查询条件
const {
    NotFoundError,
    getArticle,
    success
  } = require('../../utils/responses');
  
/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{copyright: (string|*), icp: (string|string|DocumentFragment|*), name}}
 */
function filterBody(req) {
  return {
    name: req.body.name,
    icp: req.body.icp,
    copyright: req.body.copyright
  };
}
/**
 * 公共方法：查询当前系统设置
 */
async function getSetting() {
  const setting = await Setting.findOne();
  if (!setting) {
    throw new NotFoundError('初始系统设置未找到，请运行种子文件。')
  }

  return setting;
}

  
  //根据系统设置ID查询系统设置详情
router.get('/',async (req,res)=>{
    try{
        //查询系统设置
        const setting = await getSetting();
        success(res,'success',setting);
    }catch(err){
        res.status(500).json({
            status:false,
            message:'查询失败',
            error:err.message
        })
    }
    
  })

  //更新接口
  router.put('/:id',async (req,res)=>{
    try{
        const {id}=req.params;
        //查询数据库里是否有这个系统设置
        const setting=await Setting.findByPk(id);
        //拿到前端更新的数据
        const webdata=filterBody(req.body)
        if(setting){
            await setting.update(webdata);
            success(res,'update successful',setting)
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

  
module.exports=router;