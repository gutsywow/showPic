const config = require('./config'),
      fs = require('fs'),
      cheerio = require('cheerio'),
      axios = require('axios');
      var j = 1;//文件名初始值
let currentPageNum = 1//当前页数

  //主函数
  const main = async pageNum => {
    console.log()
    console.log(`start ... 当前页码：${pageNum}`)
    // 根据页码获取页面对象
    let pageUrl = `${config.originPath}?pager_offset=${pageNum}`
    const page = await getPage(pageUrl)
    // 获取页面内的相册list
    let albumList = getAlbumList(page)
    console.log("123",albumList)
    downloadAlbumList(albumList)
    // savedContent(albumList);

  }
  main(currentPageNum)

// 下载本页面的所有图片
const downloadAlbumList = async (list) => {
  console.log("11111111111111111111",list)
  var arr = [];
  var Arraya =  arr.push(list)
  console.log("array  array",Arraya)
    let index = 0
    for (let i = 0; i < list.length; i++) {
      // 下载相册
      await downloadAlbum(list[i])
      index++
    }
    // 判断本页相册是否下载完毕 
    if (index === list.length) {
      console.log(`第${currentPageNum}页下载完成，共${index}个相册。========================== `)
      if (currentPageNum < config.maxPage) {
        // 进行下一页的相册爬取
        main(++currentPageNum)
      }
    }
  }

// 下载相册
const downloadAlbum = async album => {
    // 过滤相册名称中不符合命名规则的部分字符
    // console.log("sdsad")
    album.name = album.name.replace(/[:"\*\|]/g, '')
    // 判断相册是否存在
    let folderPath = `../img`//保存图片的路径
        await downloadImage(album,`${folderPath}/${j}.jpg`)//文件重命名
        console.log(`${folderPath}/${j}.jpg`)
        j++;
  }
  
 async function getPage (url) {
    // console.log("111212",url)
    return {
      res: await axios.get(url)
    }
  }
  var arr = [] ;//装数据

  function getAlbumList(page){
    let list = [];
    const $ = cheerio.load(page.res.data);
    $('.img_single a img').each((index, item) => {
      let album = {
        name: item.attribs.alt, // 相册名称
        url: item.attribs.src // 相册地址
      }
      list.push(album)
      // console.log("数组",arr)
      // var ablums = JSON.stringify( arr )

      // fs.appendFile('./imgInfo/' + 'imgInfo.txt', album.name+"\n", 'utf-8', function(err) {
     
    })
    // console.log("listttttttttttttttt",list)
    // console.log("描述",list[0])
    // arr.push(list)
    var ablums = JSON.stringify( list,null,'\t' )
    arr.push(ablums)
    console.log("打印",arr)

    fs.writeFileSync('../imgInfo/' + 'imgInfo.json', arr+"\n", 'utf-8', function(err) {
      if(err) {
          console.log(err);
      }
    });
    return list
}


  //下载图片
  async function downloadImage (album, fileName) {
    console.log("sssssssssss")
    let headers = {
      // Referer: album.url,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
    }
    await axios({
      method: 'get',
      url: album.url,
      responseType: 'stream',
      headers
    }).then(function(response) {
      response.data.pipe(fs.createWriteStream(fileName))
      console.log("存放图片的路径")
      
    })
  }

