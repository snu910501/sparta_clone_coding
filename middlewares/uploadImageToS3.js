const { S3 } = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();
const path = require("path");

module.exports = uploadVidToS3 = async (image) => {
  let url = [];
  const s3 = new S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: "ap-northeast-2",
  });

  const promiseList = image.map((file) => {
    const fileStream = fs.createReadStream(file.path);
    // buffer, stream

    return s3
      .upload({
        Bucket: "clone-coding-syk",
        // 파일명
        Key: `${file.originalname}`,
        Body: fileStream,
      })
      .promise();
  });

  const result = await Promise.all(promiseList);

  console.log("url", result);
  result.map((v) => {
    url.push({ location: v.Location, fileName: v.key });
  });

  // S3 업로드 후 uploads 폴더 내 파일 삭제
  fs.readdir("uploads/", (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join("uploads/", file), (err) => {
        if (err) throw err;
      });
    }
  });

  return url;
};
